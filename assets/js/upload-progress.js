/**
 * 文件上传进度条组件
 * 支持拖拽上传、进度显示、多文件上传
 */

class UploadManager {
    constructor(options = {}) {
        this.uploadUrl = options.uploadUrl || 'api/upload.php';
        // 动态获取用户上传限制，默认100MB
        this.maxFileSize = options.maxFileSize || 100 * 1024 * 1024;
        this.allowedTypes = options.allowedTypes || [];
        
        // 获取用户实际上传限制
        this.getUserUploadLimit();
    }
    
    // 获取用户上传限制
    async getUserUploadLimit() {
        try {
            const response = await fetch('api/get_user_upload_limit.php');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.maxFileSize = result.data.max_file_size;
                console.log(`用户上传限制已更新为: ${result.data.max_file_size_mb}MB`);
            }
        } catch (error) {
            console.warn('获取用户上传限制失败，使用默认值:', error);
        }
        this.maxFiles = options.maxFiles || 10;
        
        this.onProgress = options.onProgress || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
        
        this.uploadQueue = [];
        this.isUploading = false;
        
        this.initializeUploadArea();
    }
    
    /**
     * 初始化上传区域
     */
    initializeUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const selectBtn = document.getElementById('selectFileBtn');
        
        if (!uploadArea || !fileInput) {
            console.error('上传区域或文件输入框不存在');
            return;
        }
        
        // 标记已初始化，防止重复绑定
        if (uploadArea.dataset.initialized === 'true') {
            console.log('⚠️ 上传区域已初始化，跳过');
            return;
        }
        
        console.log('🚀 初始化上传区域...');
        
        // 拖拽事件
        uploadArea.ondragover = (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        };
        
        uploadArea.ondragleave = (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        };
        
        uploadArea.ondrop = (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        };
        
        // 点击上传区域（但不包括按钮）
        uploadArea.onclick = (e) => {
            // 如果点击的是按钮或按钮内的元素，不触发
            if (e.target.closest('#selectFileBtn')) {
                return;
            }
            fileInput.click();
        };
        
        // 按钮点击事件
        if (selectBtn) {
            selectBtn.onclick = (e) => {
                e.stopPropagation();
                fileInput.click();
            };
        }
        
        // 文件选择事件
        fileInput.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                console.log('📁 选择了文件:', files.map(f => f.name));
                this.handleFiles(files);
                e.target.value = ''; // 清空输入框
            }
        };
        
        // 标记为已初始化
        uploadArea.dataset.initialized = 'true';
        console.log('✅ 上传区域初始化完成');
    }
    
    /**
     * 处理选择的文件
     */
    handleFiles(files) {
        if (files.length === 0) return;
        
        // 验证文件
        const validFiles = [];
        for (const file of files) {
            const validation = this.validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                this.showError(`文件 "${file.name}" ${validation.error}`);
            }
        }
        
        if (validFiles.length === 0) return;
        
        // 检查队列限制
        if (this.uploadQueue.length + validFiles.length > this.maxFiles) {
            this.showError(`最多只能同时上传 ${this.maxFiles} 个文件`);
            return;
        }
        
        // 添加到上传队列
        for (const file of validFiles) {
            const uploadItem = {
                id: this.generateId(),
                file: file,
                progress: 0,
                status: 'pending', // pending, uploading, completed, error
                xhr: null
            };
            
            this.uploadQueue.push(uploadItem);
            this.addUploadItem(uploadItem);
        }
        
        // 开始上传
        this.startUpload();
    }
    
    /**
     * 验证文件
     */
    validateFile(file) {
        // 检查文件大小
        if (file.size > this.maxFileSize) {
            const maxSizeMB = Math.round(this.maxFileSize / (1024 * 1024));
            return {
                valid: false,
                error: `文件大小不能超过${maxSizeMB}MB`
            };
        }
        
        // 检查文件类型（如果有限制）
        if (this.allowedTypes.length > 0) {
            const fileExt = file.name.split('.').pop().toLowerCase();
            if (!this.allowedTypes.includes(fileExt)) {
                return {
                    valid: false,
                    error: `不支持的文件类型，允许的类型: ${this.allowedTypes.join(', ')}`
                };
            }
        }
        
        return { valid: true };
    }
    
    /**
     * 开始上传
     */
    async startUpload() {
        if (this.isUploading) return;
        
        this.isUploading = true;
        this.showUploadProgress();
        
        // 逐个上传文件
        for (const item of this.uploadQueue) {
            if (item.status === 'pending') {
                await this.uploadFile(item);
            }
        }
        
        this.isUploading = false;
        
        // 检查是否所有文件都上传完成
        const completedCount = this.uploadQueue.filter(item => item.status === 'completed').length;
        const errorCount = this.uploadQueue.filter(item => item.status === 'error').length;
        
        if (completedCount > 0) {
            this.showSuccess(`成功上传 ${completedCount} 个文件${errorCount > 0 ? `，${errorCount} 个失败` : ''}`);
            
            // 3秒后刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }
    
    /**
     * 上传单个文件
     */
    uploadFile(item) {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('file', item.file);
            
            // 添加CSRF令牌
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                formData.append('csrf_token', csrfToken);
            }
            
            const xhr = new XMLHttpRequest();
            item.xhr = xhr;
            item.status = 'uploading';
            
            // 上传进度
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    item.progress = progress;
                    
                    console.log(`📈 文件 ${item.file.name} 上传进度: ${progress.toFixed(1)}%`);
                    
                    this.updateUploadItem(item);
                    this.updateOverallProgress();
                    this.onProgress(item.id, progress, e.loaded, e.total);
                }
            });
            
            // 上传完成
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            item.status = 'completed';
                            item.progress = 100;
                            this.updateUploadItem(item);
                            this.onComplete(item.id, response);
                        } else {
                            item.status = 'error';
                            item.error = response.message || '上传失败';
                            this.updateUploadItem(item);
                            this.onError(item.id, item.error);
                        }
                    } catch (e) {
                        item.status = 'error';
                        item.error = '服务器响应格式错误';
                        this.updateUploadItem(item);
                        this.onError(item.id, item.error);
                    }
                } else {
                    item.status = 'error';
                    item.error = `HTTP ${xhr.status}: ${xhr.statusText}`;
                    this.updateUploadItem(item);
                    this.onError(item.id, item.error);
                }
                
                resolve();
            });
            
            // 上传错误
            xhr.addEventListener('error', () => {
                item.status = 'error';
                item.error = '网络错误';
                this.updateUploadItem(item);
                this.onError(item.id, item.error);
                resolve();
            });
            
            // 上传中止
            xhr.addEventListener('abort', () => {
                item.status = 'error';
                item.error = '上传已取消';
                this.updateUploadItem(item);
                resolve();
            });
            
            // 发送请求
            xhr.open('POST', this.uploadUrl);
            xhr.send(formData);
        });
    }
    
    /**
     * 显示上传进度窗口
     */
    showUploadProgress() {
        // 移除已存在的进度窗口
        const existingModal = document.getElementById('upload-progress-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'upload-progress-modal';
        modal.innerHTML = `
            <div class="upload-progress-overlay">
                <div class="upload-progress-dialog">
                    <div class="upload-progress-header">
                        <h3>📤 文件上传中</h3>
                        <button class="upload-close-btn" onclick="this.closest('#upload-progress-modal').remove()">×</button>
                    </div>
                    <div class="upload-progress-body">
                        <div class="upload-queue" id="upload-queue">
                            <!-- 上传项目将在这里显示 -->
                        </div>
                        <div class="upload-overall-progress">
                            <div class="upload-overall-bar">
                                <div class="upload-overall-fill" id="upload-overall-fill" style="width: 0%"></div>
                            </div>
                            <div class="upload-overall-text" id="upload-overall-text">总进度: 0%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        if (!document.getElementById('upload-progress-styles')) {
            const style = document.createElement('style');
            style.id = 'upload-progress-styles';
            style.textContent = `
                .upload-progress-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                
                .upload-progress-dialog {
                    background: white;
                    border-radius: 12px;
                    padding: 0;
                    min-width: 500px;
                    max-width: 600px;
                    max-height: 80vh;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                }
                
                .upload-progress-header {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .upload-progress-header h3 {
                    margin: 0;
                    font-size: 18px;
                }
                
                .upload-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                
                .upload-close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .upload-progress-body {
                    padding: 24px;
                }
                
                .upload-queue {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                }
                
                .upload-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    background: #f8f9fa;
                }
                
                .upload-item.uploading {
                    background: #fff3cd;
                    border-color: #ffeaa7;
                }
                
                .upload-item.completed {
                    background: #d4edda;
                    border-color: #c3e6cb;
                }
                
                .upload-item.error {
                    background: #f8d7da;
                    border-color: #f5c6cb;
                }
                
                .upload-file-icon {
                    font-size: 24px;
                    margin-right: 12px;
                    width: 30px;
                    text-align: center;
                }
                
                .upload-file-info {
                    flex: 1;
                    min-width: 0;
                }
                
                .upload-file-name {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .upload-file-size {
                    font-size: 12px;
                    color: #666;
                }
                
                .upload-file-progress {
                    width: 120px;
                    margin: 0 12px;
                }
                
                .upload-progress-bar {
                    width: 100%;
                    height: 6px;
                    background: #e9ecef;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }
                
                .upload-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                    width: 0%;
                }
                
                .upload-progress-text {
                    font-size: 11px;
                    color: #666;
                    text-align: center;
                }
                
                .upload-file-status {
                    width: 80px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .upload-file-status.pending {
                    color: #6c757d;
                }
                
                .upload-file-status.uploading {
                    color: #f39c12;
                }
                
                .upload-file-status.completed {
                    color: #28a745;
                }
                
                .upload-file-status.error {
                    color: #dc3545;
                }
                
                .upload-overall-progress {
                    border-top: 1px solid #e9ecef;
                    padding-top: 16px;
                }
                
                .upload-overall-bar {
                    width: 100%;
                    height: 10px;
                    background: #e9ecef;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                
                .upload-overall-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #28a745, #20c997);
                    border-radius: 5px;
                    transition: width 0.3s ease;
                }
                
                .upload-overall-text {
                    text-align: center;
                    font-weight: 600;
                    color: #333;
                }
                
                .dragover {
                    border-color: #667eea !important;
                    background: #f8f9ff !important;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
    }
    
    /**
     * 添加上传项目到队列显示
     */
    addUploadItem(item) {
        const queue = document.getElementById('upload-queue');
        if (!queue) return;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'upload-item pending';
        itemElement.id = `upload-item-${item.id}`;
        itemElement.innerHTML = `
            <div class="upload-file-icon">${this.getFileIcon(item.file.name)}</div>
            <div class="upload-file-info">
                <div class="upload-file-name" title="${item.file.name}">${item.file.name}</div>
                <div class="upload-file-size">${this.formatBytes(item.file.size)}</div>
            </div>
            <div class="upload-file-progress">
                <div class="upload-progress-bar">
                    <div class="upload-progress-fill"></div>
                </div>
                <div class="upload-progress-text">0%</div>
            </div>
            <div class="upload-file-status pending">等待中</div>
        `;
        
        queue.appendChild(itemElement);
    }
    
    /**
     * 更新上传项目显示
     */
    updateUploadItem(item) {
        const itemElement = document.getElementById(`upload-item-${item.id}`);
        if (!itemElement) return;
        
        // 更新样式类
        itemElement.className = `upload-item ${item.status}`;
        
        // 更新进度条
        const progressFill = itemElement.querySelector('.upload-progress-fill');
        const progressText = itemElement.querySelector('.upload-progress-text');
        const statusElement = itemElement.querySelector('.upload-file-status');
        
        if (progressFill) {
            progressFill.style.width = `${item.progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(item.progress)}%`;
        }
        
        if (statusElement) {
            statusElement.className = `upload-file-status ${item.status}`;
            
            switch (item.status) {
                case 'pending':
                    statusElement.textContent = '等待中';
                    break;
                case 'uploading':
                    statusElement.textContent = '上传中';
                    break;
                case 'completed':
                    statusElement.textContent = '完成';
                    break;
                case 'error':
                    statusElement.textContent = '失败';
                    statusElement.title = item.error || '上传失败';
                    break;
            }
        }
        
        // 更新总进度
        this.updateOverallProgress();
    }
    
    /**
     * 更新总进度
     */
    updateOverallProgress() {
        const totalFiles = this.uploadQueue.length;
        if (totalFiles === 0) return;
        
        const totalProgress = this.uploadQueue.reduce((sum, item) => sum + item.progress, 0);
        const overallProgress = totalProgress / totalFiles;
        
        const overallFill = document.getElementById('upload-overall-fill');
        const overallText = document.getElementById('upload-overall-text');
        
        if (overallFill) {
            overallFill.style.width = `${overallProgress}%`;
            // 添加动画效果
            overallFill.style.transition = 'width 0.3s ease';
        }
        
        if (overallText) {
            const completedCount = this.uploadQueue.filter(item => item.status === 'completed').length;
            const uploadingCount = this.uploadQueue.filter(item => item.status === 'uploading').length;
            
            overallText.textContent = `总进度: ${Math.round(overallProgress)}% (${completedCount}/${totalFiles} 完成${uploadingCount > 0 ? `, ${uploadingCount} 上传中` : ''})`;
        }
        
        console.log(`📊 总进度更新: ${Math.round(overallProgress)}% (${this.uploadQueue.filter(item => item.status === 'completed').length}/${totalFiles})`);
    }
    
    /**
     * 获取文件图标
     */
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📄',
            'doc': '📝', 'docx': '📝',
            'xls': '📊', 'xlsx': '📊',
            'ppt': '📽️', 'pptx': '📽️',
            'txt': '📃',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'bmp': '🖼️',
            'mp4': '🎬', 'avi': '🎬', 'mov': '🎬', 'mkv': '🎬',
            'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
            'zip': '📦', 'rar': '📦', '7z': '📦',
            'exe': '⚙️', 'msi': '⚙️',
            'html': '🌐', 'css': '🎨', 'js': '⚡'
        };
        
        return icons[ext] || '📄';
    }
    
    /**
     * 格式化字节大小
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * 生成唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * 显示错误消息
     */
    showError(message) {
        // 可以集成到现有的通知系统
        alert('错误: ' + message);
    }
    
    /**
     * 显示成功消息
     */
    showSuccess(message) {
        // 可以集成到现有的通知系统
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            font-weight: 600;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// 全局变量防止重复初始化
window.uploadManagerInitialized = false;

// 初始化上传管理器
function initUploadManager() {
    if (window.uploadManagerInitialized) {
        console.log('⚠️ 上传管理器已初始化，跳过');
        return;
    }
    
    console.log('🚀 正在初始化上传管理器...');
    
    window.uploadManager = new UploadManager({
        uploadUrl: 'api/upload.php',
        maxFileSize: 100 * 1024 * 1024, // 默认100MB，会动态更新
        maxFiles: 10,
        onProgress: (id, progress, loaded, total) => {
            console.log(`文件 ${id} 上传进度: ${progress.toFixed(1)}%`);
        },
        onComplete: (id, response) => {
            console.log(`文件 ${id} 上传完成:`, response);
        },
        onError: (id, error) => {
            console.error(`文件 ${id} 上传失败:`, error);
        }
    });
    
    window.uploadManagerInitialized = true;
    console.log('✅ 上传管理器初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUploadManager);
} else {
    initUploadManager();
}
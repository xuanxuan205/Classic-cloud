// 经典云网盘系统 - 仪表板JavaScript (增强版)

let currentSection = 'dashboard';
let currentPage = 1;
let isUploading = false;
let storageStatsCache = null;
let storageStatsTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    // 初始化导航
    initNavigation();
    
    // 初始化文件上传
    initFileUpload();
    
    // 加载仪表板数据
    loadDashboardStats();
    
    // 设置定时刷新存储统计
    setStorageStatsRefresh();
    
    // 绑定搜索事件
    bindSearchEvents();
    
    // 初始化模态框
    initModal();
    
    // 添加错误处理
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(section) {
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // 显示对应内容区域
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    document.getElementById(`${section}-section`).classList.add('active');
    
    currentSection = section;
    currentPage = 1;
    
    // 加载对应数据
    switch (section) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'files':
            loadFileList();
            break;
        case 'trash':
            loadTrashList();
            break;
        case 'shares':
            loadShareList();
            break;
    }
}

function loadDashboardStats() {
    // 显示加载状态
    showStorageLoading(true);
    
    // 使用缓存（如果存在且未过期）
    if (storageStatsCache && (Date.now() - storageStatsCache.timestamp < 30000)) {
        updateDashboardStats(storageStatsCache.data);
        showStorageLoading(false);
        return;
    }
    
    fetch('api/files.php?action=stats', {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 缓存数据
            storageStatsCache = {
                data: data.data,
                timestamp: Date.now()
            };
            updateDashboardStats(data.data);
        } else {
            throw new Error(data.message || '获取统计数据失败');
        }
    })
    .catch(error => {
        console.error('加载统计数据失败:', error);
        showToast('加载统计数据失败: ' + error.message, 'error');
        showStorageError();
    })
    .finally(() => {
        showStorageLoading(false);
    });
}

function updateDashboardStats(stats) {
    try {
        // 更新统计数字
        const fileCountEl = document.getElementById('file-count');
        const storageUsedEl = document.getElementById('storage-used');
        const shareCountEl = document.getElementById('share-count');
        const trashCountEl = document.getElementById('trash-count');
        
        if (fileCountEl) fileCountEl.textContent = stats.file_count || '0';
        if (storageUsedEl) storageUsedEl.textContent = formatFileSize(stats.storage_used || 0);
        if (shareCountEl) shareCountEl.textContent = '0'; // 暂时设为0
        if (trashCountEl) trashCountEl.textContent = stats.trash_count || '0';
        
        // 更新存储进度条
        const progressBar = document.getElementById('storage-progress');
        const progressText = document.getElementById('storage-text');
        
        if (progressBar && progressText) {
            const storageUsed = stats.storage_used || 0;
            const storageLimit = stats.storage_limit || (2 * 1024 * 1024 * 1024); // 默认2GB
            const storagePercent = storageLimit > 0 ? Math.min((storageUsed / storageLimit) * 100, 100) : 0;
            
            progressBar.style.width = storagePercent + '%';
            progressText.textContent = `已使用 ${formatFileSize(storageUsed)} / ${formatFileSize(storageLimit)} (${storagePercent.toFixed(1)}%)`;
            
            // 根据使用率设置进度条颜色
            progressBar.classList.remove('loading');
            if (storagePercent > 90) {
                progressBar.style.background = 'linear-gradient(90deg, #dc3545, #c82333)';
            } else if (storagePercent > 70) {
                progressBar.style.background = 'linear-gradient(90deg, #ffc107, #e0a800)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #1976D2, #42A5F5)';
            }
        }
        
        console.log('存储统计更新成功:', stats);
    } catch (error) {
        console.error('更新统计数据时出错:', error);
        showToast('更新统计数据失败', 'error');
    }
}

function loadFileList(page = 1) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>加载中...</span></div>';
    
    fetch(`api/files.php?action=list&page=${page}&limit=20`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayFileList(data.data.files, 'file-list');
                updatePagination(data.data, 'file-pagination', loadFileList);
            } else {
                fileList.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>暂无文件</h3><p>您还没有上传任何文件</p></div>';
            }
        })
        .catch(error => {
            console.error('加载文件列表失败:', error);
            fileList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>加载失败</h3><p>请刷新页面重试</p></div>';
        });
}

function loadTrashList(page = 1) {
    const trashList = document.getElementById('trash-list');
    trashList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>加载中...</span></div>';
    
    fetch(`api/files.php?action=list&status=0&page=${page}&limit=20`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.files.length > 0) {
                displayFileList(data.data.files, 'trash-list', true);
                updatePagination(data.data, 'trash-pagination', loadTrashList);
            } else {
                trashList.innerHTML = '<div class="empty-state"><i class="fas fa-trash"></i><h3>回收站为空</h3><p>回收站中没有文件</p></div>';
            }
        })
        .catch(error => {
            console.error('加载回收站失败:', error);
            trashList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>加载失败</h3><p>请刷新页面重试</p></div>';
        });
}

function loadShareList() {
    const shareList = document.getElementById('share-list');
    shareList.innerHTML = '<div class="empty-state"><i class="fas fa-share-alt"></i><h3>暂无分享</h3><p>您还没有创建任何分享链接</p></div>';
}

function displayFileList(files, containerId, isTrash = false) {
    const container = document.getElementById(containerId);
    
    if (files.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><h3>暂无文件</h3><p>没有找到任何文件</p></div>';
        return;
    }
    
    let html = '';
    files.forEach(file => {
        const fileIcon = getFileIcon(file.file_type);
        const fileSize = formatFileSize(file.file_size);
        const uploadTime = formatTime(file.created_at);
        
        html += `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-icon ${fileIcon.class}">
                    <i class="${fileIcon.icon}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${escapeHtml(file.original_name)}</div>
                    <div class="file-meta">
                        <span>${fileSize}</span>
                        <span>${uploadTime}</span>
                        <span>下载 ${file.download_count} 次</span>
                    </div>
                </div>
                <div class="file-actions">
                    ${isTrash ? `
                        <button class="file-action restore" onclick="restoreFile(${file.id})" title="恢复">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="file-action delete" onclick="permanentDeleteFile(${file.id})" title="永久删除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : `
                        <button class="file-action download" onclick="downloadFile(${file.id})" title="下载">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="file-action share" onclick="shareFile(${file.id})" title="分享">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="file-action delete" onclick="deleteFile(${file.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updatePagination(data, containerId, loadFunction) {
    const container = document.getElementById(containerId);
    
    if (data.pages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // 上一页
    html += `<button class="page-btn" ${data.page <= 1 ? 'disabled' : ''} onclick="${loadFunction.name}(${data.page - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // 页码
    for (let i = Math.max(1, data.page - 2); i <= Math.min(data.pages, data.page + 2); i++) {
        html += `<button class="page-btn ${i === data.page ? 'active' : ''}" onclick="${loadFunction.name}(${i})">${i}</button>`;
    }
    
    // 下一页
    html += `<button class="page-btn" ${data.page >= data.pages ? 'disabled' : ''} onclick="${loadFunction.name}(${data.page + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    container.innerHTML = html;
}

function initFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    // 点击上传区域选择文件
    uploadArea.addEventListener('click', () => {
        if (!isUploading) {
            fileInput.click();
        }
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            uploadFiles(e.target.files);
        }
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (!isUploading && e.dataTransfer.files.length > 0) {
            uploadFiles(e.dataTransfer.files);
        }
    });
}

function uploadFiles(files) {
    if (isUploading) {
        showToast('正在上传中，请稍候', 'warning');
        return;
    }
    
    isUploading = true;
    const uploadQueue = document.getElementById('upload-queue');
    const csrfToken = document.getElementById('csrf-token').value;
    
    uploadQueue.classList.add('active');
    uploadQueue.innerHTML = '';
    
    const formData = new FormData();
    formData.append('csrf_token', csrfToken);
    formData.append('folder_id', '0');
    
    // 添加文件到FormData和显示队列
    Array.from(files).forEach((file, index) => {
        formData.append('files[]', file);
        
        const uploadItem = createUploadItem(file, index);
        uploadQueue.appendChild(uploadItem);
    });
    
    // 上传文件
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            updateUploadProgress(percent);
        }
    });
    
    xhr.addEventListener('load', function() {
        isUploading = false;
        
        try {
            const response = JSON.parse(xhr.responseText);
            handleUploadResponse(response);
        } catch (error) {
            console.error('上传响应解析失败:', error);
            showToast('上传失败，请重试', 'error');
        }
    });
    
    xhr.addEventListener('error', function() {
        isUploading = false;
        showToast('上传失败，请检查网络连接', 'error');
        updateUploadStatus('error');
    });
    
    xhr.open('POST', 'api/upload.php');
    xhr.send(formData);
}

function createUploadItem(file, index) {
    const item = document.createElement('div');
    item.className = 'upload-item';
    item.dataset.index = index;
    
    item.innerHTML = `
        <div class="upload-file-info">
            <div class="upload-file-name">${escapeHtml(file.name)}</div>
            <div class="upload-file-size">${formatFileSize(file.size)}</div>
        </div>
        <div class="upload-progress">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">等待上传...</div>
        </div>
        <div class="upload-status uploading">
            <i class="fas fa-clock"></i>
        </div>
    `;
    
    return item;
}

function updateUploadProgress(percent) {
    const progressFills = document.querySelectorAll('.upload-item .progress-fill');
    const progressTexts = document.querySelectorAll('.upload-item .progress-text');
    
    progressFills.forEach(fill => {
        fill.style.width = percent + '%';
    });
    
    progressTexts.forEach(text => {
        text.textContent = `上传中... ${percent}%`;
    });
}

function handleUploadResponse(response) {
    if (response.success) {
        showToast(response.message, 'success');
        updateUploadStatus('success');
        
        // 刷新文件列表和统计
        if (currentSection === 'files') {
            loadFileList(currentPage);
        }
        loadDashboardStats();
        
        // 清空文件输入
        document.getElementById('file-input').value = '';
        
        // 3秒后隐藏上传队列
        setTimeout(() => {
            document.getElementById('upload-queue').classList.remove('active');
        }, 3000);
    } else {
        showToast(response.message, 'error');
        updateUploadStatus('error');
    }
}

function updateUploadStatus(status) {
    const statusElements = document.querySelectorAll('.upload-status');
    const progressTexts = document.querySelectorAll('.upload-item .progress-text');
    
    statusElements.forEach(element => {
        element.className = `upload-status ${status}`;
        
        if (status === 'success') {
            element.innerHTML = '<i class="fas fa-check"></i>';
        } else if (status === 'error') {
            element.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    progressTexts.forEach(text => {
        if (status === 'success') {
            text.textContent = '上传成功';
        } else if (status === 'error') {
            text.textContent = '上传失败';
        }
    });
}

function downloadFile(fileId) {
    window.open(`api/download.php?id=${fileId}`, '_blank');
}

function deleteFile(fileId) {
    if (!confirm('确定要删除这个文件吗？文件将被移到回收站。')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('file_id', fileId);
    
    fetch('api/files.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            loadFileList(currentPage);
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('删除文件失败:', error);
        showToast('删除失败，请重试', 'error');
    });
}

function restoreFile(fileId) {
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'restore');
    formData.append('file_id', fileId);
    
    fetch('api/files.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            loadTrashList(currentPage);
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('恢复文件失败:', error);
        showToast('恢复失败，请重试', 'error');
    });
}

function permanentDeleteFile(fileId) {
    if (!confirm('确定要永久删除这个文件吗？此操作无法撤销！')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'permanent_delete');
    formData.append('file_id', fileId);
    
    fetch('api/files.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            loadTrashList(currentPage);
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('永久删除文件失败:', error);
        showToast('删除失败，请重试', 'error');
    });
}

function shareFile(fileId) {
    showToast('分享功能即将推出', 'info');
}

function emptyTrash() {
    if (!confirm('确定要清空回收站吗？此操作将永久删除所有文件，无法撤销！')) {
        return;
    }
    
    showToast('清空回收站功能即将推出', 'info');
}

function bindSearchEvents() {
    const searchInput = document.getElementById('file-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const keyword = this.value.trim();
            if (keyword) {
                searchFiles(keyword);
            } else {
                loadFileList();
            }
        }, 500);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchFiles();
        }
    });
}

function searchFiles(keyword) {
    if (!keyword) {
        keyword = document.getElementById('file-search').value.trim();
    }
    
    if (!keyword) {
        loadFileList();
        return;
    }
    
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>搜索中...</span></div>';
    
    fetch(`api/files.php?action=search&keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayFileList(data.data.files, 'file-list');
                updatePagination(data.data, 'file-pagination', (page) => {
                    fetch(`api/files.php?action=search&keyword=${encodeURIComponent(keyword)}&page=${page}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                displayFileList(data.data.files, 'file-list');
                                updatePagination(data.data, 'file-pagination', arguments.callee);
                            }
                        });
                });
            } else {
                fileList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>未找到文件</h3><p>没有找到匹配的文件</p></div>';
            }
        })
        .catch(error => {
            console.error('搜索失败:', error);
            fileList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>搜索失败</h3><p>请重试</p></div>';
        });
}

function initModal() {
    const modal = document.getElementById('file-modal');
    
    // 点击模态框外部关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(title, content) {
    const modal = document.getElementById('file-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('file-modal').classList.remove('active');
}

// 工具函数
function getFileIcon(fileType) {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
    
    if (imageTypes.includes(fileType.toLowerCase())) {
        return { class: 'image', icon: 'fas fa-image' };
    } else if (documentTypes.includes(fileType.toLowerCase())) {
        return { class: 'document', icon: 'fas fa-file-alt' };
    } else if (archiveTypes.includes(fileType.toLowerCase())) {
        return { class: 'archive', icon: 'fas fa-file-archive' };
    } else {
        return { class: 'other', icon: 'fas fa-file' };
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
        return Math.floor(diff / hour) + '小时前';
    } else if (diff < 7 * day) {
        return Math.floor(diff / day) + '天前';
    } else {
        return date.toLocaleDateString('zh-CN');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info', duration = 3000) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}
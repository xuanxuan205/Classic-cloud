/**
 * 简化版上传管理器 - 解决重复操作问题
 */

// 防止重复初始化的全局标记
window.UPLOAD_INITIALIZED = false;

// 简单的上传处理函数
function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    
    console.log('📁 开始处理文件:', Array.from(files).map(f => f.name));
    
    // 显示简单的上传进度
    showSimpleProgress();
    
    // 逐个上传文件
    Array.from(files).forEach((file, index) => {
        uploadSingleFile(file, index, files.length);
    });
}

// 上传单个文件
function uploadSingleFile(file, index, total) {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    // 上传进度
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            updateSimpleProgress(index, progress, file.name);
        }
    };
    
    // 上传完成
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(`✅ 文件 ${file.name} 上传完成`);
            
            // 如果是最后一个文件，刷新页面
            if (index === total - 1) {
                setTimeout(() => {
                    hideSimpleProgress();
                    window.location.reload();
                }, 1000);
            }
        } else {
            console.error(`❌ 文件 ${file.name} 上传失败:`, xhr.statusText);
        }
    };
    
    // 上传错误
    xhr.onerror = function() {
        console.error(`❌ 文件 ${file.name} 上传出错`);
    };
    
    // 发送请求 - 使用简化版API
    xhr.open('POST', 'api/upload_simple.php');
    xhr.send(formData);
}

// 显示简单进度
function showSimpleProgress() {
    // 移除已存在的进度窗口
    const existing = document.getElementById('simple-upload-progress');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'simple-upload-progress';
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                min-width: 400px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h3 style="margin: 0 0 20px 0; color: #333;">📤 文件上传中</h3>
                <div id="upload-status" style="color: #666; margin-bottom: 15px;">准备上传...</div>
                <div style="
                    width: 100%;
                    height: 8px;
                    background: #f0f0f0;
                    border-radius: 4px;
                    overflow: hidden;
                ">
                    <div id="upload-bar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #667eea, #764ba2);
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="upload-percent" style="margin-top: 10px; font-weight: bold; color: #333;">0%</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 更新简单进度
function updateSimpleProgress(fileIndex, progress, filename) {
    const status = document.getElementById('upload-status');
    const bar = document.getElementById('upload-bar');
    const percent = document.getElementById('upload-percent');
    
    if (status) status.textContent = `正在上传: ${filename}`;
    if (bar) bar.style.width = `${progress}%`;
    if (percent) percent.textContent = `${Math.round(progress)}%`;
}

// 隐藏简单进度
function hideSimpleProgress() {
    const modal = document.getElementById('simple-upload-progress');
    if (modal) modal.remove();
}

// 初始化上传功能
function initSimpleUpload() {
    if (window.UPLOAD_INITIALIZED) {
        console.log('⚠️ 上传功能已初始化');
        return;
    }
    
    console.log('🚀 初始化简单上传功能...');
    
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectBtn = document.getElementById('selectFileBtn');
    
    if (!uploadArea || !fileInput) {
        console.error('❌ 找不到上传元素');
        return;
    }
    
    // 拖拽事件
    uploadArea.ondragover = function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = '#f8f9ff';
    };
    
    uploadArea.ondragleave = function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '';
    };
    
    uploadArea.ondrop = function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    };
    
    // 点击上传区域
    uploadArea.onclick = function(e) {
        // 如果点击的是按钮，不触发
        if (e.target.closest('#selectFileBtn')) {
            return;
        }
        fileInput.click();
    };
    
    // 按钮点击
    if (selectBtn) {
        selectBtn.onclick = function(e) {
            e.stopPropagation();
            fileInput.click();
        };
    }
    
    // 文件选择
    fileInput.onchange = function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files);
            e.target.value = ''; // 清空
        }
    };
    
    window.UPLOAD_INITIALIZED = true;
    console.log('✅ 简单上传功能初始化完成');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleUpload);
} else {
    initSimpleUpload();
}
/**
 * 上传功能初始化脚本
 * 防止重复初始化和事件绑定
 */

// 全局上传管理器实例
let globalUploadManager = null;

// 初始化上传功能
function initializeUpload() {
    // 防止重复初始化
    if (globalUploadManager) {
        console.log('⚠️ 上传管理器已存在，跳过初始化');
        return;
    }
    
    console.log('🚀 初始化上传管理器...');
    
    globalUploadManager = new UploadManager({
        uploadUrl: 'api/upload.php',
        maxFileSize: 100 * 1024 * 1024, // 默认100MB，会动态更新
        maxFiles: 10,
        onProgress: (id, progress, loaded, total) => {
            console.log(`📈 文件 ${id} 上传进度: ${progress.toFixed(1)}%`);
        },
        onComplete: (id, response) => {
            console.log(`✅ 文件 ${id} 上传完成:`, response);
        },
        onError: (id, error) => {
            console.error(`❌ 文件 ${id} 上传失败:`, error);
        }
    });
    
    // 绑定选择文件按钮事件
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (selectFileBtn && fileInput) {
        selectFileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            fileInput.click();
        });
        
        console.log('✅ 选择文件按钮事件绑定完成');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保所有元素都已加载
    setTimeout(initializeUpload, 100);
});

// 如果页面已经加载完成，立即初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeUpload, 100);
}
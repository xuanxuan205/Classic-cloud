// 经典云网盘演示版 JavaScript

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoApp();
});

// 初始化演示应用
function initializeDemoApp() {
    // 显示演示提示
    showDemoWelcome();
    
    // 初始化侧边栏导航
    initSidebarNavigation();
    
    // 初始化文件操作
    initFileOperations();
    
    // 模拟实时数据更新
    startDataSimulation();
}

// 显示演示欢迎信息
function showDemoWelcome() {
    setTimeout(() => {
        showNotification('欢迎使用经典云网盘演示版！所有功能均为模拟演示。', 'info', 5000);
    }, 1000);
}

// 初始化侧边栏导航
function initSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            document.querySelectorAll('.nav-menu li').forEach(li => {
                li.classList.remove('active');
            });
            
            // 添加当前活动状态
            this.parentElement.classList.add('active');
            
            // 根据链接显示不同内容
            const href = this.getAttribute('href');
            handleNavigation(href);
        });
    });
}

// 处理导航
function handleNavigation(href) {
    switch(href) {
        case '#dashboard':
            showNotification('仪表板页面（当前页面）', 'info');
            break;
        case '#files':
            showNotification('演示：文件管理功能', 'info');
            simulateFileManagement();
            break;
        case '#upload':
            showNotification('演示：文件上传功能', 'info');
            simulateUpload();
            break;
        case '#shared':
            showNotification('演示：分享管理功能', 'info');
            simulateShareManagement();
            break;
        case '#settings':
            showNotification('演示：系统设置功能', 'info');
            simulateSettings();
            break;
    }
}

// 初始化文件操作
function initFileOperations() {
    // 文件操作按钮事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.file-actions button')) {
            const button = e.target.closest('button');
            const action = button.getAttribute('onclick');
            
            if (action) {
                // 阻止默认的onclick执行，使用我们的演示逻辑
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
}

// 模拟文件管理
function simulateFileManagement() {
    showNotification('正在加载文件列表...', 'info');
    
    setTimeout(() => {
        showNotification('文件管理功能演示完成', 'success');
    }, 1500);
}

// 模拟分享管理
function simulateShareManagement() {
    const shareData = [
        { name: '产品介绍.pdf', downloads: 15, expires: '2024-02-01' },
        { name: '用户手册.docx', downloads: 8, expires: '2024-01-15' },
        { name: '系统截图.png', downloads: 23, expires: '永久' }
    ];
    
    let message = '分享链接管理：\n\n';
    shareData.forEach(item => {
        message += `📄 ${item.name}\n   下载: ${item.downloads}次 | 到期: ${item.expires}\n\n`;
    });
    
    showNotification('分享管理功能演示', 'info', 8000);
    console.log(message);
}

// 模拟系统设置
function simulateSettings() {
    const settings = {
        '存储配额': '10GB',
        '文件保留期': '30天',
        '分享权限': '已启用',
        '安全验证': '双重验证',
        '通知设置': '邮件+短信'
    };
    
    let message = '系统设置：\n\n';
    Object.entries(settings).forEach(([key, value]) => {
        message += `⚙️ ${key}: ${value}\n`;
    });
    
    showNotification('系统设置功能演示', 'info', 6000);
    console.log(message);
}

// 开始数据模拟
function startDataSimulation() {
    // 模拟存储使用量变化
    simulateStorageUsage();
    
    // 模拟文件统计更新
    simulateFileStats();
}

// 模拟存储使用量
function simulateStorageUsage() {
    const storageBar = document.querySelector('.storage-used');
    if (!storageBar) return;
    
    let currentWidth = 25;
    
    setInterval(() => {
        // 随机小幅度变化
        const change = (Math.random() - 0.5) * 2;
        currentWidth = Math.max(20, Math.min(30, currentWidth + change));
        
        storageBar.style.width = currentWidth + '%';
        
        // 更新文字显示
        const storageText = document.querySelector('.storage-card p');
        if (storageText) {
            const used = (currentWidth / 10).toFixed(1);
            storageText.textContent = `${used}GB / 10GB (${Math.round(currentWidth)}% 已使用)`;
        }
    }, 5000);
}

// 模拟文件统计
function simulateFileStats() {
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length === 0) return;
    
    setInterval(() => {
        // 随机更新统计数字
        statCards.forEach((card, index) => {
            const currentValue = parseInt(card.textContent);
            let newValue;
            
            switch(index) {
                case 0: // 文件总数
                    newValue = Math.max(20, Math.min(30, currentValue + Math.floor(Math.random() * 3 - 1)));
                    break;
                case 1: // 已使用空间 (保持与存储条同步)
                    const storageBar = document.querySelector('.storage-used');
                    const width = parseFloat(storageBar.style.width);
                    newValue = (width / 10).toFixed(1) + 'GB';
                    break;
                case 2: // 分享链接
                    newValue = Math.max(5, Math.min(12, currentValue + Math.floor(Math.random() * 3 - 1)));
                    break;
                case 3: // 下载次数
                    newValue = Math.max(100, currentValue + Math.floor(Math.random() * 5));
                    break;
            }
            
            if (newValue !== undefined) {
                card.textContent = newValue;
            }
        });
    }, 10000);
}

// 全局演示函数
window.simulateUpload = function() {
    showNotification('正在模拟文件上传...', 'info');
    
    // 创建上传进度显示
    const progressDiv = document.createElement('div');
    progressDiv.className = 'upload-progress';
    progressDiv.innerHTML = `
        <h4>文件上传中...</h4>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
        <span>准备上传...</span>
    `;
    
    document.body.appendChild(progressDiv);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        
        const fill = progressDiv.querySelector('.progress-fill');
        const text = progressDiv.querySelector('span');
        
        fill.style.width = progress + '%';
        
        if (progress < 100) {
            text.textContent = `上传中... ${Math.round(progress)}%`;
        } else {
            text.textContent = '上传完成！';
            setTimeout(() => {
                progressDiv.remove();
                showNotification('文件上传成功（演示）', 'success');
                
                // 模拟添加新文件到列表
                addDemoFileToList();
            }, 1000);
        }
    }, 300);
};

// 添加演示文件到列表
function addDemoFileToList() {
    const tbody = document.querySelector('.files-table tbody');
    if (!tbody) return;
    
    const demoFiles = [
        { name: '新上传文件.txt', size: '1.2MB', type: 'text' },
        { name: '演示图片.jpg', size: '856KB', type: 'image' },
        { name: '测试文档.pdf', size: '2.1MB', type: 'pdf' }
    ];
    
    const randomFile = demoFiles[Math.floor(Math.random() * demoFiles.length)];
    const now = new Date().toLocaleString('zh-CN');
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="file-info">
                <i class="material-icons file-icon">insert_drive_file</i>
                <span>${randomFile.name}</span>
            </div>
        </td>
        <td>${randomFile.size}</td>
        <td>${now}</td>
        <td><span class="status private">私有</span></td>
        <td>
            <div class="file-actions">
                <button onclick="downloadFile('demo')" title="下载">
                    <i class="material-icons">download</i>
                </button>
                <button onclick="shareFile('demo')" title="分享">
                    <i class="material-icons">share</i>
                </button>
                <button onclick="deleteFile('demo')" title="删除">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    
    // 高亮新添加的行
    row.style.background = '#e8f5e8';
    setTimeout(() => {
        row.style.background = '';
    }, 2000);
}

// 全局文件操作函数
window.downloadFile = function(id) {
    showNotification('开始下载文件（演示）', 'info');
    
    // 模拟下载进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        showNotification(`下载进度: ${progress}%`, 'info', 1000);
        
        if (progress >= 100) {
            clearInterval(interval);
            showNotification('文件下载完成（演示）', 'success');
        }
    }, 500);
};

window.shareFile = function(id) {
    const shareUrl = `https://gta5fuzhup.cn/demo/share.php?id=demo${id}`;
    
    // 尝试复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('分享链接已复制到剪贴板', 'success');
        }).catch(() => {
            showNotification(`分享链接: ${shareUrl}`, 'info', 8000);
        });
    } else {
        showNotification(`分享链接: ${shareUrl}`, 'info', 8000);
    }
};

window.deleteFile = function(id) {
    if (confirm('确定要删除这个文件吗？（演示操作，不会真实删除）')) {
        showNotification('文件删除成功（演示）', 'success');
        
        // 从表格中移除对应行
        const button = event.target.closest('button');
        const row = button.closest('tr');
        if (row) {
            row.style.opacity = '0.5';
            setTimeout(() => {
                row.remove();
            }, 500);
        }
    }
};

// 通知函数
function showNotification(message, type = 'info', duration = 3000) {
    // 移除现有通知
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// 演示数据生成器
function generateDemoData() {
    return {
        files: Math.floor(Math.random() * 10) + 20,
        storage: (Math.random() * 3 + 2).toFixed(1) + 'GB',
        shares: Math.floor(Math.random() * 5) + 5,
        downloads: Math.floor(Math.random() * 50) + 100
    };
}

// 导出全局函数
window.DemoApp = {
    showNotification,
    simulateUpload,
    downloadFile,
    shareFile,
    deleteFile,
    generateDemoData
};
<?php
// 经典云网盘 - 演示仪表板
session_start();

// 检查演示登录状态
if (!isset($_SESSION['demo_user'])) {
    header('Location: index.php');
    exit;
}

$username = $_SESSION['demo_user'];
$user_data = $_SESSION['demo_user_data'];

// 模拟文件数据
$demo_files = [
    [
        'id' => 1,
        'name' => '产品介绍.pdf',
        'size' => '2.5MB',
        'type' => 'pdf',
        'modified' => '2024-01-01 10:30:00',
        'shared' => true
    ],
    [
        'id' => 2,
        'name' => '用户手册.docx',
        'size' => '1.8MB',
        'type' => 'doc',
        'modified' => '2024-01-01 09:15:00',
        'shared' => false
    ],
    [
        'id' => 3,
        'name' => '系统截图.png',
        'size' => '856KB',
        'type' => 'image',
        'modified' => '2024-01-01 08:45:00',
        'shared' => true
    ],
    [
        'id' => 4,
        'name' => '演示视频.mp4',
        'size' => '15.2MB',
        'type' => 'video',
        'modified' => '2023-12-31 16:20:00',
        'shared' => false
    ],
    [
        'id' => 5,
        'name' => '配置文件.zip',
        'size' => '3.1MB',
        'type' => 'archive',
        'modified' => '2023-12-31 14:10:00',
        'shared' => false
    ]
];

// 处理AJAX请求
if ($_POST && isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    switch ($_POST['action']) {
        case 'upload':
            echo json_encode([
                'success' => true,
                'message' => '演示模式：文件上传功能已模拟完成',
                'file' => [
                    'name' => $_POST['filename'] ?? '演示文件.txt',
                    'size' => '1.2MB',
                    'type' => 'text'
                ]
            ]);
            break;
            
        case 'delete':
            echo json_encode([
                'success' => true,
                'message' => '演示模式：文件删除操作已模拟'
            ]);
            break;
            
        case 'share':
            echo json_encode([
                'success' => true,
                'message' => '分享链接已生成（演示）',
                'share_url' => 'https://gta5fuzhup.cn/demo/share.php?id=demo123'
            ]);
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => '未知操作'
            ]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户仪表板 - 经典云网盘演示版</title>
    <link rel="stylesheet" href="assets/css/demo.css">
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <!-- 演示版本提示 -->
    <div class="demo-banner">
        <div class="demo-banner-content">
            <i class="material-icons">info</i>
            <span>演示模式 - 所有操作均为模拟，不会影响真实数据</span>
            <a href="https://gta5fuzhup.cn" class="official-link">访问正式版本</a>
        </div>
    </div>

    <!-- 顶部导航 -->
    <nav class="top-nav">
        <div class="nav-left">
            <i class="material-icons">cloud</i>
            <span class="site-name">经典云网盘</span>
            <span class="demo-badge">演示版</span>
        </div>
        <div class="nav-right">
            <span class="user-name">欢迎，<?php echo htmlspecialchars($username); ?></span>
            <a href="logout.php" class="logout-btn">
                <i class="material-icons">logout</i>
                退出
            </a>
        </div>
    </nav>

    <div class="dashboard-container">
        <!-- 侧边栏 -->
        <aside class="sidebar">
            <ul class="nav-menu">
                <li class="active">
                    <a href="#dashboard">
                        <i class="material-icons">dashboard</i>
                        仪表板
                    </a>
                </li>
                <li>
                    <a href="#files">
                        <i class="material-icons">folder</i>
                        我的文件
                    </a>
                </li>
                <li>
                    <a href="#upload">
                        <i class="material-icons">cloud_upload</i>
                        上传文件
                    </a>
                </li>
                <li>
                    <a href="#shared">
                        <i class="material-icons">share</i>
                        分享管理
                    </a>
                </li>
                <li>
                    <a href="#settings">
                        <i class="material-icons">settings</i>
                        设置
                    </a>
                </li>
            </ul>
        </aside>

        <!-- 主内容区 -->
        <main class="main-content">
            <!-- 统计卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="material-icons">folder</i>
                    </div>
                    <div class="stat-info">
                        <h3><?php echo $user_data['files_count']; ?></h3>
                        <p>文件总数</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="material-icons">storage</i>
                    </div>
                    <div class="stat-info">
                        <h3><?php echo $user_data['storage_used']; ?></h3>
                        <p>已使用空间</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="material-icons">share</i>
                    </div>
                    <div class="stat-info">
                        <h3>8</h3>
                        <p>分享链接</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="material-icons">download</i>
                    </div>
                    <div class="stat-info">
                        <h3>156</h3>
                        <p>下载次数</p>
                    </div>
                </div>
            </div>

            <!-- 存储使用情况 -->
            <div class="storage-card">
                <h3>存储使用情况</h3>
                <div class="storage-bar">
                    <div class="storage-used" style="width: 25%"></div>
                </div>
                <p><?php echo $user_data['storage_used']; ?> / <?php echo $user_data['storage_total']; ?> (25% 已使用)</p>
            </div>

            <!-- 文件列表 -->
            <div class="files-section">
                <div class="section-header">
                    <h3>最近文件</h3>
                    <div class="file-actions">
                        <button class="btn-upload" onclick="simulateUpload()">
                            <i class="material-icons">cloud_upload</i>
                            上传文件
                        </button>
                        <button class="btn-new-folder">
                            <i class="material-icons">create_new_folder</i>
                            新建文件夹
                        </button>
                    </div>
                </div>

                <div class="files-table">
                    <table>
                        <thead>
                            <tr>
                                <th>文件名</th>
                                <th>大小</th>
                                <th>修改时间</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($demo_files as $file): ?>
                            <tr>
                                <td>
                                    <div class="file-info">
                                        <i class="material-icons file-icon"><?php 
                                            echo match($file['type']) {
                                                'pdf' => 'picture_as_pdf',
                                                'doc' => 'description',
                                                'image' => 'image',
                                                'video' => 'videocam',
                                                'archive' => 'archive',
                                                default => 'insert_drive_file'
                                            };
                                        ?></i>
                                        <span><?php echo htmlspecialchars($file['name']); ?></span>
                                    </div>
                                </td>
                                <td><?php echo $file['size']; ?></td>
                                <td><?php echo $file['modified']; ?></td>
                                <td>
                                    <?php if ($file['shared']): ?>
                                        <span class="status shared">已分享</span>
                                    <?php else: ?>
                                        <span class="status private">私有</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="file-actions">
                                        <button onclick="downloadFile(<?php echo $file['id']; ?>)" title="下载">
                                            <i class="material-icons">download</i>
                                        </button>
                                        <button onclick="shareFile(<?php echo $file['id']; ?>)" title="分享">
                                            <i class="material-icons">share</i>
                                        </button>
                                        <button onclick="deleteFile(<?php echo $file['id']; ?>)" title="删除">
                                            <i class="material-icons">delete</i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>

    <!-- 通知容器 -->
    <div id="notification" class="notification"></div>

    <script src="assets/js/demo.js"></script>
    <script>
        // 演示功能
        function simulateUpload() {
            showNotification('演示模式：文件上传功能', 'info');
            
            // 模拟上传进度
            const progress = document.createElement('div');
            progress.className = 'upload-progress';
            progress.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span>上传中... 0%</span>
            `;
            
            document.body.appendChild(progress);
            
            let percent = 0;
            const interval = setInterval(() => {
                percent += 10;
                const fill = progress.querySelector('.progress-fill');
                const text = progress.querySelector('span');
                
                fill.style.width = percent + '%';
                text.textContent = `上传中... ${percent}%`;
                
                if (percent >= 100) {
                    clearInterval(interval);
                    text.textContent = '上传完成！';
                    setTimeout(() => {
                        progress.remove();
                        showNotification('文件上传成功（演示）', 'success');
                    }, 1000);
                }
            }, 200);
        }

        function downloadFile(id) {
            showNotification('演示模式：开始下载文件', 'info');
        }

        function shareFile(id) {
            const shareUrl = 'https://gta5fuzhup.cn/demo/share.php?id=demo' + id;
            navigator.clipboard.writeText(shareUrl).then(() => {
                showNotification('分享链接已复制到剪贴板（演示）', 'success');
            });
        }

        function deleteFile(id) {
            if (confirm('确定要删除这个文件吗？（演示操作）')) {
                showNotification('文件删除成功（演示）', 'success');
            }
        }

        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type} show`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    </script>
</body>
</html>
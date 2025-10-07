<?php
// 经典云网盘 - 演示版本入口文件
session_start();

// 演示模式标识
define('DEMO_MODE', true);
define('DEMO_VERSION', '1.0.0');

// 基础配置
$demo_config = [
    'site_name' => '经典云网盘 - 演示版',
    'site_url' => 'https://gta5fuzhup.cn/demo/',
    'official_url' => 'https://gta5fuzhup.cn',
    'demo_users' => [
        'demo' => [
            'password' => 'demo123',
            'email' => 'demo@example.com',
            'storage_used' => '2.5GB',
            'storage_total' => '10GB',
            'files_count' => 25,
            'last_login' => '2024-01-01 12:00:00'
        ],
        'guest' => [
            'password' => 'guest123',
            'email' => 'guest@example.com',
            'storage_used' => '1.2GB',
            'storage_total' => '5GB',
            'files_count' => 12,
            'last_login' => '2024-01-01 10:30:00'
        ]
    ]
];

// 检查是否已登录演示账号
if (isset($_SESSION['demo_user'])) {
    header('Location: dashboard.php');
    exit;
}

// 处理登录请求
if ($_POST && isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    
    if (isset($demo_config['demo_users'][$username])) {
        $user = $demo_config['demo_users'][$username];
        if ($user['password'] === $password) {
            $_SESSION['demo_user'] = $username;
            $_SESSION['demo_user_data'] = $user;
            header('Location: dashboard.php');
            exit;
        }
    }
    
    $error_message = '用户名或密码错误。演示账号：demo/demo123 或 guest/guest123';
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $demo_config['site_name']; ?></title>
    <link rel="stylesheet" href="assets/css/demo.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <!-- 演示版本提示 -->
    <div class="demo-banner">
        <div class="demo-banner-content">
            <i class="material-icons">info</i>
            <span>这是演示版本，所有数据均为模拟数据。</span>
            <a href="<?php echo $demo_config['official_url']; ?>" class="official-link">访问正式版本</a>
        </div>
    </div>

    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <i class="material-icons">cloud</i>
                <h1>经典云网盘</h1>
                <p class="demo-subtitle">演示版本</p>
            </div>

            <?php if (isset($error_message)): ?>
            <div class="error-message">
                <i class="material-icons">error</i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
            <?php endif; ?>

            <form method="POST" class="login-form">
                <input type="hidden" name="action" value="login">
                
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" name="username" required 
                           placeholder="输入演示账号" value="<?php echo $_POST['username'] ?? ''; ?>">
                </div>

                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="输入密码">
                </div>

                <button type="submit" class="login-btn">
                    <i class="material-icons">login</i>
                    登录演示
                </button>
            </form>

            <div class="demo-accounts">
                <h3>演示账号</h3>
                <div class="account-list">
                    <div class="account-item">
                        <strong>管理员演示</strong>
                        <span>用户名: demo</span>
                        <span>密码: demo123</span>
                    </div>
                    <div class="account-item">
                        <strong>普通用户演示</strong>
                        <span>用户名: guest</span>
                        <span>密码: guest123</span>
                    </div>
                </div>
            </div>

            <div class="demo-features">
                <h3>演示功能</h3>
                <ul>
                    <li><i class="material-icons">check</i> 文件上传下载演示</li>
                    <li><i class="material-icons">check</i> 文件管理界面</li>
                    <li><i class="material-icons">check</i> 分享功能演示</li>
                    <li><i class="material-icons">check</i> 用户仪表板</li>
                    <li><i class="material-icons">check</i> 安全设置页面</li>
                </ul>
            </div>

            <div class="footer-links">
                <a href="<?php echo $demo_config['official_url']; ?>">正式版本</a>
                <a href="https://github.com/xuanxuan205/Classic-cloud">GitHub</a>
                <a href="mailto:lyd9527@zohomail.cn">技术支持</a>
            </div>
        </div>
    </div>

    <script>
        // 自动填充演示账号
        document.addEventListener('DOMContentLoaded', function() {
            const accountItems = document.querySelectorAll('.account-item');
            accountItems.forEach(item => {
                item.addEventListener('click', function() {
                    const spans = this.querySelectorAll('span');
                    if (spans.length >= 2) {
                        const username = spans[0].textContent.replace('用户名: ', '');
                        const password = spans[1].textContent.replace('密码: ', '');
                        
                        document.getElementById('username').value = username;
                        document.getElementById('password').value = password;
                    }
                });
            });
        });
    </script>
</body>
</html>
<?php
/**
 * 经典云网盘演示版 - 一键安装脚本
 * 用于快速部署演示后台到宝塔面板
 */

// 安全检查
if (!isset($_GET['install']) || $_GET['install'] !== 'confirm') {
    ?>
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>经典云网盘演示版 - 安装向导</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
            .container { max-width: 800px; margin: 50px auto; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
            .header h1 { font-size: 2rem; margin-bottom: 10px; }
            .header p { opacity: 0.9; }
            .content { padding: 40px; }
            .step { margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #2196F3; }
            .step h3 { color: #333; margin-bottom: 15px; }
            .step p { color: #666; line-height: 1.6; margin-bottom: 10px; }
            .code { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px; overflow-x: auto; }
            .warning { background: #fff3cd; border-color: #ffc107; color: #856404; }
            .success { background: #d4edda; border-color: #28a745; color: #155724; }
            .install-btn { display: inline-block; background: #28a745; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; transition: all 0.3s; }
            .install-btn:hover { background: #218838; transform: translateY(-2px); }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .feature { padding: 20px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
            .feature i { font-size: 2rem; color: #2196F3; margin-bottom: 15px; }
            .feature h4 { color: #333; margin-bottom: 10px; }
            .feature p { color: #666; font-size: 14px; }
        </style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 经典云网盘演示版</h1>
                <p>安全的产品展示后台 - 一键安装向导</p>
            </div>
            
            <div class="content">
                <div class="step success">
                    <h3>✅ 安装目的</h3>
                    <p>为您的正式网站 <strong>https://gta5fuzhup.cn</strong> 创建一个安全的演示后台，让用户可以体验完整功能而不暴露真实数据。</p>
                </div>

                <div class="features">
                    <div class="feature">
                        <i class="material-icons">security</i>
                        <h4>数据安全</h4>
                        <p>完全独立运行，不访问真实用户数据和系统配置</p>
                    </div>
                    <div class="feature">
                        <i class="material-icons">visibility</i>
                        <h4>功能展示</h4>
                        <p>完整演示文件管理、分享、上传等核心功能</p>
                    </div>
                    <div class="feature">
                        <i class="material-icons">devices</i>
                        <h4>响应式设计</h4>
                        <p>完美支持手机、平板、电脑等各种设备访问</p>
                    </div>
                    <div class="feature">
                        <i class="material-icons">trending_up</i>
                        <h4>营销价值</h4>
                        <p>提升用户信任度，增加注册转化率</p>
                    </div>
                </div>

                <div class="step">
                    <h3>📋 安装前检查</h3>
                    <p><strong>当前路径：</strong> <?php echo __DIR__; ?></p>
                    <p><strong>建议路径：</strong> /www/wwwroot/gta5fuzhup.cn/demo/</p>
                    <p><strong>访问地址：</strong> https://gta5fuzhup.cn/demo/</p>
                </div>

                <div class="step">
                    <h3>🔐 演示账号</h3>
                    <p><strong>管理员演示：</strong> demo / demo123</p>
                    <p><strong>普通用户演示：</strong> guest / guest123</p>
                </div>

                <div class="step warning">
                    <h3>⚠️ 安全提醒</h3>
                    <p>• 演示版本与正式系统完全隔离，不会影响真实数据</p>
                    <p>• 所有操作均为模拟演示，不会产生真实的文件或数据</p>
                    <p>• 建议定期更新演示账号密码</p>
                </div>

                <div class="step">
                    <h3>🚀 开始安装</h3>
                    <p>点击下方按钮开始安装演示后台。安装过程会自动设置文件权限和创建必要的配置。</p>
                    <a href="?install=confirm" class="install-btn">开始安装演示后台</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// 执行安装
echo "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>安装中...</title>";
echo "<style>body{font-family:Arial;padding:20px;background:#f5f5f5;}";
echo ".log{background:white;padding:20px;border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,0.1);}";
echo ".success{color:#28a745;} .error{color:#dc3545;} .info{color:#007bff;}";
echo "</style></head><body><div class='log'>";

function logMessage($message, $type = 'info') {
    echo "<p class='$type'>[" . date('H:i:s') . "] $message</p>";
    flush();
    ob_flush();
}

logMessage("开始安装经典云网盘演示版...", 'info');

// 检查PHP版本
if (version_compare(PHP_VERSION, '7.0.0') < 0) {
    logMessage("错误：需要PHP 7.0或更高版本，当前版本：" . PHP_VERSION, 'error');
    exit;
}
logMessage("PHP版本检查通过：" . PHP_VERSION, 'success');

// 检查目录权限
$currentDir = __DIR__;
if (!is_writable($currentDir)) {
    logMessage("错误：当前目录不可写：$currentDir", 'error');
    exit;
}
logMessage("目录权限检查通过", 'success');

// 创建必要的目录结构
$directories = [
    'assets',
    'assets/css',
    'assets/js',
    'assets/images'
];

foreach ($directories as $dir) {
    $fullPath = $currentDir . '/' . $dir;
    if (!file_exists($fullPath)) {
        if (mkdir($fullPath, 0755, true)) {
            logMessage("创建目录：$dir", 'success');
        } else {
            logMessage("创建目录失败：$dir", 'error');
        }
    } else {
        logMessage("目录已存在：$dir", 'info');
    }
}

// 设置文件权限
$files = glob($currentDir . '/*.php');
foreach ($files as $file) {
    chmod($file, 0644);
}
logMessage("设置PHP文件权限：644", 'success');

$cssFiles = glob($currentDir . '/assets/css/*.css');
foreach ($cssFiles as $file) {
    chmod($file, 0644);
}
logMessage("设置CSS文件权限：644", 'success');

$jsFiles = glob($currentDir . '/assets/js/*.js');
foreach ($jsFiles as $file) {
    chmod($file, 0644);
}
logMessage("设置JS文件权限：644", 'success');

// 创建演示配置文件
$config = [
    'demo_mode' => true,
    'site_name' => '经典云网盘',
    'demo_users' => [
        'demo' => [
            'password' => 'demo123',
            'role' => 'admin',
            'name' => '演示管理员'
        ],
        'guest' => [
            'password' => 'guest123',
            'role' => 'user',
            'name' => '演示用户'
        ]
    ],
    'demo_files' => [
        [
            'name' => '产品介绍.pdf',
            'size' => '2.1MB',
            'type' => 'pdf',
            'shared' => true,
            'downloads' => 15
        ],
        [
            'name' => '用户手册.docx',
            'size' => '1.8MB',
            'type' => 'document',
            'shared' => false,
            'downloads' => 8
        ],
        [
            'name' => '系统截图.png',
            'size' => '856KB',
            'type' => 'image',
            'shared' => true,
            'downloads' => 23
        ]
    ],
    'install_time' => date('Y-m-d H:i:s'),
    'version' => '1.0.0'
];

$configFile = $currentDir . '/config.json';
if (file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    logMessage("创建演示配置文件", 'success');
} else {
    logMessage("创建配置文件失败", 'error');
}

// 创建.htaccess文件（如果需要）
$htaccess = "# 经典云网盘演示版 - Apache配置\n";
$htaccess .= "Options -Indexes\n";
$htaccess .= "DirectoryIndex index.php\n\n";
$htaccess .= "# 安全设置\n";
$htaccess .= "<Files \"config.json\">\n";
$htaccess .= "    Require all denied\n";
$htaccess .= "</Files>\n\n";
$htaccess .= "# 缓存设置\n";
$htaccess .= "<IfModule mod_expires.c>\n";
$htaccess .= "    ExpiresActive On\n";
$htaccess .= "    ExpiresByType text/css \"access plus 1 month\"\n";
$htaccess .= "    ExpiresByType application/javascript \"access plus 1 month\"\n";
$htaccess .= "    ExpiresByType image/png \"access plus 1 month\"\n";
$htaccess .= "    ExpiresByType image/jpg \"access plus 1 month\"\n";
$htaccess .= "    ExpiresByType image/jpeg \"access plus 1 month\"\n";
$htaccess .= "</IfModule>\n";

$htaccessFile = $currentDir . '/.htaccess';
if (file_put_contents($htaccessFile, $htaccess)) {
    logMessage("创建.htaccess配置文件", 'success');
}

// 安装完成
logMessage("演示后台安装完成！", 'success');
logMessage("", 'info');
logMessage("访问地址：" . (isset($_SERVER['HTTPS']) ? 'https' : 'http') . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . "/", 'info');
logMessage("演示账号：demo / demo123", 'info');
logMessage("", 'info');

echo "<div style='margin-top:30px;padding:20px;background:#d4edda;border-radius:10px;border-left:4px solid #28a745;'>";
echo "<h3 style='color:#155724;margin-bottom:15px;'>🎉 安装成功！</h3>";
echo "<p style='color:#155724;margin-bottom:10px;'><strong>演示地址：</strong> <a href='./index.php' target='_blank' style='color:#007bff;'>点击访问演示后台</a></p>";
echo "<p style='color:#155724;margin-bottom:10px;'><strong>演示账号：</strong> demo</p>";
echo "<p style='color:#155724;margin-bottom:10px;'><strong>演示密码：</strong> demo123</p>";
echo "<p style='color:#155724;'><strong>部署位置：</strong> " . $currentDir . "</p>";
echo "</div>";

echo "<div style='margin-top:20px;padding:20px;background:#fff3cd;border-radius:10px;border-left:4px solid #ffc107;'>";
echo "<h4 style='color:#856404;margin-bottom:10px;'>📋 后续步骤：</h4>";
echo "<ol style='color:#856404;padding-left:20px;'>";
echo "<li>访问演示后台，测试所有功能</li>";
echo "<li>根据需要调整演示数据和界面</li>";
echo "<li>在您的主网站添加演示入口链接</li>";
echo "<li>定期检查演示功能的正常运行</li>";
echo "</ol>";
echo "</div>";

echo "<div style='margin-top:20px;text-align:center;'>";
echo "<a href='./index.php' style='display:inline-block;background:#007bff;color:white;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:600;margin:10px;'>访问演示后台</a>";
echo "<a href='../README.md' style='display:inline-block;background:#6c757d;color:white;padding:15px 30px;border-radius:8px;text-decoration:none;font-weight:600;margin:10px;'>查看文档</a>";
echo "</div>";

echo "</div></body></html>";

// 删除安装文件（可选）
// unlink(__FILE__);
?>
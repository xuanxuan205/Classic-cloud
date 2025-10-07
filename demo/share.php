<?php
// 演示版本分享页面
$share_id = $_GET['id'] ?? '';

if (empty($share_id)) {
    header('Location: index.php');
    exit;
}

// 模拟分享数据
$demo_shares = [
    'demo1' => [
        'filename' => '产品介绍.pdf',
        'filesize' => '2.5MB',
        'password' => '1234',
        'downloads' => 15,
        'max_downloads' => 100,
        'created' => '2024-01-01 10:30:00'
    ],
    'demo123' => [
        'filename' => '用户手册.docx',
        'filesize' => '1.8MB',
        'password' => '1234',
        'downloads' => 8,
        'max_downloads' => 50,
        'created' => '2024-01-01 09:15:00'
    ]
];

$share_data = $demo_shares[$share_id] ?? $demo_shares['demo1'];

// 处理密码验证
$verified = false;
if ($_POST && isset($_POST['password'])) {
    if ($_POST['password'] === $share_data['password']) {
        $verified = true;
    } else {
        $error = '密码错误，演示密码：1234';
    }
}

// 处理下载请求
if ($verified && isset($_GET['download'])) {
    // 模拟下载
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => '演示模式：文件下载已模拟',
        'filename' => $share_data['filename']
    ]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文件分享 - 经典云网盘演示版</title>
    <link rel="stylesheet" href="assets/css/demo.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        .share-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        
        .share-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }
        
        .demo-badge {
            background: #ff9800;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 20px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="share-container">
        <div class="share-card">
            <div class="demo-badge">演示版本</div>
            
            <i class="material-icons" style="font-size: 80px; color: #2196F3; margin-bottom: 20px;">share</i>
            <h1 style="font-size: 2rem; margin-bottom: 10px; color: #333;">文件分享</h1>
            
            <?php if (!$verified): ?>
                <p style="color: #666; margin-bottom: 30px;">请输入访问密码来查看分享的文件</p>
                
                <?php if (isset($error)): ?>
                <div style="background: #ffebee; color: #c62828; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                    <?php echo htmlspecialchars($error); ?>
                </div>
                <?php endif; ?>
                
                <form method="POST" style="margin-bottom: 30px;">
                    <input type="password" name="password" placeholder="请输入访问密码" 
                           style="width: 100%; padding: 15px; border: 2px solid #e1e5e9; border-radius: 8px; font-size: 16px; margin-bottom: 20px; text-align: center;">
                    <button type="submit" style="background: #2196F3; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%;">
                        <i class="material-icons" style="vertical-align: middle; margin-right: 5px;">lock_open</i>
                        验证密码
                    </button>
                </form>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: left;">
                    <p><strong>演示提示：</strong></p>
                    <p>• 访问密码：<code>1234</code></p>
                    <p>• 这是演示版本，不包含真实文件</p>
                    <p>• 所有操作均为模拟演示</p>
                </div>
                
            <?php else: ?>
                <p style="color: #666; margin-bottom: 30px;">文件验证成功，您可以下载该文件</p>
                
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: 500; color: #666;">文件名:</span>
                        <span style="color: #333;"><?php echo htmlspecialchars($share_data['filename']); ?></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: 500; color: #666;">文件大小:</span>
                        <span style="color: #333;"><?php echo $share_data['filesize']; ?></span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-weight: 500; color: #666;">分享时间:</span>
                        <span style="color: #333;"><?php echo $share_data['created']; ?></span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 500; color: #666;">下载次数:</span>
                        <span style="color: #333;"><?php echo $share_data['downloads']; ?> / <?php echo $share_data['max_downloads']; ?></span>
                    </div>
                </div>
                
                <button onclick="downloadDemo()" style="background: #2196F3; color: white; border: none; padding: 15px 30px; border-radius: 8px; font-size: 16px; cursor: pointer; width: 100%; margin-bottom: 20px;">
                    <i class="material-icons" style="vertical-align: middle; margin-right: 5px;">download</i>
                    下载文件（演示）
                </button>
                
                <div style="background: #e8f5e8; color: #2e7d32; padding: 15px; border-radius: 8px;">
                    <p><strong>演示模式：</strong>这是模拟的文件分享功能，实际部署时将提供真实的文件下载。</p>
                </div>
            <?php endif; ?>
            
            <a href="index.php" style="display: inline-flex; align-items: center; color: #2196F3; text-decoration: none; margin-top: 20px;">
                <i class="material-icons" style="margin-right: 5px;">arrow_back</i>
                返回登录
            </a>
        </div>
    </div>

    <script>
        function downloadDemo() {
            alert('演示模式：文件下载功能已模拟\n\n实际部署时，用户将下载真实文件。\n\n访问正式版本：https://gta5fuzhup.cn');
        }
    </script>
</body>
</html>
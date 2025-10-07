# 经典云网盘系统 - 安全配置指南

本指南详细介绍系统的安全特性和配置方法，帮助管理员构建安全可靠的网盘环境。

## 📖 目录

1. [安全架构概述](#安全架构概述)
2. [Web应用防火墙配置](#web应用防火墙配置)
3. [访问控制设置](#访问控制设置)
4. [文件安全配置](#文件安全配置)
5. [数据库安全](#数据库安全)
6. [服务器安全](#服务器安全)
7. [监控与日志](#监控与日志)
8. [应急响应](#应急响应)

## 🛡️ 安全架构概述

### 多层防护体系

经典云网盘系统采用多层安全防护架构：

```
用户请求
    ↓
[Web服务器安全层] - Nginx/Apache安全配置
    ↓
[应用防火墙层] - WAF规则过滤
    ↓
[应用安全层] - PHP安全验证
    ↓
[数据安全层] - 数据库安全控制
    ↓
[文件安全层] - 文件系统权限控制
```

### 核心安全特性

- **输入验证**: 严格的数据验证和过滤
- **输出编码**: 防止XSS攻击的输出转义
- **SQL注入防护**: 预处理语句和参数绑定
- **CSRF保护**: 令牌验证机制
- **会话安全**: 安全的会话管理
- **文件安全**: 文件类型检测和内容扫描
- **访问控制**: IP黑名单和频率限制
- **加密存储**: 敏感数据加密存储

## 🔥 Web应用防火墙配置

### WAF规则配置

WAF配置文件位于 `config/waf_rules.php`：

```php
<?php
// WAF规则配置
$waf_rules = [
    // SQL注入检测规则
    'sql_injection' => [
        '/(\bUNION\b.*\bSELECT\b)/i',
        '/(\bSELECT\b.*\bFROM\b)/i',
        '/(\bINSERT\b.*\bINTO\b)/i',
        '/(\bUPDATE\b.*\bSET\b)/i',
        '/(\bDELETE\b.*\bFROM\b)/i',
        '/(\bDROP\b.*\bTABLE\b)/i',
        '/(\'|\"|;|--|\#)/i'
    ],
    
    // XSS攻击检测规则
    'xss_attack' => [
        '/<script[^>]*>.*?<\/script>/i',
        '/<iframe[^>]*>.*?<\/iframe>/i',
        '/javascript:/i',
        '/vbscript:/i',
        '/onload=/i',
        '/onerror=/i',
        '/onclick=/i'
    ],
    
    // 文件包含攻击检测
    'file_inclusion' => [
        '/\.\.\//i',
        '/\.\.\\/i',
        '/\/etc\/passwd/i',
        '/\/proc\/self\/environ/i',
        '/php:\/\/input/i',
        '/data:\/\//i'
    ],
    
    // 命令注入检测
    'command_injection' => [
        '/(\||&|;|\$\(|\`)/i',
        '/(cat|ls|pwd|id|whoami|uname)/i',
        '/(wget|curl|nc|netcat)/i'
    ]
];
```

### WAF启用方法

在 `includes/class.security.enhanced.php` 中启用WAF：

```php
// 在每个请求开始时调用
$security = new EnhancedSecurity($database);
$security->checkWAF($_REQUEST);
```

### 自定义WAF规则

管理员可以根据需要添加自定义规则：

```php
// 添加自定义规则
$custom_rules = [
    'custom_pattern' => [
        '/your_custom_pattern/i'
    ]
];

// 合并到现有规则
$waf_rules = array_merge($waf_rules, $custom_rules);
```

## 🚫 访问控制设置

### IP黑名单配置

#### 自动黑名单

系统会自动将以下IP加入黑名单：
- 频繁攻击的IP
- 暴力破解尝试的IP
- 恶意爬虫IP
- 异常访问行为的IP

#### 手动黑名单管理

在管理员后台可以手动管理IP黑名单：

```sql
-- 添加IP到黑名单
INSERT INTO ip_blacklist (ip_address, reason, created_at, expires_at) 
VALUES ('192.168.1.100', '恶意攻击', NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR));

-- 查看黑名单
SELECT * FROM ip_blacklist WHERE expires_at > NOW() OR expires_at IS NULL;

-- 移除IP黑名单
DELETE FROM ip_blacklist WHERE ip_address = '192.168.1.100';
```

### 访问频率限制

#### 全局频率限制

```php
// 配置文件中设置
$rate_limits = [
    'global' => [
        'requests' => 100,  // 每分钟最大请求数
        'window' => 60      // 时间窗口（秒）
    ],
    'login' => [
        'attempts' => 5,    // 登录尝试次数
        'window' => 300     // 锁定时间（秒）
    ],
    'upload' => [
        'files' => 10,      // 每小时最大上传文件数
        'window' => 3600    // 时间窗口（秒）
    ]
];
```

#### IP级别限制

```php
// 针对单个IP的限制
$ip_limits = [
    'requests_per_minute' => 60,
    'requests_per_hour' => 1000,
    'requests_per_day' => 10000
];
```

### 地理位置限制

可以根据地理位置限制访问：

```php
// 允许的国家代码
$allowed_countries = ['CN', 'US', 'JP', 'KR'];

// 禁止的国家代码
$blocked_countries = ['XX', 'YY'];
```

## 📁 文件安全配置

### 文件类型限制

#### 允许的文件类型

```php
$allowed_extensions = [
    // 文档类型
    'txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx',
    // 图片类型
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
    // 音频类型
    'mp3', 'wav', 'flac', 'aac', 'm4a',
    // 视频类型
    'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv',
    // 压缩文件
    'zip', 'rar', '7z', 'tar', 'gz'
];
```

#### 危险文件类型

```php
$dangerous_extensions = [
    // 可执行文件
    'exe', 'bat', 'cmd', 'com', 'scr', 'pif',
    // 脚本文件
    'php', 'asp', 'aspx', 'jsp', 'js', 'vbs',
    // 系统文件
    'dll', 'sys', 'ini', 'reg'
];
```

### 文件内容扫描

#### 恶意文件检测

```php
class FileScanner {
    private $virus_signatures = [
        // 常见病毒特征码
        'EICAR-STANDARD-ANTIVIRUS-TEST-FILE',
        'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR',
        // 恶意脚本特征
        '<?php eval(',
        '<script>alert(',
        'javascript:void(0)'
    ];
    
    public function scanFile($filePath) {
        $content = file_get_contents($filePath);
        
        foreach ($this->virus_signatures as $signature) {
            if (strpos($content, $signature) !== false) {
                return [
                    'safe' => false,
                    'threat' => 'Malicious content detected',
                    'signature' => $signature
                ];
            }
        }
        
        return ['safe' => true];
    }
}
```

#### 文件完整性检查

```php
// 计算文件哈希值
function calculateFileHash($filePath) {
    return hash_file('sha256', $filePath);
}

// 验证文件完整性
function verifyFileIntegrity($filePath, $expectedHash) {
    $actualHash = calculateFileHash($filePath);
    return $actualHash === $expectedHash;
}
```

### 文件存储安全

#### 目录权限设置

```bash
# 设置上传目录权限
chmod 755 uploads/
chmod 644 uploads/*

# 禁止执行权限
find uploads/ -type f -exec chmod 644 {} \;
find uploads/ -type d -exec chmod 755 {} \;

# 设置所有者
chown -R www-data:www-data uploads/
```

#### .htaccess安全配置

在uploads目录创建.htaccess文件：

```apache
# 禁止执行PHP脚本
<Files "*.php">
    Order Deny,Allow
    Deny from all
</Files>

# 禁止访问敏感文件
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|sql|conf)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# 禁止目录浏览
Options -Indexes

# 限制文件大小
LimitRequestBody 104857600

# 防止热链接
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^http(s)?://(www\.)?yourdomain\.com [NC]
RewriteRule \.(jpg|jpeg|png|gif)$ - [F]
```

## 🗄️ 数据库安全

### 连接安全

#### 安全的数据库连接

```php
class SecureDatabase {
    private $connection;
    
    public function __construct($config) {
        $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
            PDO::MYSQL_ATTR_SSL_CA => '/path/to/ca-cert.pem'
        ];
        
        $this->connection = new PDO($dsn, $config['username'], $config['password'], $options);
    }
}
```

### SQL注入防护

#### 预处理语句

```php
// 正确的查询方式
public function getUserById($userId) {
    $stmt = $this->connection->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch();
}

// 错误的查询方式（容易SQL注入）
// $query = "SELECT * FROM users WHERE id = " . $userId;
```

#### 参数验证

```php
public function validateUserId($userId) {
    if (!is_numeric($userId) || $userId <= 0) {
        throw new InvalidArgumentException('Invalid user ID');
    }
    return (int)$userId;
}
```

### 数据加密

#### 敏感数据加密

```php
class DataEncryption {
    private $key;
    
    public function __construct($key) {
        $this->key = $key;
    }
    
    public function encrypt($data) {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $this->key, 0, $iv);
        return base64_encode($iv . $encrypted);
    }
    
    public function decrypt($encryptedData) {
        $data = base64_decode($encryptedData);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt($encrypted, 'AES-256-CBC', $this->key, 0, $iv);
    }
}
```

### 数据库权限

#### 最小权限原则

```sql
-- 创建专用数据库用户
CREATE USER 'cloudapp'@'localhost' IDENTIFIED BY 'strong_password';

-- 只授予必要权限
GRANT SELECT, INSERT, UPDATE, DELETE ON clouddb.* TO 'cloudapp'@'localhost';

-- 不要授予以下权限
-- GRANT ALL PRIVILEGES
-- GRANT CREATE, DROP, ALTER
-- GRANT FILE, PROCESS, SUPER
```

## 🖥️ 服务器安全

### Web服务器配置

#### Nginx安全配置

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    add_header Content-Security-Policy "default-src 'self'";
    
    # 隐藏服务器信息
    server_tokens off;
    
    # 限制请求大小
    client_max_body_size 100M;
    
    # 限制请求频率
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # 安全设置
        fastcgi_param HTTP_PROXY "";
        fastcgi_hide_header X-Powered-By;
    }
    
    # 禁止访问敏感文件
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
        deny all;
    }
}
```

#### Apache安全配置

```apache
# 隐藏服务器信息
ServerTokens Prod
ServerSignature Off

# 安全头
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# 禁用不安全的HTTP方法
<LimitExcept GET POST HEAD>
    Require all denied
</LimitExcept>

# 限制文件上传大小
LimitRequestBody 104857600

# 禁止访问敏感文件
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|sql|conf)$">
    Require all denied
</FilesMatch>

# 禁止目录浏览
Options -Indexes

# 防止信息泄露
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{THE_REQUEST} /\*\s HTTP/
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

### PHP安全配置

#### php.ini安全设置

```ini
; 禁用危险函数
disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source

; 隐藏PHP版本
expose_php = Off

; 禁用远程文件包含
allow_url_fopen = Off
allow_url_include = Off

; 限制文件上传
file_uploads = On
upload_max_filesize = 100M
post_max_size = 100M
max_file_uploads = 20

; 错误报告
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

; 会话安全
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_strict_mode = 1
session.cookie_samesite = Strict

; 其他安全设置
open_basedir = /var/www/html:/tmp
max_execution_time = 30
memory_limit = 256M
```

## 📊 监控与日志

### 安全日志配置

#### 日志类型

系统记录以下类型的安全日志：

1. **访问日志**: 记录所有HTTP请求
2. **认证日志**: 记录登录尝试和结果
3. **操作日志**: 记录重要操作
4. **安全事件日志**: 记录安全相关事件
5. **错误日志**: 记录系统错误

#### 日志格式

```php
class SecurityLogger {
    public function logSecurityEvent($event, $details = []) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event_type' => $event,
            'ip_address' => $_SERVER['REMOTE_ADDR'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'user_id' => $_SESSION['user_id'] ?? null,
            'details' => $details
        ];
        
        $logLine = json_encode($logEntry) . "\n";
        file_put_contents('/var/log/security.log', $logLine, FILE_APPEND | LOCK_EX);
    }
}
```

### 实时监控

#### 异常检测

```php
class AnomalyDetector {
    public function detectAnomalies() {
        // 检测异常登录
        $this->detectSuspiciousLogins();
        
        // 检测异常上传
        $this->detectSuspiciousUploads();
        
        // 检测异常访问
        $this->detectSuspiciousAccess();
    }
    
    private function detectSuspiciousLogins() {
        // 检测短时间内多次失败登录
        $sql = "SELECT ip_address, COUNT(*) as attempts 
                FROM login_attempts 
                WHERE success = 0 AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
                GROUP BY ip_address 
                HAVING attempts > 5";
        
        $results = $this->db->query($sql);
        foreach ($results as $row) {
            $this->addToBlacklist($row['ip_address'], 'Brute force attack');
        }
    }
}
```

### 告警系统

#### 邮件告警

```php
class SecurityAlerts {
    public function sendSecurityAlert($type, $message, $details = []) {
        $subject = "安全告警: {$type}";
        $body = "检测到安全事件:\n\n";
        $body .= "类型: {$type}\n";
        $body .= "消息: {$message}\n";
        $body .= "时间: " . date('Y-m-d H:i:s') . "\n";
        $body .= "详情: " . json_encode($details, JSON_PRETTY_PRINT);
        
        mail('admin@yourdomain.com', $subject, $body);
    }
}
```

## 🚨 应急响应

### 安全事件响应流程

#### 1. 事件识别
- 监控系统发现异常
- 用户报告安全问题
- 定期安全检查发现问题

#### 2. 事件评估
- 确定事件类型和严重程度
- 评估影响范围
- 制定应对策略

#### 3. 应急处理
- 立即阻止攻击
- 隔离受影响系统
- 收集证据和日志

#### 4. 恢复服务
- 修复安全漏洞
- 恢复正常服务
- 验证系统安全性

#### 5. 事后分析
- 分析事件原因
- 改进安全措施
- 更新应急预案

### 常见安全事件处理

#### SQL注入攻击

```bash
# 1. 立即阻止攻击IP
iptables -A INPUT -s ATTACKER_IP -j DROP

# 2. 检查数据库日志
tail -f /var/log/mysql/mysql.log | grep "SELECT\|INSERT\|UPDATE\|DELETE"

# 3. 修复漏洞
# 检查并修复存在SQL注入的代码

# 4. 恢复数据（如需要）
mysql -u root -p < backup.sql
```

#### 文件上传攻击

```bash
# 1. 检查上传的恶意文件
find uploads/ -name "*.php" -o -name "*.asp" -o -name "*.jsp"

# 2. 删除恶意文件
find uploads/ -name "*.php" -delete

# 3. 修复上传功能
# 加强文件类型检查和内容扫描

# 4. 更新.htaccess规则
echo "php_flag engine off" > uploads/.htaccess
```

#### DDoS攻击

```bash
# 1. 启用DDoS防护
# 使用CDN或DDoS防护服务

# 2. 限制连接数
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 -j DROP

# 3. 分析攻击流量
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n

# 4. 封禁攻击IP
for ip in $(攻击IP列表); do
    iptables -A INPUT -s $ip -j DROP
done
```

### 数据备份与恢复

#### 自动备份脚本

```bash
#!/bin/bash
# backup.sh - 自动备份脚本

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
DB_NAME="clouddb"
WEB_DIR="/var/www/html"

# 创建备份目录
mkdir -p $BACKUP_DIR/$DATE

# 备份数据库
mysqldump -u root -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/$DATE/database.sql

# 备份网站文件
tar -czf $BACKUP_DIR/$DATE/website.tar.gz $WEB_DIR

# 备份用户文件
tar -czf $BACKUP_DIR/$DATE/uploads.tar.gz $WEB_DIR/uploads

# 删除7天前的备份
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

echo "备份完成: $BACKUP_DIR/$DATE"
```

#### 恢复流程

```bash
# 1. 停止Web服务
systemctl stop nginx
systemctl stop php8.0-fpm

# 2. 恢复数据库
mysql -u root -p $DB_NAME < backup/database.sql

# 3. 恢复网站文件
tar -xzf backup/website.tar.gz -C /

# 4. 恢复用户文件
tar -xzf backup/uploads.tar.gz -C /var/www/html/

# 5. 设置权限
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/

# 6. 启动服务
systemctl start php8.0-fpm
systemctl start nginx
```

## 📋 安全检查清单

### 日常安全检查

- [ ] 检查系统日志是否有异常
- [ ] 验证备份是否正常执行
- [ ] 检查SSL证书是否即将过期
- [ ] 查看安全监控告警
- [ ] 检查系统资源使用情况

### 周期性安全检查

#### 每周检查
- [ ] 更新系统安全补丁
- [ ] 检查用户账户异常
- [ ] 分析安全日志
- [ ] 测试备份恢复功能

#### 每月检查
- [ ] 安全漏洞扫描
- [ ] 密码策略审查
- [ ] 权限配置审查
- [ ] 安全培训更新

#### 每季度检查
- [ ] 全面安全评估
- [ ] 应急预案演练
- [ ] 安全策略更新
- [ ] 第三方安全审计

---

通过遵循本安全指南，您可以构建一个安全可靠的网盘系统。安全是一个持续的过程，需要定期更新和改进安全措施。
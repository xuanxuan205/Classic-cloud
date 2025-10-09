# 安全策略 (Security Policy)

## 🛡️ 支持的版本

我们积极维护以下版本的安全更新：

| 版本 | 支持状态 |
| --- | --- |
| 1.0.2 | ✅ 完全支持 |
| 0.x.x | ❌ 不再支持 |

## 🚨 报告安全漏洞

### 报告流程

如果您发现了安全漏洞，请**不要**在公开的GitHub Issues中报告。我们建议通过以下私密渠道报告：

#### 首选方式：邮件报告
📧 **security@gta5fuzhup.cn** (如果邮箱不存在，请使用 jyd9527@zohomail.cn)

#### 报告内容应包括：

1. **漏洞描述**
   - 详细描述安全问题
   - 潜在的影响范围
   - 漏洞类型分类

2. **复现步骤**
   - 详细的复现步骤
   - 必要的测试环境信息
   - 相关的代码片段或截图

3. **影响评估**
   - 受影响的版本
   - 攻击复杂度评估
   - 潜在的业务影响

4. **修复建议**（可选）
   - 临时缓解措施
   - 修复方案建议

### 响应时间承诺

- **确认收到**: 48小时内
- **初步评估**: 7天内
- **修复发布**: 30天内（根据严重程度调整）

### 漏洞等级分类

#### 🔴 严重 (Critical)
- 远程代码执行
- SQL注入导致数据泄露
- 身份验证绕过
- 管理员权限提升

**响应时间**: 24小时内确认，7天内修复

#### 🟠 高危 (High)
- 敏感信息泄露
- 跨站脚本攻击(XSS)
- 跨站请求伪造(CSRF)
- 文件上传漏洞

**响应时间**: 48小时内确认，14天内修复

#### 🟡 中危 (Medium)
- 信息泄露
- 拒绝服务攻击
- 权限控制缺陷

**响应时间**: 7天内确认，30天内修复

#### 🟢 低危 (Low)
- 配置问题
- 信息收集
- 其他安全建议

**响应时间**: 14天内确认，根据情况修复

## 🔒 安全最佳实践

### 部署安全

#### 服务器加固
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置防火墙
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 禁用不必要的服务
sudo systemctl disable apache2-doc
sudo systemctl disable apache2-utils
```

#### 文件权限设置
```bash
# 设置正确的文件权限
sudo chown -R www-data:www-data /var/www/classic-cloud
sudo chmod -R 755 /var/www/classic-cloud
sudo chmod -R 700 /var/www/classic-cloud/config
sudo chmod -R 777 /var/www/classic-cloud/uploads
sudo chmod -R 777 /var/www/classic-cloud/cache
```

#### 数据库安全
```sql
-- 创建专用数据库用户
CREATE USER 'classic_user'@'localhost' IDENTIFIED BY 'ComplexPassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON classic_cloud.* TO 'classic_user'@'localhost';

-- 禁用危险函数
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
```

### 应用安全配置

#### PHP 安全设置
```ini
# php.ini 安全配置
expose_php = Off
display_errors = Off
log_errors = On
allow_url_fopen = Off
allow_url_include = Off
enable_dl = Off
file_uploads = On
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 30
memory_limit = 128M
```

#### Web服务器安全

**Apache 安全配置**:
```apache
# 隐藏服务器信息
ServerTokens Prod
ServerSignature Off

# 安全头设置
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set Content-Security-Policy "default-src 'self'"

# 禁止访问敏感目录
<Directory "/var/www/classic-cloud/config">
    Require all denied
</Directory>

<Directory "/var/www/classic-cloud/logs">
    Require all denied
</Directory>
```

**Nginx 安全配置**:
```nginx
# 隐藏版本信息
server_tokens off;

# 安全头设置
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

# 限制请求大小
client_max_body_size 10M;

# 禁止访问敏感文件
location ~ /\. {
    deny all;
}

location ~* \.(conf|log|sql)$ {
    deny all;
}
```

### 应用层安全

#### 输入验证
```php
// 输入过滤和验证
function sanitizeInput($input, $type = 'string') {
    switch ($type) {
        case 'email':
            return filter_var($input, FILTER_SANITIZE_EMAIL);
        case 'int':
            return filter_var($input, FILTER_SANITIZE_NUMBER_INT);
        case 'url':
            return filter_var($input, FILTER_SANITIZE_URL);
        default:
            return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}
```

#### SQL注入防护
```php
// 使用预处理语句
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = ?");
$stmt->execute([$email, $status]);
$user = $stmt->fetch();
```

#### XSS防护
```php
// 输出转义
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// 使用CSP头
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'");
```

#### CSRF防护
```php
// 生成CSRF令牌
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// 验证CSRF令牌
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
```

#### 文件上传安全
```php
function validateFileUpload($file) {
    // 检查文件类型
    $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('不支持的文件类型');
    }
    
    // 检查文件大小
    if ($file['size'] > 10 * 1024 * 1024) { // 10MB
        throw new Exception('文件大小超出限制');
    }
    
    // 检查文件内容
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        throw new Exception('文件内容与扩展名不匹配');
    }
}
```

## 📋 安全检查清单

### 部署前检查

- [ ] 移除调试信息和测试代码
- [ ] 配置正确的文件权限
- [ ] 启用HTTPS
- [ ] 配置安全响应头
- [ ] 设置强密码策略
- [ ] 启用日志记录
- [ ] 配置防火墙规则
- [ ] 更新所有依赖组件

### 定期安全维护

- [ ] 定期更新系统补丁
- [ ] 监控安全日志
- [ ] 备份重要数据
- [ ] 检查文件完整性
- [ ] 审查用户权限
- [ ] 测试备份恢复
- [ ] 进行安全扫描

## 📞 联系信息

### 安全团队
- **邮箱**: security@gta5fuzhup.cn
- **备用邮箱**: jyd9527@zohomail.cn

### 技术支持
- **GitHub Issues**: [报告非安全问题](https://github.com/xuanxuan205/Classic-cloud/issues)
- **官方网站**: [https://gta5fuzhup.cn](https://gta5fuzhup.cn)

---

## 📄 免责声明

本安全策略旨在建立负责任的漏洞披露流程。我们承诺：

1. 不会对善意的安全研究人员采取法律行动
2. 与研究人员合作修复漏洞
3. 在修复完成后公开致谢（除非研究人员明确要求匿名）
4. 持续改进我们的安全措施

**最后更新**: 2025年1月9日

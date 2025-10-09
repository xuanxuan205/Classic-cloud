# 经典云开发文档

## 目录
- [开发环境](#开发环境)
- [项目结构](#项目结构)
- [核心模块](#核心模块)
- [API接口](#api接口)
- [数据库设计](#数据库设计)
- [开发规范](#开发规范)
- [测试指南](#测试指南)

## 开发环境

### 环境要求

- **PHP**: >= 7.4 (推荐 8.0+)
- **MySQL**: >= 5.7 (推荐 8.0+)
- **Web服务器**: Apache 2.4+ 或 Nginx 1.18+
- **扩展要求**: 
  - mbstring
  - pdo_mysql
  - gd
  - curl
  - json

### 开发工具推荐

- **IDE**: PhpStorm, VS Code
- **版本控制**: Git
- **API测试**: Postman, Insomnia
- **数据库管理**: phpMyAdmin, MySQL Workbench

## 项目结构

经典云采用标准的MVC架构模式，主要目录结构说明：

### 📁 主要目录说明
- **前端模块** - 用户界面和交互逻辑
- **后端模块** - 业务逻辑和数据处理
- **管理模块** - 系统管理和配置
- **API模块** - 接口服务和数据交换
- **静态资源** - CSS、JS、图片等资源文件
- **配置文件** - 系统配置和参数设置
- **文档目录** - 项目文档和说明
- **工具脚本** - 安装、部署、维护脚本

### 🏛️ 架构设计原则
- **模块化设计** - 各功能模块独立，易于维护
- **分层架构** - 表现层、业务层、数据层分离
- **安全优先** - 多层安全防护机制
- **可扩展性** - 支持功能扩展和性能优化

## 核心模块

### 1. 认证模块 (Auth)

**文件位置**: `includes/classes/Auth.php`

```php
class Auth {
    public function login($username, $password) {
        // 用户登录逻辑
    }
    
    public function logout() {
        // 用户登出逻辑
    }
    
    public function checkPermission($action) {
        // 权限检查
    }
}
```

### 2. 文件管理模块 (FileManager)

**文件位置**: `includes/classes/FileManager.php`

```php
class FileManager {
    public function upload($file, $path) {
        // 文件上传处理
    }
    
    public function download($fileId) {
        // 文件下载处理
    }
    
    public function delete($fileId) {
        // 文件删除处理
    }
}
```

### 3. 用户管理模块 (UserManager)

**文件位置**: `includes/classes/UserManager.php`

```php
class UserManager {
    public function create($userData) {
        // 创建用户
    }
    
    public function update($userId, $userData) {
        // 更新用户信息
    }
    
    public function getUser($userId) {
        // 获取用户信息
    }
}
```

## API接口

### RESTful API 设计

所有API接口遵循RESTful设计原则：

- **GET** - 获取资源
- **POST** - 创建资源
- **PUT** - 更新资源
- **DELETE** - 删除资源

### 接口格式

**请求格式**:
```json
{
    "action": "upload",
    "data": {
        "file": "base64_encoded_file",
        "filename": "example.txt"
    }
}
```

**响应格式**:
```json
{
    "status": "success",
    "code": 200,
    "message": "操作成功",
    "data": {
        "fileId": 12345,
        "url": "/files/example.txt"
    }
}
```

### 认证机制

使用JWT Token进行API认证：

```php
// 生成Token
$token = JWT::encode($payload, $secret_key, 'HS256');

// 验证Token
$decoded = JWT::decode($token, $secret_key, ['HS256']);
```

## 数据库设计

### 主要数据表

#### 用户表 (users)
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'user', 'guest') DEFAULT 'user',
    storage_quota BIGINT DEFAULT 1073741824, -- 1GB
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 文件表 (files)
```sql
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    hash_md5 VARCHAR(32),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 分享表 (shares)
```sql
CREATE TABLE shares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT NOT NULL,
    share_token VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(255),
    expire_at TIMESTAMP NULL,
    download_count INT DEFAULT 0,
    max_downloads INT DEFAULT -1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
);
```

## 开发规范

### 1. PHP编码规范

遵循PSR-12编码标准：

```php
<?php

declare(strict_types=1);

namespace ClassicCloud\Core;

class FileManager
{
    private string $uploadPath;
    
    public function __construct(string $uploadPath)
    {
        $this->uploadPath = $uploadPath;
    }
    
    public function upload(array $file): array
    {
        // 实现逻辑
        return [
            'success' => true,
            'fileId' => $fileId,
        ];
    }
}
```

### 2. 安全规范

- **输入验证**: 所有用户输入必须验证和过滤
- **SQL注入防护**: 使用预处理语句
- **XSS防护**: 输出时进行HTML转义
- **CSRF防护**: 使用CSRF Token

```php
// 安全的数据库查询
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);

// XSS防护
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');
```

### 3. 错误处理

```php
try {
    $result = $fileManager->upload($_FILES['file']);
} catch (FileUploadException $e) {
    error_log($e->getMessage());
    return [
        'status' => 'error',
        'message' => '文件上传失败'
    ];
}
```

## 测试指南

### 单元测试

使用PHPUnit进行单元测试：

```php
<?php

use PHPUnit\Framework\TestCase;

class FileManagerTest extends TestCase
{
    public function testUploadFile()
    {
        $fileManager = new FileManager('/uploads');
        $result = $fileManager->upload($mockFile);
        
        $this->assertTrue($result['success']);
        $this->assertIsInt($result['fileId']);
    }
}
```

### API测试

使用Postman或curl进行API测试：

```bash
# 测试文件上传API
curl -X POST \
  http://localhost/api/v1/files/upload \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@test.txt'
```

### 性能测试

- 使用Apache Bench进行压力测试
- 监控数据库查询性能
- 检查内存使用情况

---

更多开发相关问题请参考项目Wiki或联系技术团队。
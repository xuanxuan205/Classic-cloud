# 经典云网盘系统 - API接口文档

本文档详细介绍经典云网盘系统的API接口，供开发者集成和扩展使用。

## 📖 目录

1. [API概述](#api概述)
2. [认证机制](#认证机制)
3. [用户管理API](#用户管理api)
4. [文件管理API](#文件管理api)
5. [分享管理API](#分享管理api)
6. [系统管理API](#系统管理api)
7. [错误处理](#错误处理)
8. [SDK示例](#sdk示例)

## 🌐 API概述

### 基本信息

- **Base URL**: `https://your-domain.com/api/`
- **API版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8
- **请求方法**: GET, POST, PUT, DELETE

### 通用响应格式

所有API响应都遵循统一格式：

```json
{
    "success": true,
    "message": "操作成功",
    "data": {
        // 具体数据内容
    },
    "code": 200,
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### HTTP状态码

- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权访问
- `403` - 权限不足
- `404` - 资源不存在
- `429` - 请求频率超限
- `500` - 服务器内部错误

## 🔐 认证机制

### 获取访问令牌

**接口地址**: `POST /api/auth/login`

**请求参数**:
```json
{
    "username": "用户名",
    "password": "密码",
    "captcha": "验证码"
}
```

**响应示例**:
```json
{
    "success": true,
    "message": "登录成功",
    "data": {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "Bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "role": "user"
        }
    }
}
```

### 使用访问令牌

在请求头中添加Authorization字段：

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### 刷新令牌

**接口地址**: `POST /api/auth/refresh`

**请求头**:
```http
Authorization: Bearer your_access_token
```

**响应示例**:
```json
{
    "success": true,
    "data": {
        "access_token": "new_access_token",
        "expires_in": 3600
    }
}
```

## 👤 用户管理API

### 用户注册

**接口地址**: `POST /api/users/register`

**请求参数**:
```json
{
    "username": "新用户名",
    "email": "user@example.com",
    "password": "用户密码",
    "captcha": "验证码"
}
```

**响应示例**:
```json
{
    "success": true,
    "message": "注册成功",
    "data": {
        "user_id": 123,
        "username": "新用户名",
        "email": "user@example.com"
    }
}
```

### 获取用户信息

**接口地址**: `GET /api/users/profile`

**请求头**:
```http
Authorization: Bearer your_access_token
```

**响应示例**:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
        "storage_used": 1048576,
        "storage_limit": 1073741824,
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-01T12:00:00Z"
    }
}
```

### 更新用户信息

**接口地址**: `PUT /api/users/profile`

**请求参数**:
```json
{
    "email": "newemail@example.com",
    "current_password": "当前密码",
    "new_password": "新密码"
}
```

### 获取用户列表（管理员）

**接口地址**: `GET /api/admin/users`

**查询参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `search`: 搜索关键词
- `status`: 用户状态（active/disabled）

**响应示例**:
```json
{
    "success": true,
    "data": {
        "users": [
            {
                "id": 1,
                "username": "user1",
                "email": "user1@example.com",
                "status": "active",
                "storage_used": 1048576,
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 100,
            "per_page": 20
        }
    }
}
```

## 📁 文件管理API

### 获取文件列表

**接口地址**: `GET /api/files`

**查询参数**:
- `folder_id`: 文件夹ID（默认0为根目录）
- `page`: 页码
- `limit`: 每页数量
- `sort`: 排序方式（name/size/date）
- `order`: 排序顺序（asc/desc）

**响应示例**:
```json
{
    "success": true,
    "data": {
        "files": [
            {
                "id": 1,
                "name": "document.pdf",
                "type": "file",
                "size": 1048576,
                "mime_type": "application/pdf",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": 2,
                "name": "Images",
                "type": "folder",
                "size": 0,
                "file_count": 15,
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "current_folder": {
            "id": 0,
            "name": "根目录",
            "path": "/"
        },
        "pagination": {
            "current_page": 1,
            "total_pages": 3,
            "total_items": 50
        }
    }
}
```

### 上传文件

**接口地址**: `POST /api/files/upload`

**请求类型**: `multipart/form-data`

**请求参数**:
- `file`: 文件数据
- `folder_id`: 目标文件夹ID（可选）
- `chunk`: 分片序号（分片上传时使用）
- `chunks`: 总分片数（分片上传时使用）

**响应示例**:
```json
{
    "success": true,
    "message": "文件上传成功",
    "data": {
        "file_id": 123,
        "name": "uploaded_file.jpg",
        "size": 2048576,
        "mime_type": "image/jpeg",
        "url": "/uploads/2024/01/uploaded_file.jpg"
    }
}
```

### 下载文件

**接口地址**: `GET /api/files/{file_id}/download`

**请求头**:
```http
Authorization: Bearer your_access_token
```

**响应**: 直接返回文件内容，设置适当的Content-Type和Content-Disposition头。

### 删除文件

**接口地址**: `DELETE /api/files/{file_id}`

**响应示例**:
```json
{
    "success": true,
    "message": "文件已删除"
}
```

### 重命名文件

**接口地址**: `PUT /api/files/{file_id}/rename`

**请求参数**:
```json
{
    "new_name": "新文件名.txt"
}
```

### 移动文件

**接口地址**: `PUT /api/files/{file_id}/move`

**请求参数**:
```json
{
    "target_folder_id": 5
}
```

### 创建文件夹

**接口地址**: `POST /api/folders`

**请求参数**:
```json
{
    "name": "新文件夹",
    "parent_id": 0
}
```

### 搜索文件

**接口地址**: `GET /api/files/search`

**查询参数**:
- `q`: 搜索关键词
- `type`: 文件类型过滤
- `size_min`: 最小文件大小
- `size_max`: 最大文件大小
- `date_from`: 开始日期
- `date_to`: 结束日期

**响应示例**:
```json
{
    "success": true,
    "data": {
        "files": [
            {
                "id": 1,
                "name": "search_result.pdf",
                "path": "/Documents/search_result.pdf",
                "size": 1048576,
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "total": 1
    }
}
```

## 🔗 分享管理API

### 创建分享链接

**接口地址**: `POST /api/shares`

**请求参数**:
```json
{
    "file_id": 123,
    "password": "访问密码",
    "expire_time": "2024-12-31T23:59:59Z",
    "download_limit": 100
}
```

**响应示例**:
```json
{
    "success": true,
    "message": "分享链接创建成功",
    "data": {
        "share_id": "abc123def456",
        "share_url": "https://your-domain.com/s/abc123def456",
        "password": "访问密码",
        "expire_time": "2024-12-31T23:59:59Z",
        "download_limit": 100,
        "download_count": 0
    }
}
```

### 获取分享列表

**接口地址**: `GET /api/shares`

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `status`: 分享状态（active/expired/disabled）

**响应示例**:
```json
{
    "success": true,
    "data": {
        "shares": [
            {
                "id": "abc123def456",
                "file_name": "shared_file.pdf",
                "share_url": "https://your-domain.com/s/abc123def456",
                "download_count": 5,
                "download_limit": 100,
                "expire_time": "2024-12-31T23:59:59Z",
                "status": "active",
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 2,
            "total_items": 25
        }
    }
}
```

### 访问分享链接

**接口地址**: `GET /api/shares/{share_id}`

**查询参数**:
- `password`: 访问密码（如果设置了密码）

**响应示例**:
```json
{
    "success": true,
    "data": {
        "file_name": "shared_file.pdf",
        "file_size": 1048576,
        "download_url": "/api/shares/abc123def456/download",
        "download_count": 5,
        "download_limit": 100
    }
}
```

### 下载分享文件

**接口地址**: `GET /api/shares/{share_id}/download`

**查询参数**:
- `password`: 访问密码（如果需要）

### 删除分享链接

**接口地址**: `DELETE /api/shares/{share_id}`

**响应示例**:
```json
{
    "success": true,
    "message": "分享链接已删除"
}
```

## ⚙️ 系统管理API

### 获取系统信息

**接口地址**: `GET /api/admin/system/info`

**权限要求**: 管理员

**响应示例**:
```json
{
    "success": true,
    "data": {
        "system": {
            "version": "1.0.0",
            "php_version": "8.0.0",
            "mysql_version": "8.0.25",
            "server_time": "2024-01-01T12:00:00Z",
            "uptime": "5 days, 3 hours"
        },
        "storage": {
            "total_space": 107374182400,
            "used_space": 10737418240,
            "free_space": 96636764160,
            "usage_percentage": 10.0
        },
        "statistics": {
            "total_users": 1000,
            "active_users": 850,
            "total_files": 50000,
            "total_shares": 5000
        }
    }
}
```

### 获取系统统计

**接口地址**: `GET /api/admin/statistics`

**查询参数**:
- `period`: 统计周期（day/week/month/year）
- `start_date`: 开始日期
- `end_date`: 结束日期

**响应示例**:
```json
{
    "success": true,
    "data": {
        "users": {
            "new_registrations": 50,
            "active_users": 800,
            "total_users": 1000
        },
        "files": {
            "uploads": 500,
            "downloads": 2000,
            "total_size": 10737418240
        },
        "shares": {
            "new_shares": 100,
            "total_downloads": 5000
        },
        "chart_data": {
            "dates": ["2024-01-01", "2024-01-02", "2024-01-03"],
            "uploads": [10, 15, 20],
            "downloads": [50, 60, 80]
        }
    }
}
```

### 系统设置

**接口地址**: `GET /api/admin/settings`

**响应示例**:
```json
{
    "success": true,
    "data": {
        "site_name": "经典云",
        "site_description": "安全可靠的云存储服务",
        "registration_enabled": true,
        "max_file_size": 104857600,
        "allowed_extensions": ["jpg", "png", "pdf", "doc"],
        "default_storage_limit": 1073741824
    }
}
```

**更新设置**: `PUT /api/admin/settings`

**请求参数**:
```json
{
    "site_name": "新站点名称",
    "registration_enabled": false,
    "max_file_size": 209715200
}
```

### 清理系统

**接口地址**: `POST /api/admin/cleanup`

**请求参数**:
```json
{
    "clean_expired_shares": true,
    "clean_deleted_files": true,
    "clean_old_logs": true,
    "days_to_keep": 30
}
```

## ❌ 错误处理

### 错误响应格式

```json
{
    "success": false,
    "message": "错误描述",
    "error": {
        "code": "ERROR_CODE",
        "details": "详细错误信息"
    },
    "timestamp": "2024-01-01T12:00:00Z"
}
```

### 常见错误码

| 错误码 | 描述 | HTTP状态码 |
|--------|------|------------|
| `INVALID_CREDENTIALS` | 用户名或密码错误 | 401 |
| `TOKEN_EXPIRED` | 访问令牌已过期 | 401 |
| `INSUFFICIENT_PERMISSIONS` | 权限不足 | 403 |
| `FILE_NOT_FOUND` | 文件不存在 | 404 |
| `FILE_TOO_LARGE` | 文件大小超过限制 | 400 |
| `INVALID_FILE_TYPE` | 不支持的文件类型 | 400 |
| `STORAGE_QUOTA_EXCEEDED` | 存储空间不足 | 400 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 | 429 |
| `INTERNAL_SERVER_ERROR` | 服务器内部错误 | 500 |

### 错误处理示例

```javascript
fetch('/api/files/upload', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('上传成功:', data.data);
    } else {
        console.error('上传失败:', data.message);
        
        // 根据错误码处理
        switch (data.error.code) {
            case 'FILE_TOO_LARGE':
                alert('文件大小超过限制');
                break;
            case 'INVALID_FILE_TYPE':
                alert('不支持的文件类型');
                break;
            default:
                alert('上传失败: ' + data.message);
        }
    }
})
.catch(error => {
    console.error('网络错误:', error);
});
```

## 💻 SDK示例

### JavaScript SDK

```javascript
class CloudAPI {
    constructor(baseURL, token = null) {
        this.baseURL = baseURL;
        this.token = token;
    }
    
    setToken(token) {
        this.token = token;
    }
    
    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = 'Bearer ' + this.token;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        return await response.json();
    }
    
    // 用户认证
    async login(username, password, captcha) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password, captcha })
        });
    }
    
    // 获取文件列表
    async getFiles(folderId = 0, page = 1) {
        return await this.request(`/files?folder_id=${folderId}&page=${page}`);
    }
    
    // 上传文件
    async uploadFile(file, folderId = 0) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder_id', folderId);
        
        return await this.request('/files/upload', {
            method: 'POST',
            headers: {}, // 清空Content-Type让浏览器自动设置
            body: formData
        });
    }
    
    // 创建分享
    async createShare(fileId, options = {}) {
        return await this.request('/shares', {
            method: 'POST',
            body: JSON.stringify({
                file_id: fileId,
                ...options
            })
        });
    }
}

// 使用示例
const api = new CloudAPI('https://your-domain.com/api');

// 登录
api.login('username', 'password', 'captcha')
    .then(result => {
        if (result.success) {
            api.setToken(result.data.access_token);
            console.log('登录成功');
        }
    });

// 获取文件列表
api.getFiles().then(result => {
    if (result.success) {
        console.log('文件列表:', result.data.files);
    }
});
```

### Python SDK

```python
import requests
import json

class CloudAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
    
    def set_token(self, token):
        self.token = token
        self.session.headers.update({
            'Authorization': f'Bearer {token}'
        })
    
    def request(self, endpoint, method='GET', data=None, files=None):
        url = self.base_url + endpoint
        
        if method == 'GET':
            response = self.session.get(url, params=data)
        elif method == 'POST':
            if files:
                response = self.session.post(url, data=data, files=files)
            else:
                response = self.session.post(url, json=data)
        elif method == 'PUT':
            response = self.session.put(url, json=data)
        elif method == 'DELETE':
            response = self.session.delete(url)
        
        return response.json()
    
    def login(self, username, password, captcha):
        return self.request('/auth/login', 'POST', {
            'username': username,
            'password': password,
            'captcha': captcha
        })
    
    def get_files(self, folder_id=0, page=1):
        return self.request('/files', 'GET', {
            'folder_id': folder_id,
            'page': page
        })
    
    def upload_file(self, file_path, folder_id=0):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'folder_id': folder_id}
            return self.request('/files/upload', 'POST', data, files)
    
    def create_share(self, file_id, **options):
        data = {'file_id': file_id, **options}
        return self.request('/shares', 'POST', data)

# 使用示例
api = CloudAPI('https://your-domain.com/api')

# 登录
result = api.login('username', 'password', 'captcha')
if result['success']:
    api.set_token(result['data']['access_token'])
    print('登录成功')

# 获取文件列表
files = api.get_files()
if files['success']:
    print('文件列表:', files['data']['files'])

# 上传文件
upload_result = api.upload_file('/path/to/file.txt')
if upload_result['success']:
    print('上传成功:', upload_result['data'])
```

### PHP SDK

```php
<?php
class CloudAPI {
    private $baseURL;
    private $token;
    
    public function __construct($baseURL, $token = null) {
        $this->baseURL = rtrim($baseURL, '/');
        $this->token = $token;
    }
    
    public function setToken($token) {
        $this->token = $token;
    }
    
    private function request($endpoint, $method = 'GET', $data = null, $files = null) {
        $url = $this->baseURL . $endpoint;
        $headers = ['Content-Type: application/json'];
        
        if ($this->token) {
            $headers[] = 'Authorization: Bearer ' . $this->token;
        }
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        switch ($method) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                if ($files) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                } else {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'PUT':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
        }
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function login($username, $password, $captcha) {
        return $this->request('/auth/login', 'POST', [
            'username' => $username,
            'password' => $password,
            'captcha' => $captcha
        ]);
    }
    
    public function getFiles($folderId = 0, $page = 1) {
        return $this->request("/files?folder_id={$folderId}&page={$page}");
    }
    
    public function uploadFile($filePath, $folderId = 0) {
        $data = [
            'file' => new CURLFile($filePath),
            'folder_id' => $folderId
        ];
        return $this->request('/files/upload', 'POST', $data, true);
    }
    
    public function createShare($fileId, $options = []) {
        $data = array_merge(['file_id' => $fileId], $options);
        return $this->request('/shares', 'POST', $data);
    }
}

// 使用示例
$api = new CloudAPI('https://your-domain.com/api');

// 登录
$result = $api->login('username', 'password', 'captcha');
if ($result['success']) {
    $api->setToken($result['data']['access_token']);
    echo "登录成功\n";
}

// 获取文件列表
$files = $api->getFiles();
if ($files['success']) {
    print_r($files['data']['files']);
}
?>
```

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 初始API版本发布
- 支持用户管理、文件管理、分享管理
- 提供完整的RESTful API接口

---

本API文档将持续更新，如有疑问请联系技术支持。
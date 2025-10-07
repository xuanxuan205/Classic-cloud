# 宝塔面板部署指南

本指南详细介绍如何在宝塔面板环境下部署经典云网盘系统。

## 📋 部署前准备

### 服务器要求
- **操作系统**: CentOS 7+ / Ubuntu 18+ / Debian 9+
- **内存**: 至少 1GB RAM (推荐 2GB+)
- **存储**: 至少 20GB 可用空间
- **网络**: 稳定的网络连接

### 宝塔面板要求
- **宝塔版本**: 7.0+ (推荐最新版本)
- **PHP版本**: 7.4 / 8.0 / 8.1
- **MySQL版本**: 5.7+ / 8.0+
- **Web服务器**: Nginx 1.16+ 或 Apache 2.4+

## 🚀 安装宝塔面板

### CentOS系统
```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

### Ubuntu/Debian系统
```bash
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
```

### 安装完成后
1. 记录面板地址、用户名和密码
2. 登录宝塔面板
3. 绑定宝塔账号（可选）

## 🛠️ 环境配置

### 1. 安装软件环境

在宝塔面板 → 软件商店中安装：

#### Web服务器（选择其一）
- **Nginx** 1.20+ (推荐)
- **Apache** 2.4+

#### 数据库
- **MySQL** 5.7+ 或 8.0+ (推荐)
- **MariaDB** 10.3+

#### PHP环境
- **PHP** 7.4 / 8.0 / 8.1 (推荐 8.0)

#### 其他工具
- **phpMyAdmin** 5.0+ (数据库管理)
- **Redis** (可选，用于缓存)

### 2. PHP扩展配置

在 PHP管理 → 安装扩展 中安装以下扩展：

#### 必需扩展
- `mysqli` - MySQL数据库支持
- `gd` - 图像处理
- `fileinfo` - 文件信息检测
- `curl` - HTTP请求
- `openssl` - 加密支持
- `mbstring` - 多字节字符串
- `json` - JSON支持

#### 推荐扩展
- `redis` - Redis缓存支持
- `zip` - 压缩文件支持
- `exif` - 图像元数据

### 3. PHP参数调整

在 PHP管理 → 配置修改 中调整以下参数：

```ini
# 上传文件大小限制
upload_max_filesize = 100M
post_max_size = 100M
max_file_uploads = 20

# 执行时间限制
max_execution_time = 300
max_input_time = 300

# 内存限制
memory_limit = 256M

# 错误报告
display_errors = Off
log_errors = On
error_log = /www/wwwlogs/php_errors.log
```

## 📁 网站部署

### 1. 创建网站

在宝塔面板 → 网站 → 添加站点：

- **域名**: 填入您的域名（如：cloud.example.com）
- **根目录**: 默认或自定义路径
- **PHP版本**: 选择已安装的PHP版本
- **数据库**: 创建MySQL数据库

记录以下信息：
- 数据库名称
- 数据库用户名
- 数据库密码

### 2. 上传源码

#### 方法一：在线下载
```bash
cd /www/wwwroot/your-domain.com
wget https://github.com/your-repo/classic-cloud/archive/main.zip
unzip main.zip
mv classic-cloud-main/* ./
rm -rf classic-cloud-main main.zip
```

#### 方法二：文件管理器上传
1. 在宝塔面板 → 文件 中进入网站根目录
2. 上传项目压缩包
3. 解压到当前目录

### 3. 设置文件权限

在文件管理器中设置权限：

```bash
# 设置基本权限
chmod -R 755 /www/wwwroot/your-domain.com/

# 设置可写目录权限
chmod -R 777 /www/wwwroot/your-domain.com/uploads/
chmod -R 777 /www/wwwroot/your-domain.com/config/
chmod -R 777 /www/wwwroot/your-domain.com/logs/
```

或在SSH中执行：
```bash
cd /www/wwwroot/your-domain.com
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod -R 777 uploads/ config/ logs/
```

## 🔧 系统安装

### 1. 访问安装向导

在浏览器中访问：`http://your-domain.com/install/`

### 2. 环境检测

系统会自动检测：
- PHP版本和扩展
- 文件权限
- 目录可写性
- 服务器配置

确保所有检测项都显示为 ✅ 通过。

### 3. 数据库配置

填入在宝塔面板中创建的数据库信息：
- **数据库类型**: MySQL
- **数据库服务器**: localhost
- **数据库名称**: 您创建的数据库名
- **用户名**: 数据库用户名
- **密码**: 数据库密码
- **表前缀**: 默认为空或自定义

### 4. 管理员账户设置

根据要求设置管理员账户：
- **用户名**: DeZai
- **密码**: luyunde1906
- **邮箱**: 2080341475@qq.com

### 5. 完成安装

点击"完成安装"，系统将：
- 创建数据库表结构
- 生成配置文件
- 设置默认数据
- 清理安装文件

## 🔒 安全配置

### 1. SSL证书配置

在宝塔面板 → 网站 → SSL中：
1. 选择证书类型（Let's Encrypt免费证书推荐）
2. 申请并部署证书
3. 开启强制HTTPS

### 2. 防火墙设置

在宝塔面板 → 安全 → 防火墙中：
- 开启防火墙
- 只开放必要端口（80, 443, 22, 8888）
- 设置SSH端口（建议修改默认22端口）

### 3. 网站安全设置

在网站设置 → 配置文件中确认：
- 已包含项目提供的.htaccess规则
- 禁止访问敏感目录
- 设置正确的安全头

### 4. 数据库安全

在数据库管理中：
- 修改root密码
- 创建专用数据库用户
- 限制数据库访问权限

## 📊 性能优化

### 1. 开启OPcache

在PHP管理 → 性能调整中：
- 开启OPcache
- 设置合适的缓存大小
- 开启文件缓存

### 2. 开启Gzip压缩

在网站设置 → 配置文件中确认已开启Gzip压缩。

### 3. 静态资源缓存

配置浏览器缓存策略，提高静态资源加载速度。

### 4. 数据库优化

定期在phpMyAdmin中：
- 优化数据库表
- 清理无用数据
- 检查索引使用情况

## 🔄 维护管理

### 1. 定期备份

在宝塔面板 → 计划任务中设置：
- **网站备份**: 每周备份网站文件
- **数据库备份**: 每天备份数据库
- **日志清理**: 定期清理旧日志文件

### 2. 监控设置

开启以下监控：
- 服务器资源监控
- 网站可用性监控
- 数据库性能监控

### 3. 更新维护

定期检查并更新：
- 宝塔面板版本
- PHP版本和扩展
- 系统安全补丁
- 项目代码更新

## 🚨 故障排除

### 常见问题

#### 1. 安装页面无法访问
- 检查域名解析是否正确
- 确认网站配置是否正确
- 检查防火墙设置

#### 2. 数据库连接失败
- 验证数据库信息是否正确
- 检查数据库服务是否运行
- 确认数据库用户权限

#### 3. 文件上传失败
- 检查uploads目录权限
- 确认PHP上传限制设置
- 查看PHP错误日志

#### 4. 页面显示异常
- 检查PHP错误日志
- 确认所有PHP扩展已安装
- 验证文件权限设置

### 日志文件位置

- **PHP错误日志**: `/www/wwwlogs/php_errors.log`
- **Nginx访问日志**: `/www/wwwlogs/access.log`
- **Nginx错误日志**: `/www/wwwlogs/error.log`
- **系统日志**: `/www/wwwroot/your-domain.com/logs/`

### 联系支持

如遇到无法解决的问题，请：
1. 收集相关错误日志
2. 记录问题复现步骤
3. 联系技术支持

## 📝 部署检查清单

安装完成后，请检查以下项目：

- [ ] 网站可正常访问
- [ ] SSL证书已配置
- [ ] 管理员账户可正常登录
- [ ] 文件上传功能正常
- [ ] 分享功能正常
- [ ] 邮件发送功能正常（如已配置）
- [ ] 定时任务已设置
- [ ] 备份策略已配置
- [ ] 监控已开启

完成以上检查后，您的经典云网盘系统就可以正式投入使用了！
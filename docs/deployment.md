# 经典云部署指南

## 目录
- [系统要求](#系统要求)
- [环境准备](#环境准备)
- [安装部署](#安装部署)
- [配置说明](#配置说明)
- [性能优化](#性能优化)
- [安全加固](#安全加固)
- [监控维护](#监控维护)

## 系统要求

### 最低配置
- **CPU**: 1核心
- **内存**: 512MB RAM
- **存储**: 10GB 可用空间
- **网络**: 10Mbps 带宽

### 推荐配置
- **CPU**: 2核心以上
- **内存**: 2GB+ RAM
- **存储**: 50GB+ SSD
- **网络**: 100Mbps+ 带宽

### 软件要求
- **操作系统**: Linux (CentOS 7+, Ubuntu 18.04+)
- **Web服务器**: Apache 2.4+ 或 Nginx 1.18+
- **PHP**: 7.4+ (推荐 8.0+)
- **数据库**: MySQL 5.7+ 或 MariaDB 10.3+

## 环境准备

### CentOS/RHEL 环境

```bash
# 更新系统
sudo yum update -y

# 安装EPEL源
sudo yum install epel-release -y

# 安装基础软件
sudo yum install wget curl git unzip -y

# 安装Apache
sudo yum install httpd -y
sudo systemctl enable httpd
sudo systemctl start httpd

# 安装PHP 8.0
sudo yum install php80 php80-php-fpm php80-php-mysql php80-php-gd php80-php-mbstring php80-php-curl php80-php-json -y

# 安装MySQL 8.0
sudo yum install mysql80-server -y
sudo systemctl enable mysqld
sudo systemctl start mysqld
```

### Ubuntu/Debian 环境

```bash
# 更新包列表
sudo apt update && sudo apt upgrade -y

# 安装基础软件
sudo apt install wget curl git unzip -y

# 安装Apache
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl start apache2

# 安装PHP 8.0
sudo apt install php8.0 php8.0-fpm php8.0-mysql php8.0-gd php8.0-mbstring php8.0-curl php8.0-json -y

# 安装MySQL
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
```

## 安装部署

### 1. 准备项目目录

```bash
# 创建项目目录
sudo mkdir -p /var/www/classic-cloud
cd /var/www/classic-cloud

# 从现有项目复制文件（不使用git clone避免上传源码）
# 手动上传项目文件到服务器

# 设置权限
sudo chown -R www-data:www-data /var/www/classic-cloud
sudo chmod -R 755 /var/www/classic-cloud
sudo chmod -R 777 /var/www/classic-cloud/uploads
sudo chmod -R 777 /var/www/classic-cloud/cache
sudo chmod -R 777 /var/www/classic-cloud/logs
```

### 2. 配置数据库

```bash
# 登录MySQL
sudo mysql -u root -p

# 创建数据库和用户
CREATE DATABASE classic_cloud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'classic_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON classic_cloud.* TO 'classic_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入数据库结构
mysql -u classic_user -p classic_cloud < install/sql/database.sql
```

### 3. 配置Web服务器

#### Apache 配置

```apache
# /etc/apache2/sites-available/classic-cloud.conf
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/classic-cloud
    
    <Directory /var/www/classic-cloud>
        AllowOverride All
        Require all granted
    </Directory>
    
    # 安全设置
    <Directory /var/www/classic-cloud/config>
        Require all denied
    </Directory>
    
    <Directory /var/www/classic-cloud/logs>
        Require all denied
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/classic-cloud_error.log
    CustomLog ${APACHE_LOG_DIR}/classic-cloud_access.log combined
</VirtualHost>
```

```bash
# 启用站点和模块
sudo a2ensite classic-cloud.conf
sudo a2enmod rewrite
sudo systemctl reload apache2
```

#### Nginx 配置

```nginx
# /etc/nginx/sites-available/classic-cloud
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/classic-cloud;
    index index.php index.html;
    
    # 安全设置
    location ~ ^/(config|logs)/ {
        deny all;
        return 403;
    }
    
    # PHP处理
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # URL重写
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 配置说明

### 应用配置

创建配置文件：

**config/app.php**:
```php
<?php
return [
    'app_name' => '经典云',
    'app_url' => 'https://your-domain.com',
    'debug' => false,
    'timezone' => 'Asia/Shanghai',
    'max_file_size' => 100 * 1024 * 1024, // 100MB
    'allowed_extensions' => ['jpg', 'png', 'pdf', 'doc', 'zip'],
];
```

**config/database.php**:
```php
<?php
return [
    'host' => 'localhost',
    'database' => 'classic_cloud',
    'username' => 'classic_user',
    'password' => 'your_strong_password',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];
```

## 性能优化

### 1. PHP优化

```ini
# php.ini 优化设置
memory_limit = 256M
max_execution_time = 300
upload_max_filesize = 100M
post_max_size = 100M
max_file_uploads = 20

# OPcache设置
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
```

### 2. MySQL优化

```ini
# my.cnf 优化设置
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
query_cache_size = 64M
query_cache_type = 1
```

### 3. 缓存配置

```bash
# 安装Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## 安全加固

### 1. 文件权限

```bash
# 设置安全的文件权限
sudo chmod 644 /var/www/classic-cloud/config/*.php
sudo chmod 600 /var/www/classic-cloud/config/database.php
sudo chown root:root /var/www/classic-cloud/config/
```

### 2. 防火墙配置

```bash
# UFW防火墙设置
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3306/tcp
```

### 3. SSL证书

```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d your-domain.com

# 自动续期
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 监控维护

### 1. 日志监控

```bash
# 设置日志轮转
sudo nano /etc/logrotate.d/classic-cloud

/var/www/classic-cloud/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 2. 系统监控

```bash
# 安装监控工具
sudo apt install htop iotop nethogs -y

# 设置系统监控脚本
sudo nano /usr/local/bin/system-monitor.sh
```

### 3. 自动备份

```bash
# 数据库备份脚本
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u classic_user -p'password' classic_cloud > $BACKUP_DIR/classic_cloud_$DATE.sql
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

# 添加到crontab
echo "0 2 * * * /usr/local/bin/backup-db.sh" | sudo crontab -
```

## 故障排除

### 常见问题

1. **文件上传失败**
   - 检查PHP配置限制
   - 验证目录权限
   - 查看错误日志

2. **数据库连接失败**
   - 验证数据库配置
   - 检查用户权限
   - 确认服务状态

3. **页面访问404**
   - 检查URL重写规则
   - 验证虚拟主机配置
   - 确认文件路径

### 日志查看

```bash
# Apache日志
sudo tail -f /var/log/apache2/classic-cloud_error.log

# PHP错误日志
sudo tail -f /var/log/php8.0-fpm.log

# 应用日志
sudo tail -f /var/www/classic-cloud/logs/app.log
```

---

部署完成后，请访问 `https://your-domain.com` 验证系统正常运行。
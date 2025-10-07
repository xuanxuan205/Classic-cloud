# 安全文件删除系统使用指南

## 概述

为了解决您提到的问题，我们开发了一套完整的安全文件删除系统，确保：

1. **防止误删分享文件**：系统会自动检查文件是否有活跃的分享链接
2. **数据一致性**：确保数据库记录与物理文件的一致性
3. **用户友好**：提供清晰的界面显示文件状态和删除风险

## 核心功能

### 1. 安全删除检查器 (`safe_file_deletion_checker.php`)

**主要功能：**
- 检查文件是否有活跃的分享链接
- 批量检查文件删除安全性
- 自动清理可安全删除的过期文件
- 生成详细的删除报告

**使用方法：**
```bash
# 直接运行脚本进行检查
php safe_file_deletion_checker.php

# 或在代码中使用
$checker = new SafeFileDeletionChecker();
$result = $checker->canSafelyDelete($fileId);
```

### 2. 增强版文件管理器 (`includes/class.filemanager.enhanced.php`)

**新增功能：**
- `safeDeleteFile()` - 安全软删除，检查分享状态
- `permanentDeleteFileEnhanced()` - 增强版永久删除，多重安全检查
- `getUserTrashFilesWithShareStatus()` - 获取带分享状态的回收站文件
- `smartCleanTrash()` - 智能清理回收站

### 3. 回收站管理界面 (`pages/trash_manager.php`)

**界面特点：**
- 直观显示文件状态（可删除/受保护）
- 实时统计信息
- 批量操作支持
- 智能清理功能

## 文件状态说明

### 🟢 可删除文件
- 没有活跃的分享链接
- 可以安全永久删除
- 显示绿色边框

### 🔴 受保护文件
- 有活跃的分享链接
- 无法删除，防止影响用户下载
- 显示红色边框和分享信息

## 使用流程

### 1. 查看回收站状态
访问 `pages/trash_manager.php` 查看：
- 总文件数和占用空间
- 可删除文件数量和可释放空间
- 受保护文件数量和原因

### 2. 安全删除操作
- **单个删除**：点击文件旁的删除按钮
- **批量删除**：选择多个文件后点击"批量删除"
- **智能清理**：自动清理超过指定天数的可删除文件

### 3. 处理受保护文件
如果文件有活跃分享：
1. 先到分享管理页面取消分享
2. 等待分享过期
3. 再进行删除操作

## 安全机制

### 1. 多重检查
- 检查文件所有权
- 检查活跃分享链接
- 检查最近下载活动
- 事务保护数据一致性

### 2. 分享状态检查
```sql
-- 检查活跃分享的SQL逻辑
SELECT COUNT(*) as active_shares 
FROM shares 
WHERE file_id = ? AND status = 1 
AND (expire_time IS NULL OR expire_time > NOW())
```

### 3. 智能清理规则
- 只删除没有活跃分享的文件
- 可设置清理天数（默认30天）
- 保留有分享链接的文件

## API接口

### 检查文件是否可删除
```php
$checker = new SafeFileDeletionChecker();
$result = $checker->canSafelyDelete($fileId);

// 返回格式
[
    'can_delete' => true/false,
    'reason' => '原因说明',
    'active_shares' => 分享数量,
    'share_codes' => ['分享码1', '分享码2'],
    'file_info' => 文件信息
]
```

### 批量安全删除
```php
$fileManager = new EnhancedFileManager($db, $config);
$result = $fileManager->batchPermanentDeleteEnhanced($fileIds, $userId);

// 返回格式
[
    'success_count' => 成功数量,
    'failed_count' => 失败数量,
    'protected_count' => 受保护数量,
    'details' => [详细结果]
]
```

## 配置选项

### 智能清理设置
```php
// 清理超过30天的文件
$result = $fileManager->smartCleanTrash($userId, 30);

// 强制清理（管理员功能）
$result = $fileManager->smartCleanTrash($userId, 30, true);
```

### 安全检查参数
- `$days` - 清理天数阈值
- `$forceClean` - 是否强制清理（忽略分享状态）
- `$maxAttempts` - 最大尝试次数
- `$timeWindow` - 时间窗口（秒）

## 故障排除

### 1. 文件删除失败
**可能原因：**
- 文件有活跃分享链接
- 文件不存在或无权限
- 物理文件删除失败

**解决方法：**
- 检查分享状态
- 确认文件权限
- 检查磁盘空间和权限

### 2. 数据不一致
**检查方法：**
```php
// 运行孤儿文件清理
$fileManager = new FileManager($db, $config);
$result = $fileManager->cleanOrphanFiles();
```

### 3. 分享链接检查异常
**检查数据库表结构：**
```sql
-- 确保shares表存在必要字段
DESCRIBE shares;

-- 检查分享状态
SELECT * FROM shares WHERE status = 1 AND expire_time > NOW();
```

## 最佳实践

### 1. 定期维护
- 每周运行智能清理
- 定期检查孤儿文件
- 监控存储空间使用

### 2. 用户教育
- 提醒用户删除前取消分享
- 说明受保护文件的原因
- 提供清晰的操作指引

### 3. 备份策略
- 重要文件删除前备份
- 保留操作日志
- 定期数据库备份

## 技术支持

如果遇到问题，请检查：
1. 数据库连接是否正常
2. 文件权限是否正确
3. 相关表结构是否完整
4. PHP错误日志

系统会自动记录详细的错误信息，便于问题诊断和解决。
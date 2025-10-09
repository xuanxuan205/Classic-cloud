# 贡献指南 (Contributing Guide)

感谢您对经典云项目的关注！我们欢迎所有形式的贡献，包括但不限于代码贡献、文档改进、问题报告和功能建议。

## 📋 目录

- [贡献方式](#贡献方式)
- [开发环境搭建](#开发环境搭建)
- [代码规范](#代码规范)
- [提交流程](#提交流程)
- [问题报告](#问题报告)
- [功能请求](#功能请求)
- [代码审查](#代码审查)

## 🤝 贡献方式

### 代码贡献
- 修复Bug
- 新增功能
- 性能优化
- 代码重构

### 文档贡献
- 完善文档
- 翻译文档
- 添加示例
- 修正错误

### 其他贡献
- 报告问题
- 提出建议
- 测试功能
- 推广项目

## 🛠️ 开发环境搭建

### 1. Fork 项目

点击项目页面右上角的 "Fork" 按钮，将项目 Fork 到您的GitHub账户。

### 2. 克隆项目

```bash
# 注意：请不要直接推送到主仓库
git clone https://github.com/YOUR_USERNAME/Classic-cloud.git
cd Classic-cloud
```

### 3. 添加上游仓库

```bash
git remote add upstream https://github.com/xuanxuan205/Classic-cloud.git
```

### 4. 环境配置

参考 [开发文档](docs/development.md) 配置本地开发环境。

## 📝 代码规范

### PHP 代码规范

遵循 **PSR-12** 编码标准：

```php
<?php

declare(strict_types=1);

namespace ClassicCloud\Core;

/**
 * 文件管理器类
 */
class FileManager
{
    private string $uploadPath;
    
    public function __construct(string $uploadPath)
    {
        $this->uploadPath = $uploadPath;
    }
    
    /**
     * 上传文件
     *
     * @param array $file 文件信息
     * @return array 上传结果
     * @throws FileUploadException
     */
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

### JavaScript 代码规范

使用 **ESLint** 和 **Prettier** 保持代码一致性：

```javascript
/**
 * 文件上传处理
 * @param {File} file - 要上传的文件
 * @param {string} path - 上传路径
 * @returns {Promise<Object>} 上传结果
 */
async function uploadFile(file, path = '/') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    
    try {
        const response = await fetch('/api/v1/files/upload', {
            method: 'POST',
            body: formData,
        });
        
        return await response.json();
    } catch (error) {
        console.error('上传失败:', error);
        throw error;
    }
}
```

### CSS 代码规范

使用 **BEM** 命名规范：

```css
/* 组件块 */
.file-manager {
    display: flex;
    flex-direction: column;
}

/* 元素 */
.file-manager__header {
    padding: 1rem;
    border-bottom: 1px solid #e1e5e9;
}

.file-manager__content {
    flex: 1;
    overflow-y: auto;
}

/* 修饰符 */
.file-manager__item--selected {
    background-color: #007bff;
    color: white;
}
```

## 🔄 提交流程

### 1. 创建功能分支

```bash
# 同步上游代码
git fetch upstream
git checkout main
git merge upstream/main

# 创建功能分支
git checkout -b feature/your-feature-name
```

### 2. 开发和测试

- 编写代码
- 添加测试
- 运行测试确保通过
- 更新相关文档

### 3. 提交代码

```bash
# 添加文件
git add .

# 提交代码（使用有意义的提交信息）
git commit -m "feat: 添加文件批量上传功能

- 支持多文件选择
- 添加上传进度显示
- 优化错误处理机制

Closes #123"
```

### 4. 推送分支

```bash
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

1. 访问您的 Fork 仓库页面
2. 点击 "New Pull Request"
3. 选择目标分支（通常是 `main`）
4. 填写详细的PR描述
5. 提交PR等待审查

## 🐛 问题报告

### 报告Bug

使用 [Issue模板](https://github.com/xuanxuan205/Classic-cloud/issues/new?template=bug_report.md) 报告问题：

**必须包含的信息：**
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 系统环境
- 错误日志

**示例：**
```markdown
## 问题描述
文件上传时出现500错误

## 复现步骤
1. 登录系统
2. 点击上传按钮
3. 选择大于10MB的文件
4. 点击确认上传

## 预期行为
文件正常上传成功

## 实际行为
显示"服务器内部错误"

## 系统环境
- 操作系统: Ubuntu 20.04
- PHP版本: 8.0.15
- 浏览器: Chrome 96.0.4664.110

## 错误日志
```
[error] PHP Fatal error: Allowed memory size exhausted
```

### 安全漏洞报告

如果发现安全漏洞，请**不要**在公开issue中报告，而是发送邮件至：
📧 **security@example.com**

## 💡 功能请求

使用 [功能请求模板](https://github.com/xuanxuan205/Classic-cloud/issues/new?template=feature_request.md)：

**必须包含的信息：**
- 功能描述
- 使用场景
- 预期收益
- 实现建议

## 👀 代码审查

### 审查要点

**功能性**
- 功能是否正确实现
- 是否有边界情况考虑
- 错误处理是否完善

**代码质量**
- 代码是否清晰易读
- 是否遵循项目规范
- 是否有适当的注释

**性能**
- 是否有性能问题
- 数据库查询是否优化
- 缓存策略是否合理

**安全性**
- 输入验证是否充分
- 是否有SQL注入风险
- 权限控制是否正确

### 审查反馈

**给出建设性反馈：**
```markdown
建议使用预处理语句防止SQL注入：

```php
// 不推荐
$sql = "SELECT * FROM users WHERE id = " . $userId;

// 推荐
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);
```

**积极回应反馈：**
- 认真考虑审查意见
- 及时回复和修改
- 保持友好沟通

## 📊 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

- **feat**: 新功能
- **fix**: Bug修复
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 示例

```
feat(upload): 添加文件批量上传功能

- 支持多文件选择和拖拽上传
- 添加上传进度条显示
- 优化大文件上传性能
- 增加文件类型验证

Closes #123
Fixes #456
```

## 🏆 贡献者认可

我们会在以下方式认可贡献者：

- **README.md** 中的贡献者列表
- **发布说明** 中提及贡献者
- **特别感谢** 页面展示
- **贡献徽章** 奖励

## 📞 联系我们

如有任何问题，欢迎通过以下方式联系：

- **GitHub Issues**: [提交问题](https://github.com/xuanxuan205/Classic-cloud/issues)
- **邮箱**: [jyd9527@zohomail.cn](mailto:jyd9527@zohomail.cn)
- **官网**: [https://gta5fuzhup.cn](https://gta5fuzhup.cn)

## 📄 许可协议

通过贡献代码，您同意您的贡献将在 [MIT许可协议](LICENSE) 下发布。

---

**再次感谢您的贡献！让我们一起让经典云变得更好！** 🚀
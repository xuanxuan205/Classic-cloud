# 经典云 (Classic Cloud)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/Demo-在线演示-blue)](https://xuanxuan205.github.io/Classic-cloud/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://xuanxuan205.github.io/Classic-cloud/)
[![Issues](https://img.shields.io/github/issues/xuanxuan205/Classic-cloud)](https://github.com/xuanxuan205/Classic-cloud/issues)
[![Stars](https://img.shields.io/github/stars/xuanxuan205/Classic-cloud)](https://github.com/xuanxuan205/Classic-cloud/stargazers)

> 🚀 专业的云端文件管理系统 - 安全、高效、易用

## 🎬 在线演示

- **🌐 项目演示**: [https://xuanxuan205.github.io/Classic-cloud/](https://xuanxuan205.github.io/Classic-cloud/)
- **📱 移动端体验**: 支持响应式设计，手机端完美适配
- **🔧 管理后台**: 完整的后台管理功能展示
- **🏠 官方网站**: [https://gta5fuzhup.cn](https://gta5fuzhup.cn)

> 💡 **提示**: 演示环境为只读模式，如需完整体验请本地部署

## 📋 项目简介

经典云是一个基于现代Web技术构建的企业级云端文件管理系统，提供安全可靠的文件存储、管理和分享功能。系统采用模块化架构设计，支持多用户管理、权限控制，以及丰富的API接口。

### ✨ 核心特性

- 🔐 **安全可靠** - 多层次安全防护，数据加密存储
- 📁 **文件管理** - 支持多格式文件上传、下载、预览
- 👥 **多用户系统** - 完善的用户权限管理机制
- 🎨 **响应式设计** - 适配各种设备和屏幕尺寸
- 🔌 **API接口** - RESTful API，支持第三方集成
- ⚡ **高性能** - 优化的缓存策略和数据库查询
- 🛠️ **可扩展** - 模块化架构，易于功能扩展

## 🏗️ 系统架构

经典云采用模块化架构设计，主要包含以下核心模块：

### 📦 系统模块
- **用户认证系统** - 登录验证、会话管理、多级权限控制
- **数据库操作层** - PDO封装、预处理语句、安全事务管理
- **文件管理引擎** - 文件上传下载、目录管理、批量操作
- **安全防护中心** - XSS过滤、CSRF防护、输入验证、访问控制
- **分享系统** - 安全分享、链接管理、权限验证
- **管理控制台** - 系统监控、用户管理、数据统计
- **API接口服务** - RESTful接口、文件操作、系统集成

### 🛠️ 技术架构
- **后端语言**: PHP 7.4+ (面向对象设计)
- **数据库**: MySQL 5.7+ / MariaDB 10.3+ (PDO封装)
- **前端技术**: HTML5 + CSS3 + JavaScript (响应式设计)
- **Web服务器**: Apache 2.4+ / Nginx 1.18+ (支持URL重写)
- **安全防护**: .htaccess配置 + XSS/CSRF防护 + SQL注入防护
- **架构模式**: MVC模式 + 模块化设计

## 🚀 快速开始

### 环境要求

- **PHP**: 7.4+ (推荐 8.0+)，需要PDO、GD、mbstring扩展
- **数据库**: MySQL 5.7+ 或 MariaDB 10.3+
- **Web服务器**: Apache 2.4+ (mod_rewrite) 或 Nginx 1.18+
- **存储空间**: 最少1GB可用空间
- **内存**: 建议512MB+

### 快速部署

> 💡 **安全提示**: 详细的安装配置步骤请联系管理员获取，以确保系统安全。

#### 基本要求
1. **环境准备** - 配置PHP + MySQL + Web服务器环境
2. **权限设置** - 设置适当的文件和目录权限
3. **数据库初始化** - 创建数据库和导入数据结构
4. **系统配置** - 配置数据库连接和系统参数
5. **功能测试** - 验证系统功能是否正常

#### 获取完整部署指南
- 📧 **技术支持**: [jyd9527@zohomail.cn](mailto:jyd9527@zohomail.cn)
- 🌐 **官方网站**: [https://gta5fuzhup.cn](https://gta5fuzhup.cn)
- 📖 **部署文档**: [查看详细部署指南](docs/deployment.md)

#### 系统访问
- **用户端**: 通过浏览器访问主页面
- **管理端**: 通过管理员入口进入后台
- **API接口**: 支持RESTful API集成

## 📚 文档说明

- [📖 用户手册](docs/user-guide.md) - 系统使用指南
- [🔧 开发文档](docs/development.md) - 开发者指南
- [⚙️ 部署指南](docs/deployment.md) - 生产环境部署
- [🔌 API文档](docs/api.md) - 接口说明文档

## 🤝 参与贡献

我们欢迎所有形式的贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范

- 遵循PSR编码规范
- 编写单元测试
- 更新相关文档
- 确保代码质量

## 🐛 问题反馈

遇到问题？请通过以下方式联系我们：

- **GitHub Issues**: [提交问题](https://github.com/xuanxuan205/Classic-cloud/issues)
- **邮箱支持**: [jyd9527@zohomail.cn](mailto:jyd9527@zohomail.cn)
- **官方网站**: [https://gta5fuzhup.cn](https://gta5fuzhup.cn)

## 📄 许可协议

本项目采用 [MIT 许可协议](LICENSE) - 查看 [LICENSE](LICENSE) 文件了解详情。

### 许可证说明

- ✅ 商业使用
- ✅ 修改
- ✅ 分发
- ✅ 私人使用
- ❗ 责任限制
- ❗ 无担保

## 💖 支持作者

如果这个项目对您有帮助，欢迎支持作者继续开发和维护！

### 💰 赞助方式

<div align="center">

| 微信支付 | 支付宝 |
|---------|--------|
| <img src="https://raw.githubusercontent.com/xuanxuan205/Classic-cloud/main/images/wechat_qr_3.png" width="200" alt="微信收款码"> | <img src="https://raw.githubusercontent.com/xuanxuan205/Classic-cloud/main/images/alipay_qr_3.png" width="200" alt="支付宝收款码"> |

</div>

### 其他支持方式
- ⭐ 给项目点个Star
- 🐛 报告Bug和问题
- 💡 提出功能建议
- 📢 推荐给朋友使用
- 📝 完善项目文档

## 🙏 致谢

感谢所有为经典云项目做出贡献的开发者和用户！

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

[🌟 Star](https://github.com/xuanxuan205/Classic-cloud) | [🐛 Report Bug](https://github.com/xuanxuan205/Classic-cloud/issues) | [💡 Request Feature](https://github.com/xuanxuan205/Classic-cloud/issues)

**经典云 - 让文件管理更简单！**

</div>
# 经典云 (Classic Cloud)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://gta5fuzhup.cn)
[![Issues](https://img.shields.io/github/issues/xuanxuan205/Classic-cloud)](https://github.com/xuanxuan205/Classic-cloud/issues)
[![Stars](https://img.shields.io/github/stars/xuanxuan205/Classic-cloud)](https://github.com/xuanxuan205/Classic-cloud/stargazers)

> 🚀 专业的云端文件管理系统 - 安全、高效、易用

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

```
经典云/
├── admin/          # 管理后台模块
│   ├── api/        # 管理API接口
│   ├── assets/     # 管理端静态资源
│   └── pages/      # 管理页面
├── api/            # 核心API接口
├── assets/         # 前端静态资源
│   ├── css/        # 样式文件
│   ├── images/     # 图片资源
│   └── js/         # JavaScript文件
├── cache/          # 缓存目录
├── config/         # 配置文件
├── cron/           # 定时任务
├── docs/           # 项目文档
├── includes/       # 公共包含文件
├── install/        # 安装程序
├── logs/           # 日志文件
├── pages/          # 前端页面
└── uploads/        # 文件上传目录
```

## 🚀 快速开始

### 环境要求

- PHP >= 7.4
- MySQL >= 5.7
- Apache/Nginx Web服务器
- 支持URL重写

### 安装步骤

1. **克隆项目**
   ```bash
   git clone git@github.com:xuanxuan205/Classic-cloud.git
   cd Classic-cloud
   ```

2. **配置Web服务器**
   - 将项目部署到Web服务器根目录
   - 确保 `uploads/` 和 `cache/` 目录可写

3. **数据库配置**
   - 创建MySQL数据库
   - 导入 `install/sql/` 目录下的数据库文件

4. **系统配置**
   - 复制配置模板并修改数据库连接信息
   - 运行安装程序完成初始化

5. **访问系统**
   - 前台访问：`https://your-domain.com`
   - 管理后台：`https://your-domain.com/admin`

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

## 🙏 致谢

感谢所有为经典云项目做出贡献的开发者和用户！

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

[🌟 Star](https://github.com/xuanxuan205/Classic-cloud) | [🐛 Report Bug](https://github.com/xuanxuan205/Classic-cloud/issues) | [💡 Request Feature](https://github.com/xuanxuan205/Classic-cloud/issues)

**经典云 - 让文件管理更简单！**

</div>
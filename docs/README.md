# 经典云网盘 - 部署文档

## 项目概述

这是经典云网盘的GitHub Pages部署版本，提供了一个完整的静态前端展示页面。

## 在线访问

- **GitHub Pages**: https://xuanxuan205.github.io/Classic-cloud/
- **自定义域名**: https://gta5fuzhup.cn

## 功能特性

### 当前版本功能
- ✅ 响应式主页设计
- ✅ 功能特色展示
- ✅ 用户登录/注册界面
- ✅ 关于我们页面
- ✅ 联系信息展示
- ✅ 移动端适配

### 计划功能
- 🔄 后端API集成
- 🔄 文件管理界面
- 🔄 用户仪表板
- 🔄 文件分享功能

## 技术架构

### 前端技术栈
- **HTML5**: 语义化标记
- **CSS3**: 现代样式和动画
- **JavaScript**: 原生ES6+
- **Material Design**: 设计语言
- **响应式设计**: 支持所有设备

### 部署方式
- **GitHub Pages**: 静态网站托管
- **自定义域名**: DNS解析配置
- **CDN加速**: 全球访问优化

## 本地开发

### 环境要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地HTTP服务器（可选）

### 快速开始

1. **克隆项目**
```bash
git clone https://github.com/xuanxuan205/Classic-cloud.git
cd Classic-cloud
```

2. **本地预览**
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用PHP
php -S localhost:8000
```

3. **访问网站**
打开浏览器访问 `http://localhost:8000`

## 部署指南

### GitHub Pages部署

1. **推送代码到GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **启用GitHub Pages**
- 进入仓库设置页面
- 找到"Pages"选项
- 选择"Deploy from a branch"
- 选择"main"分支
- 点击"Save"

3. **配置自定义域名**
- 在仓库根目录创建`CNAME`文件
- 文件内容为您的域名：`gta5fuzhup.cn`
- 在DNS服务商添加CNAME记录指向`xuanxuan205.github.io`

### 域名配置

#### DNS设置
```
类型: CNAME
名称: @（或www）
值: xuanxuan205.github.io
TTL: 600
```

#### SSL证书
GitHub Pages自动提供Let's Encrypt SSL证书，确保HTTPS访问。

## 文件结构

```
Classic-cloud/
├── index.html              # 主页面
├── assets/                 # 静态资源
│   ├── css/
│   │   ├── style.css      # 主样式文件
│   │   └── toast.css      # 通知样式
│   ├── js/
│   │   └── main.js        # 主JavaScript文件
│   └── images/
│       └── favicon.png    # 网站图标
├── docs/                   # 文档目录
│   └── README.md          # 部署文档
├── .gitignore             # Git忽略文件
├── CNAME                  # 自定义域名配置
└── README.md              # 项目说明
```

## 自定义配置

### 修改网站信息

1. **网站标题和描述**
编辑`index.html`中的`<title>`和`<meta>`标签

2. **联系信息**
修改联系我们部分的邮箱和其他信息

3. **样式定制**
编辑`assets/css/style.css`文件

### 添加新页面

1. 创建新的HTML文件
2. 在导航菜单中添加链接
3. 更新CSS和JavaScript文件

## 性能优化

### 已实施的优化
- ✅ CSS和JS文件压缩
- ✅ 图片优化
- ✅ 响应式图片
- ✅ 字体优化
- ✅ 缓存策略

### 建议的优化
- 🔄 使用CDN加速
- 🔄 启用Gzip压缩
- 🔄 图片懒加载
- 🔄 Service Worker缓存

## 安全考虑

### 当前安全措施
- ✅ HTTPS强制访问
- ✅ 内容安全策略
- ✅ XSS防护
- ✅ 输入验证

### 注意事项
- 不包含敏感信息
- 不暴露API密钥
- 定期更新依赖

## 监控和分析

### Google Analytics
可以添加Google Analytics代码进行访问统计：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 其他分析工具
- Baidu Analytics（百度统计）
- Umami Analytics
- Plausible Analytics

## 故障排除

### 常见问题

1. **页面无法访问**
   - 检查DNS解析是否正确
   - 确认GitHub Pages是否启用
   - 验证CNAME文件配置

2. **样式不显示**
   - 检查CSS文件路径
   - 确认文件是否正确上传
   - 清除浏览器缓存

3. **JavaScript不工作**
   - 检查控制台错误信息
   - 验证文件路径和语法
   - 确认浏览器兼容性

### 调试方法
- 使用浏览器开发者工具
- 检查网络请求状态
- 查看控制台错误信息

## 更新和维护

### 定期维护
- 更新依赖库版本
- 检查链接有效性
- 优化页面性能
- 备份重要数据

### 版本控制
使用Git进行版本管理，建议的工作流程：

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交更改
git add .
git commit -m "Add new feature"

# 推送到远程
git push origin feature/new-feature

# 创建Pull Request
# 合并到main分支后自动部署
```

## 支持和反馈

### 获取帮助
- **GitHub Issues**: 报告问题和建议
- **邮箱支持**: lyd9527@zohomail.cn
- **文档**: 查看项目文档

### 贡献指南
欢迎提交问题报告和功能建议！

1. Fork本项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

---

**经典云网盘** - 让文件管理更简单、更安全！
# 开发工具箱

面向开发者的在线工具集平台，提供常用的数据格式化、转义、处理等功能。

## 技术栈

- **前端框架**: Vue 3 (Composition API + TypeScript)
- **UI 组件库**: Naive UI
- **路由管理**: Vue Router
- **构建工具**: Vite
- **工具库**: @vueuse/core
- **图标库**: @vicons/ionicons5, @vicons/carbon

## 功能特性

### 已实现
- ✅ 完整的应用架构（Header、Sidebar、Footer、BackToTop）
- ✅ 主题切换（亮色/暗色模式，支持跟随系统）
- ✅ 响应式 Flex 布局（移动端、平板、桌面端适配）
- ✅ 路由系统和 404 页面
- ✅ 服务层架构（主题、剪贴板、存储、滚动）
- ✅ Composables 封装（useTheme、useClipboard、useScroll）

### 计划中
- 🔲 JSON 压缩工具
- 🔲 JSON 格式化工具
- 🔲 JSON 转义/反转义工具
- 🔲 JSON 解析序列化工具
- 🔲 SQL 数据填充工具（支持 Long 类型标注）

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 项目结构

```
src/
├── views/                  # 页面视图
├── components/             # 组件
│   ├── layout/            # 布局组件
│   ├── common/            # 通用组件
│   └── tools/             # 工具组件
├── composables/           # 组合式函数
├── utils/                 # 工具函数
├── services/              # 服务层
├── types/                 # 类型定义
├── constants/             # 常量配置
├── router/                # 路由配置
└── styles/                # 样式文件
```

## 设计特点

### 响应式布局
- 采用 Flexbox 弹性布局
- 支持 5 个响应式断点（xs, sm, md, lg, xl）
- 移动优先设计理念

### 主题系统
- 支持亮色/暗色/自动三种主题模式
- 主题偏好持久化到本地存储
- 平滑的主题切换动画

### 数据安全
- 所有数据处理均在浏览器本地完成
- 不上传到服务器
- 支持本地存储和自动过期清理

## 开发计划

根据设计文档，项目分为四个阶段：

### 阶段一：基础架构搭建 ✅
- [x] 项目初始化
- [x] 依赖安装
- [x] 目录结构创建
- [x] 路由配置
- [x] 布局组件
- [x] 核心服务和 Composables

### 阶段二：核心功能实现
- [ ] JSON 工具集
- [ ] SQL 工具集

### 阶段三：功能完善
- [ ] 剪贴板集成优化
- [ ] 本地存储功能
- [ ] 示例数据和帮助文档
- [ ] 错误处理优化
- [ ] 快捷键支持

### 阶段四：优化与扩展
- [ ] 性能优化
- [ ] 单元测试
- [ ] 工具扩展接口
- [ ] 文档完善

## 许可证

MIT

## 作者

Sora - [GitHub](https://github.com/dunhuixiao)
=======
# DevTools
开发工具
>>>>>>> e20c74b66b3b269bf1aceb03d88c8a11e24bbb1f

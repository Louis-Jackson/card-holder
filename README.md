## 卡套设计（现代化改造）

本项目已升级为 Vite + TypeScript 的多页面前端项目，提供入口与两张卡面：

- 入口：`index.html`（导航页）
- 正面：`front.html`
- 反面：`back.html`

两页均支持在页面中直接编辑内容（contenteditable）并一键导出为包含“高亮修改内容”的独立 HTML 文件。

### 快速开始

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

Vite 会提供开发地址，访问：

- 导航入口：`/`
- 正面页面：`/front.html`
- 反面页面：`/back.html`

3. 构建生产包：

```bash
npm run build
```

4. 本地预览构建产物：

```bash
npm run preview
```

### 目录结构

```
card-holder/
├─ index.html           # 项目入口（导航页）
├─ front.html           # 正面页面入口
├─ back.html            # 反面页面入口
├─ public/              # 静态资源（仍可放置原始素材）
├─ src/
│  ├─ front/main.ts     # 正面页面逻辑（TS 模块化）
│  ├─ back/main.ts      # 反面页面逻辑（TS 模块化）
│  └─ shared/exporter.ts# 通用可编辑追踪与导出逻辑
├─ vite.config.ts       # 多页面构建配置
├─ tsconfig.json        # TS 配置（严格模式）
├─ .eslintrc.cjs        # ESLint（含 TS 插件）
├─ .prettierrc.json     # Prettier 统一风格
├─ .editorconfig        # 编辑器基础规范
└─ package.json
```

### 代码规范

- 采用 TypeScript 严格模式
- ESLint + Prettier 统一格式
- 建议在提交前执行：

```bash
npm run lint && npm run typecheck && npm run build
```

### 关于导出

- 点击页面顶部“导出为 HTML（高亮修改内容）”按钮，会：
  - 克隆当前卡面并为所有已修改的元素添加 `highlight-changes` 类进行高亮；
  - 将内联样式写入导出的 HTML 文件中，确保离线查看与打印一致；
  - 优先使用浏览器文件系统访问 API（若可用），否则回退到传统下载方式。



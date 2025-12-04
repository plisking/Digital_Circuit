# 数字电路仿真平台 (Digital Circuit Simulation)

这是一个基于 Next.js 的数字电路仿真网站，专为《数字与逻辑电路课程 DSR》设计，用于直观展示经典 74LS 系列集成电路的功能与逻辑。

## 🌟 功能特点

- **经典芯片支持**: 包含 74LS148, 74LS138, 74LS151, 74LS163, 74LS90, 74LS194, 4位全加器。
- **交互式仿真**: 点击输入开关改变电平，实时观察输出灯的变化。
- **逻辑图展示**: 清晰展示芯片管脚、输入输出连接。
- **时序控制**: 支持 CP 脉冲和复位功能。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```
   访问 http://localhost:16930

## 部署到云服务器

本项目是一个标准的 Node.js (Next.js) 项目。

1. **构建项目**:
   在服务器上运行:
   ```bash
   npm run build
   ```

2. **启动服务**:
   ```bash
   npm start
   ```
   默认运行在 3000 端口。

3. **使用 PM2 管理 (推荐)**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "digital-circuit" -- start
   ```

## 项目结构

- `app/`: 页面路由与布局
  - `page.tsx`: 主页面逻辑
  - `layout.tsx`: 全局布局与访客计数器集成
- `components/`: React 组件
  - `ChipSimulator.tsx`: 核心仿真器组件，负责渲染芯片与处理交互
  - `VisitorCounter.tsx`: 访客计数器组件
- `lib/`: 核心逻辑
  - `chip-definitions.ts`: 所有芯片的引脚定义、逻辑真值表与状态机实现
  - `visitor-store.ts`: 访客数据存储逻辑
- `public/`: 静态资源 (背景网格等)

## 📝 特殊功能说明

- **74LS90**: 底部设有 `QA->CP1` (8421码) 和 `QD->CP0` (5421码) 开关，用于演示不同进制计数。
- **74LS194**: 顶部设有 `Q3->DSR` 和 `Q0->DSL` 开关，开启后可演示循环移位效果。
- **访客统计**: 包含防刷机制，同一设备 10 分钟内仅记录一次访问。

---
**数字与逻辑电路课程 DSR**

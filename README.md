# 数字电路仿真平台 (Digital Circuit Simulation)

这是一个基于 Next.js 的数字电路仿真网站，用于展示经典集成电路的功能和逻辑。

## 功能特点

- **经典芯片支持**: 包含 74LS148, 74LS138, 74LS151, 74LS163, 74LS90, 74LS194, 4位全加器。
- **交互式仿真**: 点击输入开关改变电平，实时观察输出灯的变化。
- **逻辑图展示**: 清晰展示芯片管脚、输入输出连接。
- **时序控制**: 支持 CP 脉冲和复位功能。

## 本地开发

1. 安装依赖:
   ```bash
   npm install
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

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

- `app/`: 页面和布局逻辑
- `components/`: React 组件 (ChipSimulator)
- `lib/`: 芯片定义和逻辑 (chip-definitions.ts)
- `public/`: 静态资源

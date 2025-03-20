# 学业监测预警系统前端

## 项目介绍
本项目是学业监测预警系统的前端部分，基于Vue 3开发，使用Element Plus作为UI组件库。

## 技术栈
- Vue 3
- Vue Router 4
- Vuex 4
- Element Plus
- Axios

## 功能模块
- 用户认证（登录/注销）
- 用户管理（管理员）
- 学生管理
- 教师管理
- 成绩管理
- 预警管理
- 通知管理
- 个人信息管理
- 课程信息查询
- 学业报告

## 开发环境
- Node.js >= 14.0.0
- npm >= 6.0.0

## 安装与运行
```
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build
```

## 项目结构
```
src/
├── assets/         # 静态资源
├── components/     # 公共组件
├── router/         # 路由配置
├── store/          # 状态管理
├── utils/          # 工具函数
├── views/          # 页面组件
├── App.vue         # 根组件
└── main.js         # 入口文件
```

## 接口文档
后端API基础URL: http://localhost:8080/api

## 开发规范
- 组件命名采用PascalCase
- 文件命名采用kebab-case
- CSS类名采用kebab-case
- 使用ESLint进行代码检查

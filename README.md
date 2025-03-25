# 学业预警系统前端

## 项目概述
这是一个基于 Vue 3 和 Element Plus 的现代化前端应用，用于学业预警系统的用户界面。

## 技术栈
- Vue 3
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios

## 项目结构
```
src/
├── api/          # API 请求
├── assets/       # 静态资源
├── components/   # 公共组件
├── router/       # 路由配置
├── stores/       # 状态管理
└── views/        # 页面组件
    ├── admin/    # 管理员页面
    └── student/  # 学生页面
```

## 功能模块

### 用户认证
- [x] 登录页面
- [x] 用户状态管理
- [x] 路由权限控制

### 学生模块
- [x] 学生布局
- [x] 个人信息页面
- [x] 成绩查询页面
- [x] 预警信息页面

### 管理员模块
- [x] 管理员布局
- [x] 管理员仪表盘
- [x] 学生管理页面
- [x] 预警管理页面
- [ ] 系统设置页面

## 开发环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

## API 配置说明
本项目使用 Vite 的代理功能将前端的 API 请求转发到后端服务器。

- 前端 API 请求地址: `/api/*`
- 后端服务器地址: `http://localhost:8080`
- 代理配置: 直接将前端请求转发到后端，保留 `/api` 前缀

例如：
- 前端请求 `/api/auth/signin`
- 实际转发到 `http://localhost:8080/api/auth/signin`

## 前后端接口对接说明

### 登录接口
- 请求路径: `/api/auth/signin`
- 请求方法: `POST`
- 请求参数:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- 期望的响应格式:
  ```json
  {
    "token": "JWT令牌",
    "user": {
      "id": 1,
      "username": "用户名",
      "name": "用户姓名",
      "roles": ["ROLE_ADMIN"] // 或 ["ROLE_STUDENT"]
    }
  }
  ```

如果后端返回的响应格式与期望不符，可以在前端进行适配。目前前端支持以下几种响应格式：

1. 标准格式：
   ```json
   {
     "data": {
       "token": "JWT令牌",
       "user": { "用户信息对象" }
     }
   }
   ```

2. 直接格式：
   ```json
   {
     "token": "JWT令牌",
     "user": { "用户信息对象" }
   }
   ```

3. Spring Security格式：
   ```json
   {
     "access_token": "JWT令牌",
     "authorities": [{ "authority": "ROLE_ADMIN" }]
   }
   ```

### 用户角色说明
系统支持两种角色：
- `ROLE_ADMIN`: 管理员，登录后跳转到 `/admin` 路径
- `ROLE_STUDENT`: 学生，登录后跳转到 `/student` 路径

## 后端 CORS 配置问题
当前后端存在 CORS 配置问题，需要修改 Spring 的 CORS 配置：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            // 不要使用通配符 "*"，而是明确指定允许的源
            .allowedOrigins("http://localhost:5173")
            // 或者使用 allowedOriginPatterns
            // .allowedOriginPatterns("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

另外，在 `application.properties` 中如果有 CORS 配置，也需要进行修改：

```properties
# 替换
spring.mvc.cors.allowed-origins=*

# 改为
spring.mvc.cors.allowed-origins=http://localhost:5173
# 或者不设置 allowed-origins，而是使用 allowed-origin-patterns
spring.mvc.cors.allowed-origin-patterns=*
```

## 注意事项
1. 确保后端 API 服务已经启动
2. 在 `.env` 文件中配置正确的 API 地址
3. 开发时请遵循项目的代码规范

## 最新开发进度
- 完成学生模块的全部页面（个人信息、成绩查询、预警信息）
- 完成管理员模块的主要页面（仪表盘、学生管理、预警管理）
- 下一步计划：
  - 实现管理员系统设置页面
  - 整合后端 API 接口
  - 完善表单验证和数据处理
  - 添加数据可视化图表

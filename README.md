# 学业预警系统前端

## 最近系统优化
```
- 修复了ElTag组件type属性验证失败问题
  - 将预警类型"SEVERE"对应的tag类型从"error"改为"danger"
  - Element Plus的ElTag组件只支持["primary", "success", "info", "warning", "danger"]这几种类型
  - 修改了WarningsView.vue和WarningInfo.vue中的相关代码

- 完善了管理员页面的数据流程与显示
  - 创建了统计数据和预警相关的API接口模块
  - 实现了仪表盘统计数据、图表数据的动态加载
  - 改进了学生管理列表以获取真实数据，支持分页和筛选
  - 优化了预警管理系统，支持查看、创建、编辑和解决预警
  - 所有页面都增加了数据加载状态和错误处理机制
  - 添加了数据刷新功能，确保展示最新信息

- 修复了用户信息获取404问题
  - 将用户信息接口路径修改为`/auth/me`
  - 优化了登录流程和用户信息加载过程
  - 增加了加载状态和错误处理
  - 添加了用户信息缓存机制，减少不必要的API请求

- 修复了API路径重复问题
  - 删除了API接口中重复的`/api`前缀
  - 统一使用`request.js`中的`baseURL`配置
  - 解决了访问`/api/api/xxx`导致的400错误

- 根据后端实际情况调整了API接口
  - 调整了认证接口路径与参数
  - 更新了预警类型与状态的枚举值
  - 适配了后端的分页参数与响应格式
```

## 项目说明
这是一个基于 Vue 3 + Element Plus 的学业预警系统前端项目。

## 技术栈
- Vue 3
- Vue Router
- Pinia
- Element Plus
- Axios
- Vite

## 项目结构
```
src/
├── api/                # API 接口
│   ├── request.js      # Axios 配置
│   ├── user.js         # 用户相关接口
│   ├── student.js      # 学生相关接口
│   ├── teacher.js      # 教师相关接口
│   ├── warnings.js     # 预警相关接口
│   ├── statistics.js   # 统计数据接口
│   └── public.js       # 公共接口
├── assets/            # 静态资源
├── components/        # 公共组件
├── router/           # 路由配置
├── stores/           # 状态管理
├── views/            # 页面组件
│   ├── admin/        # 管理员页面
│   ├── student/      # 学生页面
│   └── teacher/      # 教师页面
└── App.vue           # 根组件
```

## API 接口说明

### 1. 认证相关接口 (/auth)

#### 1.1 用户登录
- 路径: `/auth/signin`
- 方法: POST
- 请求体:
```json
{
    "username": "用户名",
    "password": "密码"
}
```
- 响应:
```json
{
    "token": "JWT令牌",
    "type": "Bearer",
    "id": 用户ID,
    "username": "用户名",
    "email": "邮箱",
    "name": "姓名",
    "roles": ["角色1", "角色2"]
}
```

#### 1.2 用户注册
- 路径: `/auth/signup`
- 方法: POST
- 请求体:
```json
{
    "username": "用户名",
    "email": "邮箱",
    "password": "密码",
    "name": "姓名",
    "phone": "电话",
    "roles": ["student", "teacher", "admin"] // 可选
}
```
- 响应:
```json
{
    "message": "注册成功消息"
}
```

#### 1.3 获取当前用户信息
- 路径: `/auth/me`
- 方法: GET
- 权限: 需要认证
- 响应:
```json
{
    "id": 用户ID,
    "username": "用户名",
    "email": "邮箱",
    "name": "姓名",
    "roles": ["角色1", "角色2"]
}
```

### 2. 统计相关接口 (/statistics)

#### 2.1 获取仪表盘统计数据
- 路径: `/statistics/dashboard`
- 方法: GET
- 权限: ADMIN
- 响应:
```json
{
    "totalStudents": 学生总数,
    "totalWarnings": 预警总数,
    "resolvedWarnings": 已解决预警数,
    "totalCourses": 课程总数
}
```

#### 2.2 获取预警类型分布
- 路径: `/statistics/warnings/distribution`
- 方法: GET
- 权限: ADMIN, TEACHER
- 响应: 预警类型分布数据对象
```json
{
  "COURSE_GRADE": 单科成绩预警数量,
  "MULTIPLE_FAIL": 多科不及格预警数量,
  "SEMESTER_AVERAGE": 学期平均分预警数量,
  "SEVERE": 严重学业危机预警数量
}
```

#### 2.3 获取预警趋势
- 路径: `/statistics/warnings/trends`
- 方法: GET
- 权限: ADMIN, TEACHER
- 参数:
  - period: 周期 (DAILY, WEEKLY, MONTHLY)
  - months: 数据月数
- 响应: 预警趋势数据数组
```json
[
  {
    "date": "2024-01",
    "count": 12,
    "resolvedCount": 8
  },
  {
    "date": "2024-02",
    "count": 18,
    "resolvedCount": 15
  }
]
```

### 3. 预警相关接口 (/warnings)

#### 3.1 获取所有预警
- 路径: `/warnings`
- 方法: GET
- 权限: ADMIN, TEACHER
- 参数:
  - page: 页码（从0开始）
  - size: 每页大小
  - sort: 排序字段
  - direction: 排序方向（asc/desc）
  - studentNumber: 学生学号（可选）
  - studentName: 学生姓名（可选）
  - warningType: 预警类型（可选）
  - status: 预警状态（可选）
  - startDate: 开始日期（可选）
  - endDate: 结束日期（可选）
- 响应: 预警数据分页对象
```json
{
  "content": [
    {
      "id": 预警ID,
      "studentName": "学生姓名",
      "studentNumber": "学号",
      "title": "预警标题",
      "warningType": "预警类型代码",
      "level": 预警等级(1=一般,2=中度,3=严重),
      "content": "预警内容",
      "createTime": "创建时间",
      "status": "状态代码",
      "solution": "解决方案"
    }
  ],
  "totalElements": 总记录数,
  "totalPages": 总页数,
  "size": 每页大小,
  "number": 当前页码
}
```

#### 3.2 获取最近预警
- 路径: `/warnings/recent`
- 方法: GET
- 权限: ADMIN, TEACHER
- 参数:
  - limit: 获取条数，默认5条
- 响应: 预警数据数组

#### 3.3 获取单个预警
- 路径: `/warnings/{id}`
- 方法: GET
- 权限: ADMIN, TEACHER
- 响应: 预警详情对象

#### 3.4 创建预警
- 路径: `/warnings`
- 方法: POST
- 权限: ADMIN, TEACHER
- 请求体:
```json
{
  "studentId": 学生ID,
  "title": "预警标题",
  "warningType": "预警类型代码",
  "level": 预警等级值(1,2,3),
  "content": "预警内容"
}
```
- 响应: 创建的预警对象

#### 3.5 解决预警
- 路径: `/warnings/{id}/resolve`
- 方法: POST
- 权限: ADMIN, TEACHER
- 请求体:
```json
{
  "solution": "解决方案描述"
}
```
- 响应: 更新后的预警对象

#### 3.6 删除预警
- 路径: `/warnings/{id}`
- 方法: DELETE
- 权限: ADMIN
- 响应: 无内容或成功消息

### 4. 学生相关接口 (/students)

#### 4.1 获取所有学生
- 路径: `/students`
- 方法: GET
- 权限: ADMIN, TEACHER
- 参数:
  - page: 页码（从0开始）
  - size: 每页大小
  - sort: 排序字段
  - direction: 排序方向（asc/desc）
  - name: 学生姓名（可选）
  - studentNumber: 学号（可选）
  - college: 学院（可选）
  - major: 专业（可选）
- 响应: 学生数据分页对象

## 开发说明

### 环境要求
- Node.js >= 16
- npm >= 7

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 风格指南

### 注意事项
1. 所有需要认证的接口都需要在请求头中携带JWT token:
```
Authorization: Bearer <your_jwt_token>
```

2. 跨域配置已启用，允许来自 `http://localhost:5173` 的请求

3. 所有接口返回的数据格式为JSON

4. 错误处理:
   - 401: 未认证
   - 403: 无权限
   - 404: 资源不存在
   - 500: 服务器错误

5. 请求体中的日期格式统一使用ISO 8601标准

6. API请求URL规则:
   - 所有API请求URL由以下部分组成：`/api` + 具体路径
   - `/api`前缀由`request.js`中的`baseURL`统一添加
   - 各个具体API函数中不要重复添加`/api`前缀

7. 预警相关的枚举值:
   - 预警类型: 
     - `COURSE_GRADE`: 单科成绩预警
     - `MULTIPLE_FAIL`: 多科不及格预警
     - `SEMESTER_AVERAGE`: 学期平均分预警
     - `SEVERE`: 严重学业危机预警
   - 预警状态: 
     - `NEW`: 新建预警 
     - `READ`: 已读预警
     - `PROCESSED`: 处理中
     - `RESOLVED`: 已解决
   - 预警级别: 数字类型
     - `1`: 一般预警
     - `2`: 中度预警
     - `3`: 严重预警
   - 性别: 
     - `MALE`: 男
     - `FEMALE`: 女

## 项目说明
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

## 最近更新
- 优化了侧边栏折叠/展开的响应式布局
  - 修复了侧边栏展开时出现的矩形拖影问题
  - 添加了更平滑的过渡效果和阴影处理
  - 通过禁用原生折叠过渡，使用自定义过渡效果改善菜单文字显示
  - 优化了容器样式，确保主内容区域正确响应侧边栏状态变化
  - 添加了溢出控制，防止布局错位

- 修复了侧边栏折叠时的响应式布局问题
  - 在 `StudentLayout.vue` 和 `AdminLayout.vue` 中添加了动态宽度设置
  - 改进了侧边栏过渡动画效果
  - 优化了折叠时的样式和响应

- 调整了API接口以匹配后端实际情况
  - 更新了预警类型的枚举值
  - 调整了预警状态和级别的数据格式
  - 修正了API路径和参数格式

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

## 开发注意事项

### API接口注意事项

1. **预警相关接口**：目前后端尚未实现预警相关的控制器，前端调用预警API时可能会遇到404错误。等待后端实现完成后，前端无需修改代码，因为API路径和参数已经按照约定格式定义。

2. **预警类型和状态枚举值**：
   - 预警类型已从原来的 `GRADE`, `ATTENDANCE`, `BEHAVIOR`, `COMPREHENSIVE` 调整为 `COURSE_GRADE`, `MULTIPLE_FAIL`, `SEMESTER_AVERAGE`, `SEVERE`
   - 预警状态已从原来的 `PENDING`, `RESOLVED` 调整为 `NEW`, `READ`, `PROCESSED`, `RESOLVED`
   - 预警级别已从字符串类型(`LOW`, `MEDIUM`, `HIGH`)调整为数字类型(`1`, `2`, `3`)

3. **认证接口**：
   - 登录接口使用 `/auth/signin` 而非 `/auth/login`
   - 获取当前用户信息使用 `/auth/me`

4. **后端服务未启动场景**：
   - 如果后端服务未启动，前端会遇到网络请求错误
   - 所有API接口都已添加错误处理，将显示友好的错误信息
   - 数据加载状态也已正确处理

5. **后端控制器未实现场景**：
   - 前端的API模块(`src/api/`)中已经定义了完整的接口函数
   - 当后端实现对应的控制器后，前端无需修改代码即可正常工作

## API 请求问题修复

### 问题描述

前端应用中API请求返回404错误：

```
api/statistics/dashboard:1 Failed to load resource: the server responded with a status of 404 (Not Found)
request.js:30 errAxiosError: Request failed with status code 404
DashboardView.vue:192 获取仪表盘统计数据失败: AxiosError

api/statistics/warnings/distribution:1 Failed to load resource: the server responded with a status of 404 (Not Found)
request.js:30 errAxiosError: Request failed with status code 404
DashboardView.vue:225 获取图表数据失败: AxiosError

api/warnings/recent?limit=5:1 Failed to load resource: the server responded with a status of 404 (Not Found)
request.js:30 errAxiosError: Request failed with status code 404
DashboardView.vue:241 获取最近预警失败: AxiosError
```

### 原因分析

经过多次测试，我们发现问题的根本原因在于API路径的配置：

1. 在 `request.js` 中设置了 `baseURL: '/api'`，这会为所有请求加上 `/api` 前缀
2. 后端服务的API路径格式可能有以下两种情况：
   - 情况1：后端API路径已经包含 `/api` 前缀，如 `/api/auth/signin`
   - 情况2：后端API路径不包含 `/api` 前缀，如 `/auth/signin`

### 解决方案

我们已经确认登录接口是可以正常工作的，这表明后端API路径已经包含了 `/api` 前缀。因此，在 `vite.config.js` 中，我们**不应该**重写路径。

正确的配置：
```js
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true
    // 不添加rewrite配置，保留/api前缀
  }
}
```

这样，前端请求 `/api/auth/signin` 会被转发到后端的 `/api/auth/signin` 端点，保持路径一致。

如果统计相关的API仍然返回404错误，那可能是因为后端尚未实现这些接口，而不是代理配置问题。您需要与后端开发者确认这些接口是否已经实现：

- `/api/statistics/dashboard`
- `/api/statistics/warnings/distribution`
- `/api/warnings/recent`

### 后续建议

1. 与后端开发者确认所有API接口的确切路径
2. 检查后端是否已经实现了所有必要的接口
3. 如果必要，可以在前端临时模拟数据进行开发测试

## 项目启动

```
npm install
npm run dev
```

## 构建部署

```
npm run build
```

## 技术栈

- Vue 3
- Vite
- Element Plus
- Axios
- Pinia

import request from './request'

// 用户登录
export function login(data) {
    return request({
        url: '/auth/signin',
        method: 'post',
        data
    })
}

// 用户注册
export function register(data) {
    return request({
        url: '/auth/signup',
        method: 'post',
        data
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/auth/me',
        method: 'get'
    })
}

// 更新用户信息
export function updateUserInfo(data) {
    return request({
        url: '/auth/me',
        method: 'put',
        data
    })
}

// 修改密码
export function changePassword(data) {
    return request({
        url: '/auth/password',
        method: 'put',
        data
    })
}

// 获取所有用户（管理员）
export function getAllUsers(params) {
    return request({
        url: '/users',
        method: 'get',
        params
    })
}

// 获取单个用户（管理员）
export function getUserById(id) {
    return request({
        url: `/users/${id}`,
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/auth/signout',
        method: 'post'
    })
} 
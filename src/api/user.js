import request from './request'

export function login(data) {
    return request({
        url: '/auth/signin',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/auth/signout',
        method: 'post'
    })
}

export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}

export function updateUserInfo(data) {
    return request({
        url: '/user/info',
        method: 'put',
        data
    })
}

export function changePassword(data) {
    return request({
        url: '/user/password',
        method: 'put',
        data
    })
} 
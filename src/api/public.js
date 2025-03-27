import request from './request'

// 系统状态检查
export function checkSystemStatus() {
    return request({
        url: '/public/ping',
        method: 'get'
    })
}

// 获取系统信息
export function getSystemInfo() {
    return request({
        url: '/public/info',
        method: 'get'
    })
} 
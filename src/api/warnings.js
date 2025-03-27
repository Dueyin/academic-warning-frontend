import request from './request'

// 获取所有预警
export function getAllWarnings(params) {
    return request({
        url: '/warnings',
        method: 'get',
        params
    })
}

// 获取单个预警
export function getWarningById(id) {
    return request({
        url: `/warnings/${id}`,
        method: 'get'
    })
}

// 创建预警
export function createWarning(data) {
    return request({
        url: '/warnings',
        method: 'post',
        data
    })
}

// 更新预警
export function updateWarning(id, data) {
    return request({
        url: `/warnings/${id}`,
        method: 'put',
        data
    })
}

// 删除预警
export function deleteWarning(id) {
    return request({
        url: `/warnings/${id}`,
        method: 'delete'
    })
}

// 解决预警
export function resolveWarning(id, solution) {
    return request({
        url: `/warnings/${id}/resolve`,
        method: 'post',
        data: { solution }
    })
}

// 获取预警类型列表
export function getWarningTypes() {
    return request({
        url: '/warnings/types',
        method: 'get'
    })
}

// 获取最近预警
export function getRecentWarnings(limit = 5) {
    return request({
        url: '/warnings/recent',
        method: 'get',
        params: { limit }
    })
}

// 获取学生预警
export function getStudentWarnings(studentId, params) {
    return request({
        url: `/warnings/student/${studentId}`,
        method: 'get',
        params
    })
} 
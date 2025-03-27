import request from './request'

// 获取所有教师
export function getAllTeachers(params) {
    return request({
        url: '/teachers',
        method: 'get',
        params
    })
}

// 获取单个教师
export function getTeacherById(id) {
    return request({
        url: `/teachers/${id}`,
        method: 'get'
    })
}

// 创建教师
export function createTeacher(data) {
    return request({
        url: '/teachers',
        method: 'post',
        data
    })
}

// 更新教师信息
export function updateTeacher(id, data) {
    return request({
        url: `/teachers/${id}`,
        method: 'put',
        data
    })
} 
import request from './request'

// 获取所有学生
export function getAllStudents(params) {
    return request({
        url: '/students',
        method: 'get',
        params
    })
}

// 获取单个学生
export function getStudentById(id) {
    return request({
        url: `/students/${id}`,
        method: 'get'
    })
}

// 创建学生
export function createStudent(data) {
    return request({
        url: '/students',
        method: 'post',
        data
    })
}

// 更新学生信息
export function updateStudent(id, data) {
    return request({
        url: `/students/${id}`,
        method: 'put',
        data
    })
}

// 获取班级学生
export function getClassStudents(classGroupId) {
    return request({
        url: `/students/class/${classGroupId}`,
        method: 'get'
    })
}

// 获取预警学生
export function getWarningStudents() {
    return request({
        url: '/students/warnings',
        method: 'get'
    })
} 
import request from './request'

// 获取系统统计数据
export function getSystemStatistics() {
    return request({
        url: '/statistics/system',
        method: 'get'
    })
}

// 获取学生统计数据
export function getStudentStatistics() {
    return request({
        url: '/statistics/students',
        method: 'get'
    })
}

// 获取预警统计数据
export function getWarningStatistics() {
    return request({
        url: '/statistics/warnings',
        method: 'get'
    })
}

// 获取课程统计数据
export function getCourseStatistics() {
    return request({
        url: '/statistics/courses',
        method: 'get'
    })
}

// 获取仪表盘统计数据（集成所有需要的统计）
export function getDashboardStatistics() {
    return request({
        url: '/statistics/dashboard',
        method: 'get'
    })
}

// 获取预警类型分布数据
export function getWarningTypeDistribution() {
    return request({
        url: '/statistics/warnings/distribution',
        method: 'get'
    })
}

// 获取预警趋势数据
export function getWarningTrends(params) {
    return request({
        url: '/statistics/warnings/trends',
        method: 'get',
        params
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
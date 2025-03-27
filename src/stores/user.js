import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '../api/user'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: null,
        roles: []
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.roles.includes('ROLE_ADMIN'),
        isStudent: (state) => state.roles.includes('ROLE_STUDENT'),
        isTeacher: (state) => state.roles.includes('ROLE_TEACHER')
    },

    actions: {
        async login(loginForm) {
            try {
                const response = await login(loginForm)
                console.log('登录响应:', response)

                // 从响应中提取token、roles和基本用户信息
                this.token = response.token || response.accessToken || ''
                this.roles = response.roles || []

                // 如果响应中包含用户信息，则直接使用
                if (response.name || response.username) {
                    this.userInfo = {
                        id: response.id,
                        name: response.name,
                        username: response.username,
                        email: response.email,
                        roles: response.roles
                    }
                }

                localStorage.setItem('token', this.token)

                // 如果需要，尝试获取更详细的用户信息
                if (this.token && !this.userInfo) {
                    await this.getUserInfo()
                }

                return response
            } catch (error) {
                console.error('登录错误:', error)
                throw error
            }
        },

        async getUserInfo() {
            try {
                console.log('请求用户信息...')
                const response = await getUserInfo()
                console.log('获取到用户信息:', response)
                this.userInfo = response

                // 如果用户信息中包含角色而状态中没有，则更新角色
                if (response.roles && response.roles.length && this.roles.length === 0) {
                    this.roles = response.roles
                }

                return response
            } catch (error) {
                console.error('获取用户信息失败:', error)
                throw error
            }
        },

        async logout() {
            try {
                await logout()
                this.resetState()
            } catch (error) {
                // 即使退出登录失败，也清空本地状态
                this.resetState()
                throw error
            }
        },

        resetState() {
            this.token = ''
            this.userInfo = null
            this.roles = []
            localStorage.removeItem('token')
        }
    }
}) 
import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi } from '../api/user'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        userRole: (state) => {
            // 尝试从不同可能的格式中获取角色信息
            if (state.userInfo.roles && state.userInfo.roles.length) {
                return state.userInfo.roles[0];
            }
            if (state.userInfo.role) {
                return state.userInfo.role;
            }
            if (state.userInfo.authorities && state.userInfo.authorities.length) {
                return state.userInfo.authorities[0].authority;
            }
            return '';
        }
    },

    actions: {
        async login(loginForm) {
            try {
                const res = await loginApi(loginForm)
                console.log('登录响应:', res)

                // 适应可能的不同响应格式
                let token = '';
                let user = {};

                // 检查可能的格式1: res.data.token 和 res.data.user
                if (res.data && res.data.token && res.data.user) {
                    token = res.data.token;
                    user = res.data.user;
                }
                // 检查可能的格式2: res.token 和 res.user 
                else if (res.token && res.user) {
                    token = res.token;
                    user = res.user;
                }
                // 检查可能的格式3: Spring Security 标准格式
                else if (res.access_token || res.accessToken) {
                    token = res.access_token || res.accessToken;
                    // 可能需要单独获取用户信息
                    user = { username: loginForm.username };
                    if (res.authorities) {
                        user.authorities = res.authorities;
                    }
                }
                // 检查可能的格式4: 自定义格式
                else if (typeof res === 'object') {
                    console.log('未识别的响应格式，尝试解析:', res);
                    token = res.token || res.access_token || res.accessToken || '';
                    user = res.user || res.userInfo || res.userData || res;
                }

                if (!token) {
                    console.error('无法从响应中获取 token:', res);
                    throw new Error('登录失败：无法获取认证令牌');
                }

                this.token = token;
                this.userInfo = user;

                console.log('设置的用户信息:', this.userInfo);
                console.log('解析的用户角色:', this.userRole);

                localStorage.setItem('token', token);
                localStorage.setItem('userInfo', JSON.stringify(user));
                return res;
            } catch (error) {
                console.error('登录过程中发生错误:', error);
                throw error;
            }
        },

        async logout() {
            try {
                await logoutApi()
                this.token = ''
                this.userInfo = {}
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
            } catch (error) {
                throw error
            }
        }
    }
}) 
import axios from 'axios'
import router from '../../router'
import api from '../../utils/api'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoading: false,
  error: null
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  userRole: state => state.user ? state.user.roles[0] : null,
  isLoading: state => state.isLoading,
  error: state => state.error
}

const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token
    state.user = user
    state.error = null
  },
  CLEAR_AUTH(state) {
    state.token = ''
    state.user = null
    state.error = null
  },
  SET_LOADING(state, status) {
    state.isLoading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      const response = await api.post('/auth/signin', credentials)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      commit('SET_AUTH', { token, user })

      // 设置 axios 默认 headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return response
    } catch (error) {
      const message = error.response?.data?.message || '登录失败，请检查用户名和密码'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('CLEAR_AUTH')
    delete api.defaults.headers.common['Authorization']
    router.push('/login')
  },

  checkAuth({ commit, state }) {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 
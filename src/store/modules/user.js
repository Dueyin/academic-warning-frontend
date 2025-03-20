import api from '../../utils/api'

const state = {
  users: [],
  currentUser: null,
  totalUsers: 0
}

const getters = {
  allUsers: state => state.users,
  userById: state => id => state.users.find(user => user.id === id),
  totalUsers: state => state.totalUsers
}

const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_TOTAL_USERS(state, total) {
    state.totalUsers = total
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  }
}

const actions = {
  async fetchUsers({ commit }, { page = 1, size = 10 } = {}) {
    try {
      const response = await api.get('/users', {
        params: { page: page - 1, size }
      })
      commit('SET_USERS', response.data.content)
      commit('SET_TOTAL_USERS', response.data.totalElements)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchUserById({ commit }, userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      commit('SET_CURRENT_USER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async createUser({ commit }, userData) {
    try {
      const response = await api.post('/auth/signup', userData)
      commit('ADD_USER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async updateUser({ commit }, { userId, userData }) {
    try {
      const response = await api.put(`/users/${userId}`, userData)
      commit('UPDATE_USER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async deleteUser({ commit }, userId) {
    try {
      await api.delete(`/users/${userId}`)
      commit('REMOVE_USER', userId)
    } catch (error) {
      throw error
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
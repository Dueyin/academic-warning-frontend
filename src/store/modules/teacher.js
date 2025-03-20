import api from '../../utils/api'

const state = {
  teachers: [],
  currentTeacher: null,
  totalTeachers: 0
}

const getters = {
  allTeachers: state => state.teachers,
  teacherById: state => id => state.teachers.find(teacher => teacher.id === id),
  totalTeachers: state => state.totalTeachers
}

const mutations = {
  SET_TEACHERS(state, teachers) {
    state.teachers = teachers
  },
  SET_TOTAL_TEACHERS(state, total) {
    state.totalTeachers = total
  },
  SET_CURRENT_TEACHER(state, teacher) {
    state.currentTeacher = teacher
  },
  ADD_TEACHER(state, teacher) {
    state.teachers.push(teacher)
  },
  UPDATE_TEACHER(state, updatedTeacher) {
    const index = state.teachers.findIndex(teacher => teacher.id === updatedTeacher.id)
    if (index !== -1) {
      state.teachers.splice(index, 1, updatedTeacher)
    }
  },
  REMOVE_TEACHER(state, teacherId) {
    state.teachers = state.teachers.filter(teacher => teacher.id !== teacherId)
  }
}

const actions = {
  async fetchTeachers({ commit }, { page = 1, size = 10 } = {}) {
    try {
      const response = await api.get('/teachers', {
        params: { page: page - 1, size }
      })
      commit('SET_TEACHERS', response.data.content)
      commit('SET_TOTAL_TEACHERS', response.data.totalElements)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchTeacherById({ commit }, teacherId) {
    try {
      const response = await api.get(`/teachers/${teacherId}`)
      commit('SET_CURRENT_TEACHER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchTeacherByNumber({ commit }, teacherNumber) {
    try {
      const response = await api.get(`/teachers/number/${teacherNumber}`)
      commit('SET_CURRENT_TEACHER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async createTeacher({ commit }, teacherData) {
    try {
      const response = await api.post('/teachers', teacherData)
      commit('ADD_TEACHER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async updateTeacher({ commit }, { teacherId, teacherData }) {
    try {
      const response = await api.put(`/teachers/${teacherId}`, teacherData)
      commit('UPDATE_TEACHER', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async deleteTeacher({ commit }, teacherId) {
    try {
      await api.delete(`/teachers/${teacherId}`)
      commit('REMOVE_TEACHER', teacherId)
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
import api from '../../utils/api'

const state = {
  students: [],
  currentStudent: null,
  totalStudents: 0,
  warningStudents: []
}

const getters = {
  allStudents: state => state.students,
  studentById: state => id => state.students.find(student => student.id === id),
  totalStudents: state => state.totalStudents,
  warningStudents: state => state.warningStudents
}

const mutations = {
  SET_STUDENTS(state, students) {
    state.students = students
  },
  SET_TOTAL_STUDENTS(state, total) {
    state.totalStudents = total
  },
  SET_CURRENT_STUDENT(state, student) {
    state.currentStudent = student
  },
  SET_WARNING_STUDENTS(state, students) {
    state.warningStudents = students
  },
  ADD_STUDENT(state, student) {
    state.students.push(student)
  },
  UPDATE_STUDENT(state, updatedStudent) {
    const index = state.students.findIndex(student => student.id === updatedStudent.id)
    if (index !== -1) {
      state.students.splice(index, 1, updatedStudent)
    }
  },
  REMOVE_STUDENT(state, studentId) {
    state.students = state.students.filter(student => student.id !== studentId)
  }
}

const actions = {
  async fetchStudents({ commit }, { page = 1, size = 10 } = {}) {
    try {
      const response = await api.get('/students', {
        params: { page: page - 1, size }
      })
      commit('SET_STUDENTS', response.data.content)
      commit('SET_TOTAL_STUDENTS', response.data.totalElements)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchStudentById({ commit }, studentId) {
    try {
      const response = await api.get(`/students/${studentId}`)
      commit('SET_CURRENT_STUDENT', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchStudentByNumber({ commit }, studentNumber) {
    try {
      const response = await api.get(`/students/number/${studentNumber}`)
      commit('SET_CURRENT_STUDENT', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchStudentsByClass({ commit }, classGroupId) {
    try {
      const response = await api.get(`/students/class/${classGroupId}`)
      commit('SET_STUDENTS', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async fetchWarningStudents({ commit }) {
    try {
      const response = await api.get('/students/warnings')
      commit('SET_WARNING_STUDENTS', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async createStudent({ commit }, studentData) {
    try {
      const response = await api.post('/students', studentData)
      commit('ADD_STUDENT', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async updateStudent({ commit }, { studentId, studentData }) {
    try {
      const response = await api.put(`/students/${studentId}`, studentData)
      commit('UPDATE_STUDENT', response.data)
      return response
    } catch (error) {
      throw error
    }
  },
  
  async deleteStudent({ commit }, studentId) {
    try {
      await api.delete(`/students/${studentId}`)
      commit('REMOVE_STUDENT', studentId)
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
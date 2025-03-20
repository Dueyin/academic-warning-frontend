<template>
  <div class="user-management">
    <el-card class="app-card">
      <template #header>
        <div class="app-card-header">
          <span class="title">用户管理</span>
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
        </div>
      </template>
      
      <div class="table-toolbar">
        <div class="left">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名或姓名"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="right">
          <el-select v-model="roleFilter" placeholder="角色筛选" clearable @change="handleSearch">
            <el-option label="管理员" value="ROLE_ADMIN" />
            <el-option label="教师" value="ROLE_TEACHER" />
            <el-option label="学生" value="ROLE_STUDENT" />
          </el-select>
          <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="handleSearch">
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </div>
      </div>
      
      <el-table :data="users" v-loading="loading" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column label="角色" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.roles.includes('ROLE_ADMIN')" type="danger">管理员</el-tag>
            <el-tag v-else-if="scope.row.roles.includes('ROLE_TEACHER')" type="warning">教师</el-tag>
            <el-tag v-else-if="scope.row.roles.includes('ROLE_STUDENT')" type="success">学生</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="handleStatusChange(scope.row)"
              :disabled="scope.row.roles.includes('ROLE_ADMIN')"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDeleteUser(scope.row)"
              :disabled="scope.row.roles.includes('ROLE_ADMIN')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalUsers"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="userForm.roles" multiple placeholder="请选择角色">
            <el-option label="管理员" value="ROLE_ADMIN" />
            <el-option label="教师" value="ROLE_TEACHER" />
            <el-option label="学生" value="ROLE_STUDENT" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="userForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserManagementView',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const searchQuery = ref('')
    const roleFilter = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const userFormRef = ref(null)
    
    const userForm = reactive({
      id: '',
      username: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      roles: [],
      enabled: true
    })
    
    const userRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' }
      ],
      roles: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ]
    }
    
    const users = computed(() => store.getters['user/allUsers'])
    const totalUsers = computed(() => store.getters['user/totalUsers'])
    
    const fetchUsers = async () => {
      loading.value = true
      try {
        await store.dispatch('user/fetchUsers', {
          page: currentPage.value,
          size: pageSize.value
        })
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const resetUserForm = () => {
      userForm.id = ''
      userForm.username = ''
      userForm.name = ''
      userForm.email = ''
      userForm.phone = ''
      userForm.password = ''
      userForm.roles = []
      userForm.enabled = true
      
      if (userFormRef.value) {
        userFormRef.value.resetFields()
      }
    }
    
    const handleAddUser = () => {
      resetUserForm()
      isEdit.value = false
      dialogVisible.value = true
    }
    
    const handleEditUser = (row) => {
      resetUserForm()
      isEdit.value = true
      
      userForm.id = row.id
      userForm.username = row.username
      userForm.name = row.name
      userForm.email = row.email
      userForm.phone = row.phone
      userForm.roles = [...row.roles]
      userForm.enabled = row.enabled
      
      dialogVisible.value = true
    }
    
    const handleDeleteUser = (row) => {
      ElMessageBox.confirm(
        `确定要删除用户 ${row.name} 吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await store.dispatch('user/deleteUser', row.id)
          ElMessage.success('删除成功')
          fetchUsers()
        } catch (error) {
          console.error('删除用户失败:', error)
        }
      }).catch(() => {
        // 取消删除
      })
    }
    
    const handleStatusChange = async (row) => {
      try {
        await store.dispatch('user/updateUser', {
          userId: row.id,
          userData: { enabled: row.enabled }
        })
        ElMessage.success(`用户状态已${row.enabled ? '启用' : '禁用'}`)
      } catch (error) {
        console.error('更新用户状态失败:', error)
        // 恢复原状态
        row.enabled = !row.enabled
      }
    }
    
    const submitUserForm = async () => {
      if (!userFormRef.value) return
      
      try {
        await userFormRef.value.validate()
        
        if (isEdit.value) {
          // 编辑用户
          await store.dispatch('user/updateUser', {
            userId: userForm.id,
            userData: {
              name: userForm.name,
              email: userForm.email,
              phone: userForm.phone,
              roles: userForm.roles,
              enabled: userForm.enabled
            }
          })
          ElMessage.success('更新成功')
        } else {
          // 添加用户
          await store.dispatch('user/createUser', {
            username: userForm.username,
            password: userForm.password,
            name: userForm.name,
            email: userForm.email,
            phone: userForm.phone,
            roles: userForm.roles,
            enabled: userForm.enabled
          })
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        fetchUsers()
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const handleSearch = () => {
      currentPage.value = 1
      fetchUsers()
    }
    
    const handleSizeChange = (size) => {
      pageSize.value = size
      fetchUsers()
    }
    
    const handleCurrentChange = (page) => {
      currentPage.value = page
      fetchUsers()
    }
    
    onMounted(() => {
      fetchUsers()
    })
    
    return {
      loading,
      searchQuery,
      roleFilter,
      statusFilter,
      currentPage,
      pageSize,
      dialogVisible,
      isEdit,
      userForm,
      userRules,
      userFormRef,
      users,
      totalUsers,
      handleAddUser,
      handleEditUser,
      handleDeleteUser,
      handleStatusChange,
      submitUserForm,
      handleSearch,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.user-management {
  .app-card {
    margin-bottom: 20px;
  }
}
</style> 
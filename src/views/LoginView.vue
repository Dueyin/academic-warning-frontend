<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>学业监测预警系统</h2>
        <p>请登录您的账户</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="User"
            placeholder="请输入用户名"
            clearable
            tabindex="1"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            show-password
            tabindex="2"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="isLoading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'LoginView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const loginFormRef = ref(null)
    
    const loginForm = ref({
      username: '',
      password: ''
    })
    
    const loginRules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
      ]
    }
    
    const isLoading = computed(() => store.state.auth.isLoading)
    
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        // 表单验证
        await loginFormRef.value.validate()
        
        // 设置加载状态
        store.commit('auth/SET_LOADING', true)
        
        // 登录请求
        await store.dispatch('auth/login', {
          username: loginForm.value.username.trim(),
          password: loginForm.value.password.trim()
        })
        
        // 登录成功提示
        ElMessage.success('登录成功')
        
        // 路由跳转到首页
        await router.push('/dashboard')
      } catch (error) {
        // 错误处理
        if (error.response) {
          ElMessage.error(error.response.data.message || '登录失败，请检查用户名和密码')
        } else if (error.message) {
          ElMessage.error(error.message)
        } else {
          ElMessage.error('登录失败，请稍后重试')
        }
        console.error('登录失败:', error)
      } finally {
        // 清除加载状态
        store.commit('auth/SET_LOADING', false)
      }
    }
    
    return {
      loginFormRef,
      loginForm,
      loginRules,
      isLoading,
      handleLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
  
  .login-box {
    width: 400px;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
      
      h2 {
        margin-bottom: 10px;
        color: #303133;
      }
      
      p {
        color: #909399;
        margin: 0;
      }
    }
    
    .login-button {
      width: 100%;
    }
  }
}
</style> 
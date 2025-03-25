<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 个人信息卡片 -->
        <el-card class="profile-card">
          <div class="profile-header">
            <el-avatar :size="100" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            <h2>{{ userInfo.name }}</h2>
            <p class="student-id">学号：{{ userInfo.studentNumber }}</p>
          </div>
          
          <el-divider />
          
          <div class="profile-info">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>姓名：{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <el-icon><School /></el-icon>
              <span>学院：{{ userInfo.college }}</span>
            </div>
            <div class="info-item">
              <el-icon><Office /></el-icon>
              <span>专业：{{ userInfo.major }}</span>
            </div>
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <span>年级：{{ userInfo.grade }}</span>
            </div>
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>电话：{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <span>邮箱：{{ userInfo.email }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <!-- 修改密码卡片 -->
        <el-card class="password-card">
          <template #header>
            <div class="card-header">
              <span>修改密码</span>
            </div>
          </template>
          
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
              />
            </el-form-item>
            
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleChangePassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        
        <!-- 修改个人信息卡片 -->
        <el-card class="edit-card">
          <template #header>
            <div class="card-header">
              <span>修改个人信息</span>
            </div>
          </template>
          
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
          >
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="profileForm.phone"
                placeholder="请输入手机号码"
              />
            </el-form-item>
            
            <el-form-item label="邮箱地址" prop="email">
              <el-input
                v-model="profileForm.email"
                placeholder="请输入邮箱地址"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="handleUpdateProfile">
                保存修改
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '../../stores/user'
import {
  User,
  School,
  Office,
  Calendar,
  Phone,
  Message
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

// 模拟用户信息
const userInfo = reactive({
  name: '张三',
  studentNumber: '2024001',
  college: '计算机学院',
  major: '软件工程',
  grade: '2024级',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  avatar: ''
})

// 密码表单
const passwordFormRef = ref(null)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 个人信息表单
const profileFormRef = ref(null)
const profileForm = reactive({
  phone: userInfo.phone,
  email: userInfo.email
})

const profileRules = {
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里调用修改密码API
        ElMessage.success('密码修改成功')
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''
      } catch (error) {
        console.error('密码修改失败:', error)
      }
    }
  })
}

// 更新个人信息
const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 这里调用更新个人信息API
        userInfo.phone = profileForm.phone
        userInfo.email = profileForm.email
        ElMessage.success('个人信息更新成功')
      } catch (error) {
        console.error('个人信息更新失败:', error)
      }
    }
  })
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.profile-header {
  text-align: center;
  padding: 20px 0;
}

.profile-header h2 {
  margin: 15px 0 5px;
  color: #303133;
}

.student-id {
  color: #909399;
  margin: 0;
}

.profile-info {
  padding: 20px 0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #606266;
}

.info-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
  color: #409EFF;
}

.password-card,
.edit-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 
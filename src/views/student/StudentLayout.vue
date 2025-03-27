<template>
  <el-container class="layout-container" v-loading="loading">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-container">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :router="true"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/student">
          <el-icon><Monitor /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/student/profile">
          <el-icon><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
        
        <el-menu-item index="/student/grades">
          <el-icon><Document /></el-icon>
          <template #title>成绩查询</template>
        </el-menu-item>

        <el-menu-item index="/student/warnings">
          <el-icon><Warning /></el-icon>
          <template #title>预警信息</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-left">
          <el-button text @click="toggleCollapse">
            <el-icon>
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ userInfo?.name || '用户' }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view v-if="!loading" />
        <div v-else class="loading-placeholder">
          <el-empty description="加载中..." />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  User,
  Document,
  Warning,
  Expand,
  Fold,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)
const userInfo = ref(null)
const loading = ref(true)

const activeMenu = computed(() => route.path)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}

const fetchUserInfo = async () => {
  try {
    loading.value = true
    
    // 首先检查是否已经有token
    if (!userStore.token) {
      ElMessage.error('您尚未登录或登录已过期')
      router.push('/login')
      return
    }
    
    // 如果已经有用户信息了，直接使用
    if (userStore.userInfo) {
      userInfo.value = userStore.userInfo
      loading.value = false
      return
    }
    
    // 否则获取用户信息
    userInfo.value = await userStore.getUserInfo()
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请重新登录')
    userStore.resetState()
    router.push('/login')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.el-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s ease;
  overflow: hidden;
  z-index: 10;
}

.aside-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.el-menu {
  border-right: none;
}

.el-menu-vertical {
  height: 100%;
  width: 100%;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.user-info .el-icon {
  margin-left: 5px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-x: hidden;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active) {
  color: #409EFF;
  background-color: #263445;
}

:deep(.el-menu-item:hover) {
  background-color: #263445;
}

.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}
</style> 
<template>
  <el-container class="dashboard-container">
    <el-aside width="220px" class="dashboard-aside">
      <div class="logo">
        <h2>学业监测预警系统</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="dashboard-menu"
        :router="true"
        :collapse="isCollapse"
      >
        <!-- 管理员菜单 -->
        <template v-if="userRole === 'ROLE_ADMIN'">
          <el-sub-menu index="user-management">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/dashboard/users">用户列表</el-menu-item>
            <el-menu-item index="/dashboard/students">学生管理</el-menu-item>
            <el-menu-item index="/dashboard/teachers">教师管理</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="academic-management">
            <template #title>
              <el-icon><Notebook /></el-icon>
              <span>学业管理</span>
            </template>
            <el-menu-item index="/dashboard/grades">成绩管理</el-menu-item>
            <el-menu-item index="/dashboard/warnings">预警管理</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/dashboard/notifications">
            <el-icon><Bell /></el-icon>
            <span>通知管理</span>
          </el-menu-item>
        </template>
        
        <!-- 教师菜单 -->
        <template v-if="userRole === 'ROLE_TEACHER'">
          <el-menu-item index="/dashboard/my-classes">
            <el-icon><Reading /></el-icon>
            <span>我的班级</span>
          </el-menu-item>
        </template>
        
        <!-- 学生菜单 -->
        <template v-if="userRole === 'ROLE_STUDENT'">
          <el-menu-item index="/dashboard/my-grades">
            <el-icon><Document /></el-icon>
            <span>我的成绩</span>
          </el-menu-item>
        </template>
        
        <!-- 公共菜单 -->
        <el-menu-item index="/dashboard/profile">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="dashboard-header">
        <div class="header-left">
          <el-icon 
            class="collapse-btn"
            @click="toggleCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <Breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-dropdown">
              {{ currentUser?.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="dashboard-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {
  User,
  Notebook,
  Bell,
  Reading,
  Document,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'
import Breadcrumb from '../components/Breadcrumb.vue'

export default {
  name: 'DashboardView',
  components: {
    Breadcrumb,
    User,
    Notebook,
    Bell,
    Reading,
    Document,
    Fold,
    Expand,
    ArrowDown
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const isCollapse = ref(false)
    const activeMenu = computed(() => route.path)
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const userRole = computed(() => store.getters['auth/userRole'])
    
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }
    
    const handleCommand = (command) => {
      if (command === 'logout') {
        store.dispatch('auth/logout')
      } else if (command === 'profile') {
        router.push('/dashboard/profile')
      }
    }
    
    return {
      isCollapse,
      activeMenu,
      currentUser,
      userRole,
      toggleCollapse,
      handleCommand
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100vh;
  
  .dashboard-aside {
    background-color: #304156;
    color: #fff;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2b2f3a;
      
      h2 {
        margin: 0;
        font-size: 18px;
        color: #fff;
      }
    }
    
    .dashboard-menu {
      border-right: none;
      background-color: #304156;
      
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        color: #bfcbd9;
        
        &:hover {
          background-color: #263445;
        }
      }
      
      :deep(.el-menu-item.is-active) {
        color: #409eff;
        background-color: #263445;
      }
    }
  }
  
  .dashboard-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .header-left {
      display: flex;
      align-items: center;
      
      .collapse-btn {
        font-size: 20px;
        cursor: pointer;
        margin-right: 20px;
      }
    }
    
    .header-right {
      .user-dropdown {
        cursor: pointer;
        display: flex;
        align-items: center;
        
        .el-icon {
          margin-left: 5px;
        }
      }
    }
  }
  
  .dashboard-main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
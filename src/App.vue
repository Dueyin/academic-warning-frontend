<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElConfigProvider, ElLoading, ElNotification } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default {
  name: 'App',
  components: {
    ElConfigProvider,
    ElLoading,
    ElNotification
  },
  setup() {
    const store = useStore()
    
    const isLoading = computed(() => store.getters.isLoading)
    const hasError = computed(() => store.getters.hasError)
    const error = computed(() => store.getters.error)
    
    const clearError = () => {
      store.dispatch('clearError')
    }
    
    return {
      zhCn,
      isLoading,
      hasError,
      error,
      clearError
    }
  }
}
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    
    <!-- 全局加载指示器 -->
    <el-loading :fullscreen="isLoading" />
    
    <!-- 全局错误提示 -->
    <el-notification
      v-if="hasError"
      :title="'错误'"
      :message="error"
      type="error"
      @close="clearError"
    />
  </el-config-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  height: 100vh;
}
</style>

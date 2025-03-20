<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.path">
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const breadcrumbs = ref([])
    
    const getBreadcrumbs = () => {
      const paths = route.path.split('/').filter(Boolean)
      const result = []
      
      let currentPath = ''
      
      paths.forEach((path, index) => {
        currentPath += `/${path}`
        
        // 根据路径生成面包屑名称
        let name = path.charAt(0).toUpperCase() + path.slice(1)
        
        // 特殊路径名称映射
        const nameMap = {
          'dashboard': '首页',
          'users': '用户列表',
          'students': '学生管理',
          'teachers': '教师管理',
          'grades': '成绩管理',
          'warnings': '预警管理',
          'notifications': '通知管理',
          'profile': '个人信息',
          'courses': '课程信息',
          'my-grades': '成绩查询',
          'academic-report': '学业报告',
          'settings': '系统设置'
        }
        
        if (nameMap[path]) {
          name = nameMap[path]
        }
        
        result.push({
          name,
          path: currentPath
        })
      })
      
      return result
    }
    
    watch(() => route.path, () => {
      breadcrumbs.value = getBreadcrumbs()
    }, { immediate: true })
    
    return {
      breadcrumbs
    }
  }
}
</script> 
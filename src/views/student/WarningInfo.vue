<template>
  <div class="warning-info">
    <el-card class="warning-card">
      <template #header>
        <div class="card-header">
          <span>预警信息</span>
          <el-tag :type="hasWarning ? 'danger' : 'success'">
            {{ hasWarning ? '存在预警' : '无预警' }}
          </el-tag>
        </div>
      </template>

      <div v-if="hasWarning" class="warning-content">
        <el-alert
          v-for="(warning, index) in warnings"
          :key="index"
          :title="warning.title"
          :type="warning.type"
          :description="warning.description"
          show-icon
          class="warning-item"
        />
      </div>
      <el-empty v-else description="暂无预警信息" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getWarningStudents } from '../../api/student'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const hasWarning = ref(false)
const warnings = ref([])

const fetchWarningInfo = async () => {
  try {
    const response = await getWarningStudents()
    const studentWarnings = response.filter(student => student.id === userStore.userInfo.id)
    hasWarning.value = studentWarnings.length > 0
    
    if (hasWarning.value) {
      warnings.value = studentWarnings[0].warnings.map(warning => {
        // 根据预警类型设置不同的显示样式
        let warningType = 'warning'
        let typeLabel = ''
        
        // 根据预警类型代码获取对应的标签和类型
        switch(warning.type) {
          case 'COURSE_GRADE':
            warningType = 'danger'
            typeLabel = '单科成绩预警'
            break
          case 'MULTIPLE_FAIL':
            warningType = 'warning'
            typeLabel = '多科不及格预警'
            break
          case 'SEMESTER_AVERAGE':
            warningType = 'info'
            typeLabel = '学期平均分预警'
            break
          case 'SEVERE':
            warningType = 'danger'
            typeLabel = '严重学业危机预警'
            break
          default:
            typeLabel = warning.type
        }
        
        return {
          title: typeLabel,
          type: warningType,
          description: warning.description || warning.content
        }
      })
    }
  } catch (error) {
    ElMessage.error('获取预警信息失败')
  }
}

onMounted(() => {
  fetchWarningInfo()
})
</script>

<style scoped>
.warning-info {
  padding: 20px;
}

.warning-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warning-item {
  margin-bottom: 16px;
}
</style> 
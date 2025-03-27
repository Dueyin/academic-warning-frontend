<template>
  <div class="teacher-dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>我的班级</span>
              <el-tag type="primary">{{ headOfClasses.length }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-empty v-if="headOfClasses.length === 0" description="暂无班级数据" />
            <div v-else>
              <div v-for="(classItem, index) in headOfClasses" :key="index" class="class-item">
                <div class="class-name">{{ classItem.name }}</div>
                <div class="class-info">
                  <span>{{ classItem.year }}年级</span>
                  <el-tag size="small">{{ classItem.studentCount }}人</el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>预警统计</span>
              <el-tag type="danger">{{ warningCount }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <el-empty v-if="warningCount === 0" description="暂无预警数据" />
            <div v-else class="warning-stats">
              <div class="warning-item">
                <div class="warning-label">考勤预警</div>
                <div class="warning-value">{{ attendanceWarningCount }}</div>
              </div>
              <div class="warning-item">
                <div class="warning-label">成绩预警</div>
                <div class="warning-value">{{ gradeWarningCount }}</div>
              </div>
              <div class="warning-item">
                <div class="warning-label">行为预警</div>
                <div class="warning-value">{{ behaviorWarningCount }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>工作日程</span>
              <el-button text @click="refreshSchedule">刷新</el-button>
            </div>
          </template>
          <div class="card-content">
            <el-calendar v-model="currentDate" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getTeacherById } from '../../api/teacher'
import { getWarningStudents } from '../../api/student'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const headOfClasses = ref([])
const warningCount = ref(0)
const attendanceWarningCount = ref(0)
const gradeWarningCount = ref(0)
const behaviorWarningCount = ref(0)
const currentDate = ref(new Date())

const fetchTeacherInfo = async () => {
  try {
    const response = await getTeacherById(userStore.userInfo.id)
    headOfClasses.value = response.headOfClasses || []
  } catch (error) {
    ElMessage.error('获取教师信息失败')
  }
}

const fetchWarningInfo = async () => {
  try {
    const response = await getWarningStudents()
    
    // 过滤出当前教师管理的班级的学生预警
    const classIds = headOfClasses.value.map(c => c.id)
    const relevantWarnings = response.filter(student => 
      classIds.includes(student.classGroupId) && student.hasWarning
    )
    
    warningCount.value = relevantWarnings.length
    
    // 统计不同类型的预警
    attendanceWarningCount.value = 0
    gradeWarningCount.value = 0
    behaviorWarningCount.value = 0
    
    relevantWarnings.forEach(student => {
      if (student.warnings) {
        student.warnings.forEach(warning => {
          if (warning.type === 'ATTENDANCE') {
            attendanceWarningCount.value++
          } else if (warning.type === 'GRADE') {
            gradeWarningCount.value++
          } else if (warning.type === 'BEHAVIOR') {
            behaviorWarningCount.value++
          }
        })
      }
    })
  } catch (error) {
    ElMessage.error('获取预警信息失败')
  }
}

const refreshSchedule = () => {
  ElMessage.success('日程已更新')
}

onMounted(async () => {
  await fetchTeacherInfo()
  fetchWarningInfo()
})
</script>

<style scoped>
.teacher-dashboard {
  padding: 20px 0;
}

.dashboard-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  min-height: 200px;
}

.class-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.class-item:last-child {
  border-bottom: none;
}

.class-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.class-info {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 14px;
}

.warning-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.warning-item {
  width: 30%;
  text-align: center;
  margin: 10px 0;
}

.warning-label {
  color: #909399;
  font-size: 14px;
  margin-bottom: 5px;
}

.warning-value {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}
</style> 
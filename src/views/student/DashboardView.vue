<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <!-- 预警信息卡片 -->
      <el-col :span="8">
        <el-card class="warning-card">
          <template #header>
            <div class="card-header">
              <span>预警信息</span>
              <el-tag :type="warningCount > 0 ? 'danger' : 'success'">
                {{ warningCount }} 条
              </el-tag>
            </div>
          </template>
          <div class="warning-list">
            <el-empty v-if="warningCount === 0" description="暂无预警信息" />
            <div v-else class="warning-item" v-for="warning in warnings" :key="warning.id">
              <el-icon class="warning-icon"><Warning /></el-icon>
              <div class="warning-content">
                <h4>{{ warning.title }}</h4>
                <p>{{ warning.content }}</p>
                <span class="warning-time">{{ warning.createTime }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 成绩概览卡片 -->
      <el-col :span="16">
        <el-card class="grade-card">
          <template #header>
            <div class="card-header">
              <span>成绩概览</span>
              <el-select v-model="currentSemester" placeholder="选择学期">
                <el-option
                  v-for="item in semesters"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </template>
          <div class="grade-overview">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grade-stat">
                  <div class="stat-value">{{ averageScore }}</div>
                  <div class="stat-label">平均分</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grade-stat">
                  <div class="stat-value">{{ passRate }}%</div>
                  <div class="stat-label">及格率</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grade-stat">
                  <div class="stat-value">{{ courseCount }}</div>
                  <div class="stat-label">课程数</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 成绩趋势图 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>成绩趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder">成绩趋势图表</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Warning } from '@element-plus/icons-vue'

// 模拟数据
const warningCount = ref(2)
const warnings = ref([
  {
    id: 1,
    title: '高等数学成绩预警',
    content: '您的期中考试成绩低于班级平均分，请注意加强学习',
    createTime: '2024-03-25 10:00'
  },
  {
    id: 2,
    title: '英语四级预警',
    content: '距离英语四级考试还有30天，请及时准备',
    createTime: '2024-03-24 15:30'
  }
])

const currentSemester = ref('2023-2')
const semesters = ref([
  { label: '2023-2024学年第二学期', value: '2023-2' },
  { label: '2023-2024学年第一学期', value: '2023-1' }
])

// 成绩统计数据
const averageScore = ref(85)
const passRate = ref(95)
const courseCount = ref(8)

onMounted(() => {
  // 这里可以调用API获取实际数据
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-card {
  height: 400px;
}

.warning-list {
  height: 300px;
  overflow-y: auto;
}

.warning-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.warning-item:last-child {
  border-bottom: none;
}

.warning-icon {
  font-size: 24px;
  color: #f56c6c;
  margin-right: 15px;
}

.warning-content {
  flex: 1;
}

.warning-content h4 {
  margin: 0 0 5px 0;
  color: #303133;
}

.warning-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.warning-time {
  font-size: 12px;
  color: #909399;
}

.grade-overview {
  padding: 20px 0;
}

.grade-stat {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.chart-container {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  color: #909399;
  font-size: 16px;
}
</style> 
<template>
  <div class="dashboard-container">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalStudents }}</div>
              <div class="stat-label">学生总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalWarnings }}</div>
              <div class="stat-label">预警总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><Finished /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.resolvedWarnings }}</div>
              <div class="stat-label">已解决预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><School /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalCourses }}</div>
              <div class="stat-label">课程数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预警类型分布</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder">预警类型饼图</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预警趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder">预警趋势折线图</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近预警列表 -->
    <el-card shadow="hover" class="recent-warnings-card">
      <template #header>
        <div class="card-header">
          <span>最近预警</span>
          <el-button type="primary" size="small" @click="handleViewAll">
            查看全部
          </el-button>
        </div>
      </template>
      
      <el-table :data="recentWarnings" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="studentNumber" label="学号" width="120" />
        <el-table-column prop="title" label="预警标题" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'RESOLVED' ? 'success' : 'danger'">
              {{ scope.row.status === 'RESOLVED' ? '已解决' : '未解决' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Warning, Finished, School } from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const statistics = ref({
  totalStudents: 1256,
  totalWarnings: 78,
  resolvedWarnings: 43,
  totalCourses: 145
})

// 最近预警数据
const recentWarnings = ref([
  {
    id: 1,
    studentName: '李明',
    studentNumber: '20240101',
    title: '期中考试成绩低于60分预警',
    createTime: '2024-03-25 10:30',
    status: 'PENDING'
  },
  {
    id: 2,
    studentName: '王芳',
    studentNumber: '20240102',
    title: '连续两周缺勤预警',
    createTime: '2024-03-24 14:20',
    status: 'RESOLVED'
  },
  {
    id: 3,
    studentName: '张伟',
    studentNumber: '20240103',
    title: '综合成绩排名下降预警',
    createTime: '2024-03-24 09:15',
    status: 'PENDING'
  },
  {
    id: 4,
    studentName: '刘洋',
    studentNumber: '20240104',
    title: '挂科数量超过2门预警',
    createTime: '2024-03-23 16:45',
    status: 'PENDING'
  },
  {
    id: 5,
    studentName: '赵敏',
    studentNumber: '20240105',
    title: '学业成绩连续两学期下降预警',
    createTime: '2024-03-23 11:30',
    status: 'RESOLVED'
  }
])

// 查看全部预警
const handleViewAll = () => {
  router.push('/admin/warnings')
}

// 查看预警详情
const handleDetail = (row) => {
  router.push(`/admin/warnings/${row.id}`)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.stat-icon {
  font-size: 48px;
  color: #409EFF;
  margin-right: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  color: #909399;
  font-size: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-warnings-card {
  margin-bottom: 20px;
}
</style> 
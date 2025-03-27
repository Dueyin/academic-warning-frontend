<template>
  <div class="dashboard-container" v-loading="loading">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon"><User /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalStudents || 0 }}</div>
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
              <div class="stat-value">{{ statistics.totalWarnings || 0 }}</div>
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
              <div class="stat-value">{{ statistics.resolvedWarnings || 0 }}</div>
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
              <div class="stat-value">{{ statistics.totalCourses || 0 }}</div>
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
          <div class="chart-container" v-loading="chartsLoading">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder" v-if="!chartData.warningTypes">预警类型饼图</div>
            <div v-else>
              <!-- 未来可以替换为真实图表 -->
              <pre>{{ chartData.warningTypes }}</pre>
            </div>
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
          <div class="chart-container" v-loading="chartsLoading">
            <!-- 这里可以集成 ECharts 等图表库 -->
            <div class="chart-placeholder" v-if="!chartData.warningTrends">预警趋势折线图</div>
            <div v-else>
              <!-- 未来可以替换为真实图表 -->
              <pre>{{ chartData.warningTrends }}</pre>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近预警列表 -->
    <el-card shadow="hover" class="recent-warnings-card">
      <template #header>
        <div class="card-header">
          <span>最近预警</span>
          <el-button-group>
            <el-button type="primary" size="small" @click="refreshData">
              <el-icon><Refresh /></el-icon> 刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleViewAll">
              查看全部
            </el-button>
          </el-button-group>
        </div>
      </template>
      
      <el-table :data="recentWarnings" style="width: 100%" v-loading="warningsLoading">
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
      
      <div v-if="recentWarnings.length === 0 && !warningsLoading" class="empty-data">
        <el-empty description="暂无预警数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Warning, Finished, School, Refresh } from '@element-plus/icons-vue'
import { getDashboardStatistics } from '../../api/statistics'
import { getWarningTypeDistribution, getWarningTrends } from '../../api/statistics'
import { getRecentWarnings } from '../../api/warnings'

const router = useRouter()

// 加载状态
const loading = ref(false)
const chartsLoading = ref(false)
const warningsLoading = ref(false)

// 统计数据
const statistics = ref({
  totalStudents: 0,
  totalWarnings: 0,
  resolvedWarnings: 0,
  totalCourses: 0
})

// 图表数据
const chartData = ref({
  warningTypes: null,
  warningTrends: null
})

// 最近预警数据
const recentWarnings = ref([])

// 获取仪表盘统计数据
const fetchDashboardStatistics = async () => {
  try {
    loading.value = true
    const response = await getDashboardStatistics()
    
    console.log('获取到仪表盘统计数据:', response)
    
    // 设置统计数据
    statistics.value = {
      totalStudents: response.totalStudents || 0,
      totalWarnings: response.totalWarnings || 0,
      resolvedWarnings: response.resolvedWarnings || 0,
      totalCourses: response.totalCourses || 0
    }
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error)
    ElMessage.error('获取统计数据失败，请稍后重试')
    
    // 设置默认值以防API调用失败
    statistics.value = {
      totalStudents: 0,
      totalWarnings: 0,
      resolvedWarnings: 0,
      totalCourses: 0
    }
  } finally {
    loading.value = false
  }
}

// 获取图表数据
const fetchChartData = async () => {
  try {
    chartsLoading.value = true
    
    // 获取预警类型分布
    const typeDistribution = await getWarningTypeDistribution()
    chartData.value.warningTypes = typeDistribution
    
    // 获取预警趋势
    const trends = await getWarningTrends({
      period: 'MONTHLY',
      months: 6
    })
    chartData.value.warningTrends = trends
    
    console.log('获取到图表数据:', chartData.value)
  } catch (error) {
    console.error('获取图表数据失败:', error)
    ElMessage.warning('获取图表数据失败，将显示默认图表')
  } finally {
    chartsLoading.value = false
  }
}

// 获取最近预警
const fetchRecentWarnings = async () => {
  try {
    warningsLoading.value = true
    const warnings = await getRecentWarnings(5)
    
    console.log('获取到最近预警:', warnings)
    recentWarnings.value = warnings || []
  } catch (error) {
    console.error('获取最近预警失败:', error)
    ElMessage.error('获取预警数据失败，请稍后重试')
    recentWarnings.value = []
  } finally {
    warningsLoading.value = false
  }
}

// 刷新所有数据
const refreshData = async () => {
  await Promise.all([
    fetchDashboardStatistics(),
    fetchChartData(),
    fetchRecentWarnings()
  ])
  
  ElMessage.success('数据已刷新')
}

// 查看全部预警
const handleViewAll = () => {
  router.push('/admin/warnings')
}

// 查看预警详情
const handleDetail = (row) => {
  router.push(`/admin/warnings/${row.id}`)
}

// 页面加载时获取数据
onMounted(() => {
  refreshData()
})
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

.empty-data {
  padding: 30px 0;
}
</style> 
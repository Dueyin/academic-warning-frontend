<template>
  <div class="warnings-container">
    <!-- 预警统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :class="{ warning: stats.totalWarnings > 0 }"><Warning /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalWarnings }}</div>
              <div class="stat-label">全部预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon warning"><Bell /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingWarnings }}</div>
              <div class="stat-label">未解决预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon success"><CircleCheck /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.resolvedWarnings }}</div>
              <div class="stat-label">已解决预警</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 预警过滤条件 -->
    <el-card class="filter-card">
      <template #header>
        <div class="card-header">
          <span>预警列表</span>
        </div>
      </template>
      
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="预警类型">
          <el-select v-model="filterForm.warningType" placeholder="请选择预警类型" clearable>
            <el-option
              v-for="item in warningTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="预警状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            查询
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 预警列表 -->
    <div class="warning-list">
      <el-empty v-if="warningList.length === 0" description="暂无预警信息" />
      
      <el-card
        v-for="warning in warningList"
        :key="warning.id"
        class="warning-card"
        :class="{'warning-resolved': warning.status === 'RESOLVED'}"
        shadow="hover"
      >
        <div class="warning-header">
          <div class="warning-title">
            <el-tag :type="getWarningTypeTag(warning.warningType)" class="warning-type-tag">
              {{ getWarningTypeLabel(warning.warningType) }}
            </el-tag>
            <span class="warning-text">{{ warning.title }}</span>
          </div>
          <div class="warning-level">
            <el-tag :type="getWarningLevelTag(warning.level)" size="small">
              {{ getWarningLevelLabel(warning.level) }}
            </el-tag>
          </div>
        </div>
        
        <div class="warning-content">{{ warning.content }}</div>
        
        <div class="warning-footer">
          <div class="warning-time">{{ warning.createTime }}</div>
          <div class="warning-actions">
            <el-button type="primary" link @click="handleViewDetail(warning)">
              查看详情
            </el-button>
            <el-tag v-if="warning.status === 'RESOLVED'" type="success">已解决</el-tag>
            <el-tag v-else type="danger">未解决</el-tag>
          </div>
        </div>
      </el-card>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 预警详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="预警详情"
      size="50%"
    >
      <template #default>
        <div class="warning-detail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="预警ID">{{ currentWarning.id }}</el-descriptions-item>
            <el-descriptions-item label="预警标题">{{ currentWarning.title }}</el-descriptions-item>
            <el-descriptions-item label="预警类型">
              <el-tag :type="getWarningTypeTag(currentWarning.warningType)">
                {{ getWarningTypeLabel(currentWarning.warningType) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="预警等级">
              <el-tag :type="getWarningLevelTag(currentWarning.level)">
                {{ getWarningLevelLabel(currentWarning.level) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentWarning.createTime }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="currentWarning.status === 'RESOLVED' ? 'success' : 'danger'">
                {{ currentWarning.status === 'RESOLVED' ? '已解决' : '未解决' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="预警内容">
              <div class="warning-detail-content">{{ currentWarning.content }}</div>
            </el-descriptions-item>
            <el-descriptions-item v-if="currentWarning.status === 'RESOLVED'" label="解决方案">
              <div class="warning-detail-solution">{{ currentWarning.solution }}</div>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="detail-actions" v-if="currentWarning.status === 'PENDING'">
            <el-alert
              title="请联系你的辅导员或相关教师获取帮助"
              type="warning"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Warning, Bell, CircleCheck } from '@element-plus/icons-vue'

// 预警统计
const stats = reactive({
  totalWarnings: 4,
  pendingWarnings: 2,
  resolvedWarnings: 2
})

// 筛选表单
const filterForm = reactive({
  warningType: '',
  status: '',
  dateRange: []
})

// 预警类型选项
const warningTypes = ref([
  { label: '成绩预警', value: 'GRADE' },
  { label: '考勤预警', value: 'ATTENDANCE' },
  { label: '行为预警', value: 'BEHAVIOR' },
  { label: '综合预警', value: 'COMPREHENSIVE' }
])

// 状态选项
const statusOptions = ref([
  { label: '未解决', value: 'PENDING' },
  { label: '已解决', value: 'RESOLVED' }
])

// 预警等级选项
const warningLevels = ref([
  { label: '轻度', value: 'LOW' },
  { label: '中度', value: 'MEDIUM' },
  { label: '严重', value: 'HIGH' }
])

// 预警列表数据
const warningList = ref([
  {
    id: 1,
    title: '期中考试成绩低于60分预警',
    warningType: 'GRADE',
    level: 'MEDIUM',
    content: '您在高等数学期中考试中得分55分，低于及格线。建议加强学习，多做练习题，有问题可以向任课教师或辅导员寻求帮助。',
    createTime: '2024-03-25 10:30',
    status: 'PENDING'
  },
  {
    id: 2,
    title: '连续两周缺勤预警',
    warningType: 'ATTENDANCE',
    level: 'HIGH',
    content: '您在过去两周连续缺席四次课程，可能影响学习效果和成绩。请及时与辅导员联系，说明情况。',
    createTime: '2024-03-20 14:20',
    status: 'RESOLVED',
    solution: '学生已提交请假申请，因家中有事暂时请假，已准假。'
  },
  {
    id: 3,
    title: '期末考试预警',
    warningType: 'GRADE',
    level: 'LOW',
    content: '根据您的平时成绩和课堂表现，可能存在期末考试不及格的风险。建议提前复习，合理规划时间。',
    createTime: '2024-03-15 09:15',
    status: 'PENDING'
  },
  {
    id: 4,
    title: '学业成绩下降预警',
    warningType: 'COMPREHENSIVE',
    level: 'MEDIUM',
    content: '您的学业成绩较上学期有所下降，建议调整学习方法，合理安排学习时间。',
    createTime: '2024-03-10 11:30',
    status: 'RESOLVED',
    solution: '学生已与任课教师沟通，制定了学习计划，成绩有所提升。'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 预警详情抽屉
const drawerVisible = ref(false)
const currentWarning = ref({})

// 获取预警类型标签样式
const getWarningTypeTag = (type) => {
  const map = {
    GRADE: 'danger',
    ATTENDANCE: 'warning',
    BEHAVIOR: 'info',
    COMPREHENSIVE: 'primary'
  }
  return map[type] || 'info'
}

// 获取预警类型显示文本
const getWarningTypeLabel = (type) => {
  const map = {
    GRADE: '成绩预警',
    ATTENDANCE: '考勤预警',
    BEHAVIOR: '行为预警',
    COMPREHENSIVE: '综合预警'
  }
  return map[type] || type
}

// 获取预警等级标签样式
const getWarningLevelTag = (level) => {
  const map = {
    LOW: 'info',
    MEDIUM: 'warning',
    HIGH: 'danger'
  }
  return map[level] || 'info'
}

// 获取预警等级显示文本
const getWarningLevelLabel = (level) => {
  const map = {
    LOW: '轻度',
    MEDIUM: '中度',
    HIGH: '严重'
  }
  return map[level] || level
}

// 搜索
const handleSearch = () => {
  console.log('搜索条件：', filterForm)
  // 这里调用API获取数据
}

// 重置搜索条件
const handleReset = () => {
  filterForm.warningType = ''
  filterForm.status = ''
  filterForm.dateRange = []
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 查看预警详情
const handleViewDetail = (warning) => {
  currentWarning.value = { ...warning }
  drawerVisible.value = true
}
</script>

<style scoped>
.warnings-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
  color: #909399;
}

.stat-icon.warning {
  color: #F56C6C;
}

.stat-icon.success {
  color: #67C23A;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.filter-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-list {
  margin-top: 20px;
}

.warning-card {
  margin-bottom: 15px;
  transition: all 0.3s;
}

.warning-card:hover {
  transform: translateY(-3px);
}

.warning-resolved {
  opacity: 0.8;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.warning-title {
  display: flex;
  align-items: center;
}

.warning-type-tag {
  margin-right: 10px;
}

.warning-text {
  font-weight: bold;
  color: #303133;
}

.warning-content {
  color: #606266;
  margin: 10px 0;
  line-height: 1.6;
}

.warning-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: #909399;
}

.warning-time {
  font-size: 13px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.warning-detail {
  padding: 20px;
}

.warning-detail-content,
.warning-detail-solution {
  white-space: pre-line;
  line-height: 1.6;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.detail-actions {
  margin-top: 20px;
}
</style> 
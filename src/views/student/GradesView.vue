<template>
  <div class="grades-container">
    <!-- 筛选条件 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="学期">
          <el-select v-model="filterForm.semester" placeholder="请选择学期">
            <el-option
              v-for="item in semesters"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="课程类型">
          <el-select v-model="filterForm.courseType" placeholder="请选择课程类型">
            <el-option
              v-for="item in courseTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

    <!-- 成绩统计卡片 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :span="6" v-for="stat in gradeStats" :key="stat.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 成绩表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>成绩列表</span>
          <el-button type="primary" @click="handleExport">
            导出成绩单
          </el-button>
        </div>
      </template>

      <el-table
        :data="gradeList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="courseCode" label="课程代码" width="120" />
        <el-table-column prop="courseName" label="课程名称" min-width="200" />
        <el-table-column prop="courseType" label="课程类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getCourseTypeTag(row.courseType)">
              {{ getCourseTypeLabel(row.courseType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column prop="score" label="成绩" width="100">
          <template #default="{ row }">
            <span :class="getScoreClass(row.score)">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gradePoint" label="绩点" width="100" />
        <el-table-column prop="teacher" label="授课教师" width="120" />
        <el-table-column prop="examTime" label="考试时间" width="180" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 筛选表单
const filterForm = reactive({
  semester: '',
  courseType: ''
})

// 学期选项
const semesters = ref([
  { label: '2023-2024学年第二学期', value: '2023-2' },
  { label: '2023-2024学年第一学期', value: '2023-1' }
])

// 课程类型选项
const courseTypes = ref([
  { label: '必修课', value: 'REQUIRED' },
  { label: '选修课', value: 'ELECTIVE' }
])

// 成绩统计数据
const gradeStats = ref([
  { label: '平均分', value: '85.5' },
  { label: '总学分', value: '24' },
  { label: '平均绩点', value: '3.8' },
  { label: '课程数', value: '8' }
])

// 成绩列表数据
const gradeList = ref([
  {
    courseCode: 'CS101',
    courseName: '计算机导论',
    courseType: 'REQUIRED',
    credit: 3,
    score: 92,
    gradePoint: 4.0,
    teacher: '张老师',
    examTime: '2024-01-15 09:00'
  },
  {
    courseCode: 'CS102',
    courseName: '程序设计基础',
    courseType: 'REQUIRED',
    credit: 4,
    score: 88,
    gradePoint: 3.7,
    teacher: '李老师',
    examTime: '2024-01-18 14:00'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 获取课程类型标签样式
const getCourseTypeTag = (type) => {
  return type === 'REQUIRED' ? 'danger' : 'success'
}

// 获取课程类型显示文本
const getCourseTypeLabel = (type) => {
  return type === 'REQUIRED' ? '必修课' : '选修课'
}

// 获取成绩样式
const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

// 查询
const handleSearch = () => {
  // 这里调用查询API
  console.log('查询条件：', filterForm)
}

// 重置
const handleReset = () => {
  filterForm.semester = ''
  filterForm.courseType = ''
  handleSearch()
}

// 导出成绩单
const handleExport = () => {
  ElMessage.success('成绩单导出成功')
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
</script>

<style scoped>
.grades-container {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.stat-card {
  height: 100px;
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.table-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.score-excellent {
  color: #67c23a;
  font-weight: bold;
}

.score-good {
  color: #409EFF;
  font-weight: bold;
}

.score-pass {
  color: #e6a23c;
  font-weight: bold;
}

.score-fail {
  color: #f56c6c;
  font-weight: bold;
}
</style> 
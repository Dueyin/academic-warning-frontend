<template>
  <div class="warnings-container">
    <!-- 搜索过滤区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="学号">
          <el-input v-model="filterForm.studentNumber" placeholder="请输入学号" clearable />
        </el-form-item>
        
        <el-form-item label="姓名">
          <el-input v-model="filterForm.studentName" placeholder="请输入姓名" clearable />
        </el-form-item>
        
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
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建时间">
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
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>预警列表</span>
          <div>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增预警
            </el-button>
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        :data="warningList"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="studentName" label="学生姓名" width="100" />
        <el-table-column prop="studentNumber" label="学号" width="120" />
        <el-table-column prop="title" label="预警标题" min-width="200" />
        <el-table-column prop="warningType" label="预警类型" width="120">
          <template #default="scope">
            <el-tag :type="getWarningTypeTag(scope.row.warningType)">
              {{ getWarningTypeLabel(scope.row.warningType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="scope">
            <el-tag :type="getWarningLevelTag(scope.row.level)">
              {{ getWarningLevelLabel(scope.row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'RESOLVED' ? 'success' : 'danger'">
              {{ scope.row.status === 'RESOLVED' ? '已解决' : '未解决' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="handleResolve(scope.row)"
              v-if="scope.row.status !== 'RESOLVED'"
            >
              解决
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
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
            <el-descriptions-item label="学生姓名">{{ currentWarning.studentName }}</el-descriptions-item>
            <el-descriptions-item label="学号">{{ currentWarning.studentNumber }}</el-descriptions-item>
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
              <div class="warning-content">{{ currentWarning.content }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="解决方案" v-if="currentWarning.status === 'RESOLVED'">
              <div class="warning-solution">{{ currentWarning.solution }}</div>
            </el-descriptions-item>
          </el-descriptions>
          
          <div class="action-buttons" v-if="currentWarning.status !== 'RESOLVED'">
            <el-button type="primary" @click="handleResolveInDrawer">标记为已解决</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
    
    <!-- 新增/解决预警对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增预警' : '解决预警'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <template v-if="dialogType === 'add'">
          <el-form-item label="学生" prop="studentId">
            <el-select
              v-model="form.studentId"
              placeholder="请选择学生"
              filterable
              remote
              :remote-method="remoteStudentSearch"
              :loading="studentLoading"
              style="width: 100%"
            >
              <el-option
                v-for="item in studentOptions"
                :key="item.id"
                :label="`${item.name} (${item.studentNumber})`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="预警标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入预警标题" />
          </el-form-item>
          
          <el-form-item label="预警类型" prop="warningType">
            <el-select v-model="form.warningType" placeholder="请选择预警类型" style="width: 100%">
              <el-option
                v-for="item in warningTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="预警等级" prop="level">
            <el-select v-model="form.level" placeholder="请选择预警等级" style="width: 100%">
              <el-option
                v-for="item in warningLevels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="预警内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="4"
              placeholder="请输入预警内容"
            />
          </el-form-item>
        </template>
        
        <template v-else>
          <el-form-item label="解决方案" prop="solution">
            <el-input
              v-model="form.solution"
              type="textarea"
              :rows="4"
              placeholder="请输入解决方案"
            />
          </el-form-item>
        </template>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = reactive({
  studentNumber: '',
  studentName: '',
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

// 预警等级选项
const warningLevels = ref([
  { label: '轻度', value: 'LOW' },
  { label: '中度', value: 'MEDIUM' },
  { label: '严重', value: 'HIGH' }
])

// 状态选项
const statusOptions = ref([
  { label: '未解决', value: 'PENDING' },
  { label: '已解决', value: 'RESOLVED' }
])

// 表格数据
const loading = ref(false)
const warningList = ref([
  {
    id: 1,
    studentName: '李明',
    studentNumber: '20240101',
    title: '期中考试成绩低于60分预警',
    warningType: 'GRADE',
    level: 'MEDIUM',
    content: '学生在高等数学期中考试中得分55分，低于及格线。建议加强辅导和督促学习。',
    createTime: '2024-03-25 10:30',
    status: 'PENDING'
  },
  {
    id: 2,
    studentName: '王芳',
    studentNumber: '20240102',
    title: '连续两周缺勤预警',
    warningType: 'ATTENDANCE',
    level: 'HIGH',
    content: '学生在过去两周连续缺席四次课程，可能存在学习态度问题，建议及时干预。',
    createTime: '2024-03-24 14:20',
    status: 'RESOLVED',
    solution: '已与学生沟通，学生因家庭原因暂时请假，已补交请假条。'
  },
  {
    id: 3,
    studentName: '张伟',
    studentNumber: '20240103',
    title: '综合成绩排名下降预警',
    warningType: 'COMPREHENSIVE',
    level: 'LOW',
    content: '学生综合成绩排名从上学期的前20%下降到当前的前40%，建议关注。',
    createTime: '2024-03-24 09:15',
    status: 'PENDING'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 预警详情抽屉
const drawerVisible = ref(false)
const currentWarning = ref({})

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'resolve'
const formRef = ref(null)
const form = reactive({
  studentId: '',
  title: '',
  warningType: '',
  level: '',
  content: '',
  solution: ''
})

// 学生选择
const studentLoading = ref(false)
const studentOptions = ref([
  { id: 1, name: '李明', studentNumber: '20240101' },
  { id: 2, name: '王芳', studentNumber: '20240102' },
  { id: 3, name: '张伟', studentNumber: '20240103' }
])

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请选择学生', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入预警标题', trigger: 'blur' }
  ],
  warningType: [
    { required: true, message: '请选择预警类型', trigger: 'change' }
  ],
  level: [
    { required: true, message: '请选择预警等级', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入预警内容', trigger: 'blur' }
  ],
  solution: [
    { required: true, message: '请输入解决方案', trigger: 'blur' }
  ]
}

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
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索条件
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = key === 'dateRange' ? [] : ''
  })
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

// 查看详情
const handleDetail = (row) => {
  currentWarning.value = { ...row }
  drawerVisible.value = true
}

// 新增预警
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
}

// 解决预警
const handleResolve = (row) => {
  dialogType.value = 'resolve'
  dialogVisible.value = true
  currentWarning.value = { ...row }
  form.solution = ''
}

// 抽屉中解决预警
const handleResolveInDrawer = () => {
  dialogType.value = 'resolve'
  dialogVisible.value = true
  form.solution = ''
}

// 删除预警
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除 "${row.title}" 预警吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // 调用删除API
      ElMessage.success('删除成功')
      handleSearch()
    })
    .catch(() => {
      // 取消删除
    })
}

// 导出预警
const handleExport = () => {
  ElMessage.success('预警数据导出成功')
}

// 远程搜索学生
const remoteStudentSearch = (query) => {
  if (query) {
    studentLoading.value = true
    setTimeout(() => {
      studentLoading.value = false
    }, 500)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 新增预警
        console.log('新增预警：', form)
        ElMessage.success('新增预警成功')
      } else {
        // 解决预警
        console.log('解决预警：', form)
        ElMessage.success('预警已标记为已解决')
      }
      dialogVisible.value = false
      drawerVisible.value = false
      handleSearch()
    }
  })
}
</script>

<style scoped>
.warnings-container {
  padding: 20px;
}

.filter-card,
.table-card {
  margin-bottom: 20px;
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

.warning-detail {
  padding: 20px;
}

.warning-content,
.warning-solution {
  white-space: pre-line;
  line-height: 1.6;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 
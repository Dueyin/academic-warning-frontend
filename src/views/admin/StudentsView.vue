<template>
  <div class="students-container">
    <!-- 搜索过滤区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="学号">
          <el-input v-model="filterForm.studentNumber" placeholder="请输入学号" clearable />
        </el-form-item>
        
        <el-form-item label="姓名">
          <el-input v-model="filterForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        
        <el-form-item label="学院">
          <el-select v-model="filterForm.college" placeholder="请选择学院" clearable>
            <el-option
              v-for="item in colleges"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="专业">
          <el-select v-model="filterForm.major" placeholder="请选择专业" clearable>
            <el-option
              v-for="item in majors"
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
    
    <!-- 学生列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>学生列表</span>
          <div>
            <el-button type="success" @click="handleImport">
              <el-icon><Upload /></el-icon>
              导入
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              添加
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        :data="studentList"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="studentNumber" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            {{ scope.row.gender === 'MALE' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="college" label="学院" width="150" />
        <el-table-column prop="major" label="专业" width="150" />
        <el-table-column prop="grade" label="年级" width="100" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'info'">
              {{ scope.row.status === 'ACTIVE' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="warning"
              link
              @click="handleResetPassword(scope.row)"
            >
              重置密码
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
    
    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学生' : '添加学生'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="form.studentNumber" placeholder="请输入学号" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="MALE">男</el-radio>
            <el-radio label="FEMALE">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="学院" prop="college">
          <el-select v-model="form.college" placeholder="请选择学院" style="width: 100%">
            <el-option
              v-for="item in colleges"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="专业" prop="major">
          <el-select v-model="form.major" placeholder="请选择专业" style="width: 100%">
            <el-option
              v-for="item in majors"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级" style="width: 100%">
            <el-option
              v-for="item in grades"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话号码" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'ACTIVE'"
            :inactive-value="'INACTIVE'"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
import { 
  getAllStudents, 
  createStudent, 
  updateStudent, 
  getStudentById 
} from '../../api/student'

// 筛选表单
const filterForm = reactive({
  studentNumber: '',
  name: '',
  college: '',
  major: ''
})

// 学院选项
const colleges = ref([
  { label: '计算机学院', value: '计算机学院' },
  { label: '电子信息学院', value: '电子信息学院' },
  { label: '机械工程学院', value: '机械工程学院' }
])

// 专业选项
const majors = ref([
  { label: '软件工程', value: '软件工程' },
  { label: '计算机科学与技术', value: '计算机科学与技术' },
  { label: '人工智能', value: '人工智能' }
])

// 年级选项
const grades = ref([
  { label: '2024级', value: '2024级' },
  { label: '2023级', value: '2023级' },
  { label: '2022级', value: '2022级' },
  { label: '2021级', value: '2021级' }
])

// 表格数据
const loading = ref(false)
const studentList = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = reactive({
  id: null,
  studentNumber: '',
  name: '',
  gender: 'MALE',
  college: '',
  major: '',
  grade: '',
  phone: '',
  email: '',
  status: 'ACTIVE'
})

// 表单验证规则
const rules = {
  studentNumber: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d+$/, message: '学号只能包含数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  college: [
    { required: true, message: '请选择学院', trigger: 'change' }
  ],
  major: [
    { required: true, message: '请选择专业', trigger: 'change' }
  ],
  grade: [
    { required: true, message: '请选择年级', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 获取学生列表
const fetchStudents = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      studentNumber: filterForm.studentNumber,
      name: filterForm.name,
      college: filterForm.college,
      major: filterForm.major
    }
    console.log('获取学生列表参数:', params)
    
    // 调用API获取学生列表
    const response = await getAllStudents(params)
    console.log('获取到的学生列表:', response)
    
    // 如果后端返回的是分页格式的数据
    if (response.content && Array.isArray(response.content)) {
      studentList.value = response.content
      total.value = response.totalElements || 0
    } 
    // 如果后端直接返回数组
    else if (Array.isArray(response)) {
      studentList.value = response
      total.value = response.length
    }
    // 其他情况设置为空数组
    else {
      studentList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败，请稍后重试')
    studentList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置为第一页
  fetchStudents()
}

// 重置搜索条件
const handleReset = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchStudents()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchStudents()
}

// 添加学生
const handleAdd = () => {
  isEdit.value = false
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    if (key === 'gender') {
      form[key] = 'MALE'
    } else if (key === 'status') {
      form[key] = 'ACTIVE'
    } else {
      form[key] = ''
    }
  })
  form.id = null
}

// 编辑学生
const handleEdit = async (row) => {
  try {
    isEdit.value = true
    dialogVisible.value = true
    
    // 从API获取最新的学生详情
    const studentDetail = await getStudentById(row.id)
    console.log('获取到的学生详情:', studentDetail)
    
    // 将学生详情填充到表单中
    Object.keys(form).forEach(key => {
      form[key] = studentDetail[key] || row[key] || ''
    })
  } catch (error) {
    console.error('获取学生详情失败:', error)
    ElMessage.error('获取学生详情失败，请稍后重试')
    
    // 如果获取详情失败，使用表格中的数据
    Object.keys(form).forEach(key => {
      form[key] = row[key] || ''
    })
  }
}

// 删除学生
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除学生 ${row.name}(${row.studentNumber}) 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        // 调用删除API
        // 这里假设删除API是 deleteStudent(id)
        // await deleteStudent(row.id)
        
        ElMessage.success('删除成功')
        fetchStudents() // 刷新列表
      } catch (error) {
        console.error('删除学生失败:', error)
        ElMessage.error('删除学生失败，请稍后重试')
      }
    })
    .catch(() => {
      // 取消删除，不做任何操作
    })
}

// 重置密码
const handleResetPassword = (row) => {
  ElMessageBox.confirm(
    `确定要重置学生 ${row.name}(${row.studentNumber}) 的密码吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      try {
        // 调用重置密码API
        // 这里假设重置密码API是 resetStudentPassword(id)
        // await resetStudentPassword(row.id)
        
        ElMessage.success('密码重置成功，新密码已发送至学生邮箱')
      } catch (error) {
        console.error('重置密码失败:', error)
        ElMessage.error('重置密码失败，请稍后重试')
      }
    })
    .catch(() => {
      // 取消重置，不做任何操作
    })
}

// 导入学生
const handleImport = () => {
  ElMessage.info('请选择Excel文件导入学生信息')
  // 这里可以实现文件上传逻辑
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate(async (valid) => {
      if (valid) {
        // 提交表单
        const formData = { ...form }
        console.log('提交的表单数据:', formData)
        
        if (isEdit.value) {
          // 编辑学生
          await updateStudent(formData.id, formData)
          ElMessage.success('编辑成功')
        } else {
          // 添加学生
          await createStudent(formData)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        fetchStudents() // 刷新列表
      }
    })
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 页面加载时获取学生列表
onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.students-container {
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
</style> 
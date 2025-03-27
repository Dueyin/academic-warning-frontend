<template>
  <div class="student-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学生管理</span>
          <el-button type="primary" @click="handleAdd">添加学生</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索学生姓名或学号"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 学生列表 -->
      <el-table
        v-loading="loading"
        :data="students"
        style="width: 100%"
      >
        <el-table-column prop="studentNumber" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 'MALE' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="className" label="班级" width="150" />
        <el-table-column prop="hasWarning" label="预警状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hasWarning ? 'danger' : 'success'">
              {{ row.hasWarning ? '有预警' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button type="info" @click="handleViewDetails(row)">详情</el-button>
              <el-button type="danger" @click="handleDelete(row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加学生' : '编辑学生'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="form.studentNumber" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别">
            <el-option label="男" value="MALE" />
            <el-option label="女" value="FEMALE" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="dateOfBirth">
          <el-date-picker
            v-model="form.dateOfBirth"
            type="date"
            placeholder="选择出生日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="班级" prop="classGroupId">
          <el-select v-model="form.classGroupId" placeholder="请选择班级">
            <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" />
        </el-form-item>
        <el-form-item label="紧急电话" prop="emergencyPhone">
          <el-input v-model="form.emergencyPhone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getAllStudents, createStudent, updateStudent } from '../../api/student'

const loading = ref(false)
const students = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

const form = reactive({
  studentNumber: '',
  name: '',
  gender: '',
  dateOfBirth: '',
  classGroupId: '',
  address: '',
  emergencyContact: '',
  emergencyPhone: ''
})

const rules = {
  studentNumber: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  dateOfBirth: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  classGroupId: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  emergencyContact: [
    { required: true, message: '请输入紧急联系人', trigger: 'blur' }
  ],
  emergencyPhone: [
    { required: true, message: '请输入紧急联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const classOptions = ref([
  { id: 1, name: '计算机科学1班' },
  { id: 2, name: '计算机科学2班' },
  { id: 3, name: '软件工程1班' },
  { id: 4, name: '软件工程2班' }
])

const fetchStudents = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      search: searchQuery.value
    }
    const response = await getAllStudents(params)
    students.value = response.content
    total.value = response.totalElements
  } catch (error) {
    ElMessage.error('获取学生列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchStudents()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchStudents()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchStudents()
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(form, {
    studentNumber: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    classGroupId: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleViewDetails = (row) => {
  // TODO: 实现查看详情功能
  console.log('查看详情:', row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该学生吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 实现删除功能
      ElMessage.success('删除成功')
      fetchStudents()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          await createStudent(form)
          ElMessage.success('添加成功')
        } else {
          await updateStudent(form.id, form)
          ElMessage.success('更新成功')
        }
        dialogVisible.value = false
        fetchStudents()
      } catch (error) {
        ElMessage.error(dialogType.value === 'add' ? '添加失败' : '更新失败')
      }
    }
  })
}

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 
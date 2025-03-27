<template>
  <div class="student-info">
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit" v-if="!isEditing">编辑</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        :disabled="!isEditing"
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

        <el-form-item label="班级" prop="className">
          <el-input v-model="form.className" disabled />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>

        <el-form-item label="紧急联系人" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" />
        </el-form-item>

        <el-form-item label="紧急联系电话" prop="emergencyPhone">
          <el-input v-model="form.emergencyPhone" />
        </el-form-item>

        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStudentById, updateStudent } from '../../api/student'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const formRef = ref(null)
const isEditing = ref(false)

const form = reactive({
  studentNumber: '',
  name: '',
  gender: '',
  dateOfBirth: '',
  className: '',
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
  emergencyContact: [
    { required: true, message: '请输入紧急联系人', trigger: 'blur' }
  ],
  emergencyPhone: [
    { required: true, message: '请输入紧急联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const fetchStudentInfo = async () => {
  try {
    const response = await getStudentById(userStore.userInfo.id)
    Object.assign(form, response)
  } catch (error) {
    ElMessage.error('获取学生信息失败')
  }
}

const handleEdit = () => {
  isEditing.value = true
}

const handleCancel = () => {
  isEditing.value = false
  fetchStudentInfo()
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await updateStudent(userStore.userInfo.id, form)
        ElMessage.success('保存成功')
        isEditing.value = false
      } catch (error) {
        ElMessage.error('保存失败')
      }
    }
  })
}

onMounted(() => {
  fetchStudentInfo()
})
</script>

<style scoped>
.student-info {
  padding: 20px;
}

.info-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style> 
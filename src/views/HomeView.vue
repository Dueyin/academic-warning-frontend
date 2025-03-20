<template>
  <div class="home-view">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>用户统计</span>
            </div>
          </template>
          <div class="stat-content">
            <el-statistic title="总用户数" :value="123" />
            <div class="stat-footer">
              <el-tag type="success">活跃: 98</el-tag>
              <el-tag type="danger">禁用: 25</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>学生统计</span>
            </div>
          </template>
          <div class="stat-content">
            <el-statistic title="总学生数" :value="456" />
            <div class="stat-footer">
              <el-tag type="warning">预警: 12</el-tag>
              <el-tag type="info">正常: 444</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>教师统计</span>
            </div>
          </template>
          <div class="stat-content">
            <el-statistic title="总教师数" :value="78" />
            <div class="stat-footer">
              <el-tag type="primary">班主任: 24</el-tag>
              <el-tag type="info">任课教师: 54</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="recent-card">
      <template #header>
        <div class="card-header">
          <span>最近预警</span>
          <el-button type="text">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentWarnings" style="width: 100%">
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="studentNumber" label="学号" width="120" />
        <el-table-column prop="warningType" label="预警类型">
          <template #default="scope">
            <el-tag :type="getWarningTypeTag(scope.row.warningType)">
              {{ scope.row.warningType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="warningDate" label="预警时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已处理' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  setup() {
    const recentWarnings = [
      {
        studentName: '张三',
        studentNumber: '2021001',
        warningType: '成绩预警',
        warningDate: '2023-03-15 14:30:00',
        status: '未处理'
      },
      {
        studentName: '李四',
        studentNumber: '2021002',
        warningType: '出勤预警',
        warningDate: '2023-03-14 09:15:00',
        status: '已处理'
      },
      {
        studentName: '王五',
        studentNumber: '2021003',
        warningType: '综合预警',
        warningDate: '2023-03-13 16:45:00',
        status: '未处理'
      },
      {
        studentName: '赵六',
        studentNumber: '2021004',
        warningType: '成绩预警',
        warningDate: '2023-03-12 11:20:00',
        status: '已处理'
      }
    ]
    
    const getWarningTypeTag = (type) => {
      const map = {
        '成绩预警': 'danger',
        '出勤预警': 'warning',
        '综合预警': 'info'
      }
      return map[type] || 'info'
    }
    
    return {
      recentWarnings,
      getWarningTypeTag
    }
  }
}
</script>

<style lang="scss" scoped>
.home-view {
  .el-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    height: 100%;
    
    .stat-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .stat-footer {
        margin-top: 15px;
        display: flex;
        gap: 10px;
      }
    }
  }
  
  .recent-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 
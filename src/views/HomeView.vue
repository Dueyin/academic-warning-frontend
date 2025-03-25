<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <template #header>
            <div class="card-header">
              <h2>欢迎使用学业预警系统</h2>
            </div>
          </template>
          <div class="welcome-content">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card shadow="hover" class="feature-card">
                  <el-icon class="feature-icon"><Monitor /></el-icon>
                  <h3>学业监控</h3>
                  <p>实时监控学习进度，及时发现潜在问题</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" class="feature-card">
                  <el-icon class="feature-icon"><Warning /></el-icon>
                  <h3>预警提醒</h3>
                  <p>智能预警系统，提前发现学业风险</p>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover" class="feature-card">
                  <el-icon class="feature-icon"><DataLine /></el-icon>
                  <h3>数据分析</h3>
                  <p>多维度数据分析，助力学习决策</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Monitor, Warning, DataLine } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.welcome-content {
  padding: 20px 0;
}

.feature-card {
  text-align: center;
  padding: 20px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 10px 0;
  color: #303133;
}

.feature-card p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style> 
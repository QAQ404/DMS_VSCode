<script setup>

import { Edit, Delete, Plus, Search, Refresh, View } from '@element-plus/icons-vue'
import { ref, provide, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentListService, getStudentByIdService } from '@/api/student.js'
import { useRouter } from 'vue-router';
const router = useRouter();

const pageInfo = ref({  //分页条的信息
  pageNum: 1,
  pageSize: 5,
  total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
  pageInfo.value.pageSize = size;
  getStudentList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
  pageInfo.value.pageNum = num;
  getStudentList();
}
const sortData = ref({  //选择排序的数据
  prop: '',
  order: ''
})

const searchData = ref({})  //搜索栏数据
const studentList = ref([])
const getStudentList = async () => {
  let params = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    prop: sortData.value.prop ? sortData.value.prop : null,
    order: sortData.value.order ? sortData.value.order : null,
    name: searchData.value.name ? searchData.value.name : null,
  }
  let result = await getStudentListService(params);
  pageInfo.value.total = result.data.total;
  studentList.value = result.data.items;
}

const sortChange = (data) => {  //排序选择
  if (data.order === null) {
    sortData.value.prop = '';
    sortData.value.order = '';
  } else {
    sortData.value.prop = data.prop;
    sortData.value.order = data.order;
  }
  getStudentList();
}
/* -------------------------------------------查看详情-------------------------------------------------------------- */
const SeeBuildingInfo = (studentId) => {
  router.push({ name: 'studentInfo', params: { studentId } })
}
/* --------------------------------------------批量添加页面----------------------------------------------------------------- */
const PushToAddStudentVue = () => {
  router.push({ name: 'studentAdd' })
}
/* ----------------------------------------修改页面------------------------------------------------------------------------- */
const GoToUpdateVue = (studentId) => {
  router.push({ name: 'studentUpdate', params: { studentId } })
}
/* ------------------------------------------------------------------------------------------------------ */
const clazzNameForm = (row, column, cellValue, index) => { //表格的方法，格式化展示的数据 
  return row.clazzYear + '级' + cellValue + '班';
}
const dormitoryNameForm = (row, column, cellValue, index) => { //格式化寝室名称
  return row.unitNumber + '单元' + row.floorNumber + '楼' + cellValue
}

onActivated(() => {
  getStudentList()
})
</script>

<template>
  <el-card style="min-height: 99%;">
    <template #header> <!-- 卡片顶部区域 -->
      <div class="card-header">
        <span>学生信息</span>
        <div>
          <el-button type="primary" plain @click="PushToAddStudentVue" :icon="Plus">添加学生</el-button>
        </div>
      </div>
    </template>
    <!-- 表格主体 -->
    <el-table :data="studentList" style="width: 100%;" border @sort-change="sortChange" tooltip-effect="light">
      <el-table-column label="姓名" prop="name" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="学号" prop="studyId" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="性别" prop="gender" sortable="custom" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="宿舍" prop="buildingName" sortable="custom" show-overflow-tooltip
        width="120"></el-table-column>
      <el-table-column label="寝室" prop="dormitoryName" sortable="custom" show-overflow-tooltip
        :formatter="dormitoryNameForm" width="180"></el-table-column>
      <el-table-column label="年级" prop="entranceYear" sortable="custom" show-overflow-tooltip
        width="100"></el-table-column>
      <el-table-column label="学院" prop="insName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="专业" prop="majorName" sortable="custom" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column label="班级" prop="clazzName" sortable="custom" show-overflow-tooltip :formatter="clazzNameForm"
        width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="170">
        <template #default="{ row }">
          <el-button-group>
            <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="SeeBuildingInfo(row.id)" />
            <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="GoToUpdateVue(row.id)" />
            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteInstitute(row.id)" />
          </el-button-group>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20]"
      layout="jumper, total, sizes, prev, pager, next" :total="pageInfo.total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}

.input-with {
  width: 100px;
}
</style> 
<!-- <el-select v-model="nationValue" filterable placeholder="请选择民族">
        <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.name"></el-option>
    </el-select> -->
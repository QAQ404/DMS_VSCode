<script setup>
import { ref, provide, onActivated } from 'vue';
import { EditPen, Delete ,Refresh,Search} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const pageInfo = ref({  //分页条的信息
  pageNum: 1,
  pageSize: 5,
  total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
  pageInfo.value.pageSize = size;
  getEmailList()
}
const onCurrentChange = (num) => {  //分页条改当前页面
  pageInfo.value.pageNum = num;
  getEmailList()
}

import { EmailGetEmailListService, EmailDeleteEmailService } from '@/api/email.js'

const searchData = ref({ show: '收件箱', })
const emailList = ref([])
const getEmailList = async () => {
  let params = {
    pageNum: pageInfo.value.pageNum,
    pageSize: pageInfo.value.pageSize,
    show: searchData.value.show,
    userId: userInfoStore.info.id,
    workId: searchData.value.workId ? searchData.value.workId : null,
    name: searchData.value.name ? searchData.value.name : null,
  }
  let result = await EmailGetEmailListService(params);
  pageInfo.value.total = result.data.total;
  emailList.value = result.data.items;
}

const SelectEmailRef = ref()
const headClick = (row, column, cell, event) => {
  if (column.label !== '操作') {
    SelectEmailRef.value.toggleRowExpansion(row)
  }
}
const SeeEmailWriteVue = () => {
  router.push({ name: 'emailWrite' })
}
const sendForm = (row) => {
  return row.sendId + row.sendName
}
const reForm = (row) => {
  return row.reId + row.reName
}
const showChange = () => {
  getEmailList()
}
const clearSearchData = () => {
    searchData.value.workId = '';
    searchData.value.name = '';
    getEmailList()
}
const getSearchData = () => {
  getEmailList();
}
const DeleteEmail = (id) => {
  ElMessageBox.confirm(
    '是否确认删除',
    '温馨提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let result = await EmailDeleteEmailService(id, searchData.value.show);
      ElMessage({
        type: 'success',
        message: '成功删除',
      })
      getEmailList()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
onActivated(() => {
  getEmailList()
})
</script>

<template>
  <el-card style="min-height: 99%;">
    <template #header> <!-- 卡片顶部区域 -->
      <div class="card-header">
        <span> 我的邮箱</span>
        <el-button type="primary" plain @click="SeeEmailWriteVue" :icon="EditPen">写邮件</el-button>
      </div>
    </template>

    <el-form :inline="true" :model="searchData" size="small">
      <el-form-item label="">
        <el-radio-group v-model="searchData.show" size="small" @change="showChange">
          <el-radio-button label="收件箱" value="收件箱" />
          <el-radio-button label="已发送" value="已发送" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="编号"><el-input v-model="searchData.workId" style="width: 120px;"
          size="small" /></el-form-item>
      <el-form-item label="姓名"><el-input v-model="searchData.name" style="width: 100px;" size="small" /></el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="getSearchData" :icon="Search" size="small">搜索</el-button>
        <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="emailList" tooltip-effect="light" size="small" ref="SelectEmailRef" @cell-click="headClick">
      <el-table-column type="expand" width="1">
        <template #default="props">
          <div v-html="props.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="寄信人" prop="sendId" show-overflow-tooltip :formatter="sendForm" width="180"
        v-if="searchData.show === '收件箱'"></el-table-column>
      <el-table-column label="收信人" prop="reId" show-overflow-tooltip :formatter="reForm" width="180"
        v-if="searchData.show === '已发送'"></el-table-column>
      <el-table-column label="主题" prop="theme" show-overflow-tooltip></el-table-column>
      <el-table-column label="发送时间" width="150" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template #default="{ row }">
          <el-space>
            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteEmail(row.id)" />
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize"
      :page-sizes="[5, 10, 20]" layout="jumper, total, sizes, prev, pager, next" :total="pageInfo.total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
}

.TheCalendar /deep/ .el-calendar-table .el-calendar-day {
  width: 100%;
  height: 40px;
  text-align: left;
}

:deep(.el-table__expand-icon) {
  display: none;
}
</style>


<!-- // const a = ref(new Date())
//  const b = ()=>{
//  alert(a.value.toLocaleDateString().split('/').join('-'))
//  }  

// <el-calendar v-model="a" class="TheCalendar" >
//             <template #date-cell="{ data }">
//                 <el-space>
//                     {{ data.day.split('-').slice(2).join('-') }}
//                     <div v-if='true'>1</div>
//                 </el-space>
//             </template>
//         </el-calendar>
//         <button @click="b">+</button> -->
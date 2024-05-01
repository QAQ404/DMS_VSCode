<script setup>
import { ref , provide, onActivated} from 'vue';
import { EditPen } from '@element-plus/icons-vue'
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
  getStudentList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
  pageInfo.value.pageNum = num;
  getStudentList();
}

const SeeEmailWriteVue = ()=>{
    router.push({ name: 'emailWrite' })
}

onActivated(() => {

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
        
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
.TheCalendar /deep/ .el-calendar-table .el-calendar-day{
    width: 100%;
    height: 40px;
    text-align: left;
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
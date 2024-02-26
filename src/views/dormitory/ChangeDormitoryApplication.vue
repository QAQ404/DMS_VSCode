<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, provide, nextTick, onActivated } from 'vue'
import { ChangeDorAppGetAppListService } from '@/api/changeDormitoryApplication.js'
import { Plus, Edit, Delete, View, Refresh, Check } from '@element-plus/icons-vue'

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getApplicationList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getApplicationList();
}
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})

const ApplicationList = ref()
const getApplicationList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
    }
    let result = await ChangeDorAppGetAppListService(params);
    pageInfo.value.total = result.data.total;
    ApplicationList.value = result.data.items;
}

const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getApplicationList();
}

const OldDorNameForm = (row) => {
    return row.oldBuildingName + row.oldUnitNumber + '单元' + row.oldFloorNumber + '楼' + row.oldName
}
const NewDorNameForm = (row) => {
    return row.newBuildingName + row.newUnitNumber + '单元' + row.newFloorNumber + '楼' + row.newName
}
const NewStuNameForm = (row) => {
    if (row.newStuId === -1) { return '空闲床位' }
    else { return row.newStuName; }
}
const NewStuStudyIdForm = (row) => {
    if (row.newStuId === -1) { return '无' }
    else { return row.newStuId; }
}

onActivated(() => {
    getApplicationList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header>
            <div class="card-header">
                <span>转寝申请</span>
                <el-space>
                    <el-button type="primary" plain @click="" v-if="userInfoStore.info.role === 1">提出申请</el-button>
                </el-space>
            </div>
        </template>{{ ApplicationList }}
        <el-table border :data="ApplicationList" tooltip-effect="light" @sort-change="sortChange">
            <el-table-column label="申请人" width="120" prop="stuName" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请人学号" width="140" prop="stuStudyId" show-overflow-tooltip></el-table-column>
            <el-table-column label="申请人寝室" width="250" prop="oldId" show-overflow-tooltip
                :formatter="OldDorNameForm"></el-table-column>
            <el-table-column label="目标寝室" width="250" prop="newId" show-overflow-tooltip
                :formatter="NewDorNameForm"></el-table-column>
            <el-table-column label="被交换者" width="200" prop="newStuId" show-overflow-tooltip
                :formatter="NewStuNameForm"></el-table-column>
            <el-table-column label="被交换者学号" width="140" prop="newStudyId" show-overflow-tooltip
                :formatter="NewStuStudyIdForm"></el-table-column>
            <el-table-column label="操作" width="170" fixed="right">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="" />
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="" />
                        <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="" />
                    </el-button-group>
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
}</style>
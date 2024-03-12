<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, provide, nextTick, onActivated } from 'vue'
import { Plus, Edit, Delete, View, Refresh, Check, Search } from '@element-plus/icons-vue'
import defaultPicture from '@/assets/default2.jpg'

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

import { RepairAppGetAppListService } from '@/api/repairApplication.js'

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
    let result = await RepairAppGetAppListService(params);
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

/* ------------------------------------------------------- */
const SelectAddStudentRef = ref()
const headClick = (row, column, cell, event) => {
    if (column.label !== '操作') {
        SelectAddStudentRef.value.toggleRowExpansion(row)
    }
}
const dormitoryNameForm = (row, column, cellValue, index) => { //格式化寝室名称
    return row.buildingName + row.unitNumber + '单元' + row.floorNumber + '楼' + cellValue
}
const studentNameForm = (row, column, cellValue, index) => {
    return row.stuStudyId + row.stuName;
}
/* --------------------------------------------------- */

onActivated(() => {
    getApplicationList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header>
            <div class="card-header">
                <span>寝室报修</span>
                <el-space>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog"
                        v-if="userInfoStore.info.role === 1">申请报修</el-button>
                </el-space>
            </div>
        </template>

        <div>
            {{ ApplicationList }}
            <el-table border :data="ApplicationList" @sort-change="sortChange" tooltip-effect="light"
                ref="SelectAddStudentRef" @cell-click="headClick">
                <el-table-column type="expand" width="1">
                    <template #default="props">
                        <div>
                            <el-descriptions :column="2" border>
                                <el-descriptions-item>
                                    <template #label> 报修人电话 </template>
                                    {{ props.row.phone }}
                                </el-descriptions-item>
                                <el-descriptions-item>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template #label> 详细描述 </template>
                                    <el-input v-model="props.row.description" :rows="6" type="textarea" disabled />
                                </el-descriptions-item>
                                <el-descriptions-item> <template #label> 故障照片 </template>
                                    <div>
                                        <el-image v-if="props.row.picture" :src="props.row.picture" class="avatar"
                                            :fit="fill" :preview-src-list="[props.row.picture]" />
                                        <el-image v-else :src="defaultPicture" class="avatar" :fit="fill"
                                            :preview-src-list="[defaultPicture]" />
                                    </div>
                                </el-descriptions-item>
                            </el-descriptions>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column type='index' label="序号" width="55"></el-table-column>
                <el-table-column width="300" label="报修寝室" prop="dorName" show-overflow-tooltip
                    :formatter="dormitoryNameForm"></el-table-column>
                <el-table-column label="故障物品" prop="troubleItem" sortable="custom" show-overflow-tooltip
                    width="200"></el-table-column>
                <el-table-column label="报修人" prop="stuId" show-overflow-tooltip width="200"
                    :formatter="studentNameForm"></el-table-column>
                <el-table-column label="申请时间" prop="createTime" sortable="custom" show-overflow-tooltip
                    width="200"></el-table-column>
                <el-table-column label="操作" fixed="right" v-if="userInfoStore.info.role != 1" width="170">
                    <template #default="{ row }">
                        <el-space v-if="row.state == 0">
                            <el-button type="success" :dark="isDark" plain
                                @click="AcceptApplication(row.id)">处理</el-button>
                            <el-button type="danger" :dark="isDark" plain
                                @click="RefusesApplication(row.id)">拒绝</el-button>
                        </el-space>
                        <el-space v-else size="large">
                            <el-tag type="success" size="large" effect="dark" disable-transitions="false"
                                v-if="row.state == 2">已通过</el-tag>
                            <el-tag type="danger" size="large" effect="dark" disable-transitions="false"
                                v-else-if="row.state == 1">已拒绝</el-tag>
                            <el-tag type="warning" size="large" effect="dark" disable-transitions="false"
                                v-else-if="row.state == -1">已失效</el-tag>
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete"
                                @click="DeleteApplication(row.id)" circle />
                        </el-space>
                    </template>
                </el-table-column>
                <el-table-column label="申请状态" v-else width="100">
                    <template #default="{ row }">
                        <el-tag type="success" size="large" effect="dark" disable-transitions="false"
                            v-if="row.state == 2">已通过</el-tag>
                        <el-tag type="danger" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == 1">已拒绝</el-tag>
                        <el-tag type="info" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == 0">暂未处理</el-tag>
                        <el-tag type="warning" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == -1">已失效</el-tag>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table>
            <!-- 分页条 -->
            <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize"
                :page-sizes="[5, 10, 20]" layout="jumper, total, sizes, prev, pager, next" :total="pageInfo.total"
                @size-change="onSizeChange" @current-change="onCurrentChange"
                style="margin-top: 20px; justify-content: flex-end" />
        </div>
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
}

:deep(.el-table__expand-icon) {
    display: none;
}
</style>
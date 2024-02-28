<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, provide, nextTick, onActivated } from 'vue'
import { ChangeDorAppAcceptAppService, ChangeDorAppGetAppListService, ChangeDorAppAddAppService ,ChangeDorAppDeleteAppService ,ChangeDorAppRefusesAppService } from '@/api/changeDormitoryApplication.js'
import { Plus, Edit, Delete, View, Refresh, Check ,Search} from '@element-plus/icons-vue'

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
const searchData = ref({})
const ApplicationList = ref()
const getApplicationList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        userId: searchData.value.userId ? searchData.value.userId : null,
        state: searchData.value.state ? searchData.value.state : null,
        stuName: searchData.value.stuName ? searchData.value.stuName : null,
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

import { dormitoryGetDormitoryBedListCascaderService } from '@/api/dormitory.js'
const dormitoryBedList = ref([])
const getDormitoryBedList = async () => {
    let result = await dormitoryGetDormitoryBedListCascaderService();
    dormitoryBedList.value = result.data;
}

/* ------------------------------------------------------------------------------ */
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
    else { return row.newStuStudyId; }
}
const UpdateTimeIdForm = (row) => {
    if (row.state == 0) { return '暂未处理'; } else if(row.state==-1){return'申请失效'} else { return row.updateTime }
}
/* ------------------------------------------------------------------------------ */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false)
const AddQuicklyDialogData = ref({})
const AddQuicklyDialogData2 = ref('')
const AddQuicklyDialogType = ref('changeDorApp')
const SeeAddQuicklyDialog = () => {
    AddQuicklyDialogData.value = dormitoryBedList.value;
    AddQuicklyDialogData2.value = ref('').value;
    ifShowAddQuicklyDialogVue.value = true;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogData2', AddQuicklyDialogData2)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('giveReturnData', async () => { //添加的按钮功能    
    if (AddQuicklyDialogData2.value === '') ElMessage.error('请选则寝室床位')
    else if(AddQuicklyDialogData2.value[4] == userInfoStore.info.id) ElMessage.error('申请对象不能是自己');
    else {
        let result = await ChangeDorAppAddAppService(userInfoStore.info.id, AddQuicklyDialogData2.value);
        ifShowAddQuicklyDialogVue.value = false;
        getApplicationList();
    }
})
/* ------------------------------------------------------------------------------ */
const AcceptApplication = (id)=>{
    ElMessageBox.confirm(
        '是否同意申请',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await ChangeDorAppAcceptAppService(id);
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            getApplicationList();
        })
}
const RefusesApplication = (id)=>{
    ElMessageBox.confirm(
        '是否拒绝申请',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await ChangeDorAppRefusesAppService(id);
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            getApplicationList();
        })
}
const DeleteApplication = (id)=>{
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
            let result = await ChangeDorAppDeleteAppService(id);
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            getApplicationList();
        })
}
/* ------------------------------------------------------------------------------ */
const clearSearchData = () => {
    searchData.value = ref({}).value;
    if (userInfoStore.info.role === 1) {
        searchData.value.userId = userInfoStore.info.id;
    }
    getApplicationList()
}
const getSearchData = () => {
    console.log(searchData.value);
    getApplicationList();
}
/* ------------------------------------------------------------------------------ */
onActivated(() => {
    if (userInfoStore.info.role === 1) {
        searchData.value.userId = userInfoStore.info.id;
    }
    getApplicationList()
    getDormitoryBedList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header>
            <div class="card-header">
                <span>转寝申请</span>
                <el-space></el-space>
            </div>
        </template>
        <div v-if="userInfoStore.info.role !== 1">
            <el-form :inline="true" :model="searchData" size="default"> <!-- 搜索表单 -->
                <el-form-item label="申请人姓名"><el-input v-model="searchData.stuName" style="width: 100px;"
                    size="small" /></el-form-item>
                <el-form-item label="申请状态">
                    <el-select v-model="searchData.state" style="width: 100px" size="small">
                        <el-option label="已通过" value="2"></el-option>
                        <el-option label="已拒绝" value="1"></el-option>
                        <el-option label="暂未处理" value="0"></el-option>
                        <el-option label="已失效" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search" size="small">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain size="small">重置</el-button>
            </el-form-item>
            </el-form>
            <el-table border :data="ApplicationList" tooltip-effect="light" @sort-change="sortChange">
                <el-table-column label="申请人" width="120" prop="stuName" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请人学号" width="140" prop="stuStudyId" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请人寝室" width="250" prop="oldId" show-overflow-tooltip
                    :formatter="OldDorNameForm"></el-table-column>
                <el-table-column label="目标寝室" width="250" prop="newId" show-overflow-tooltip
                    :formatter="NewDorNameForm"></el-table-column>
                <el-table-column label="被交换者" width="200" prop="newStuId" show-overflow-tooltip
                    :formatter="NewStuNameForm"></el-table-column>
                <el-table-column label="被交换者学号" width="140" prop="newStuStudyId" show-overflow-tooltip
                    :formatter="NewStuStudyIdForm"></el-table-column>
                <el-table-column label="申请时间" width="180" prop="createTime" sortable="custom"
                    show-overflow-tooltip></el-table-column>
                <el-table-column label="处理时间" width="180" prop="updateTime" sortable="custom" show-overflow-tooltip
                    :formatter="UpdateTimeIdForm"></el-table-column>
                <el-table-column label="操作" width="170" fixed="right" v-if="userInfoStore.info.role === 3">
                    <template #default="{ row }">
                        <el-space v-if="row.state==0">
                            <el-button type="success" :dark="isDark" plain @click="AcceptApplication(row.id)" >同意</el-button>
                            <el-button type="danger" :dark="isDark" plain @click="RefusesApplication(row.id)" >拒绝</el-button>
                        </el-space>
                        <el-space v-else size="large" >
                            <el-tag type="success" size="large" effect="dark" disable-transitions="false" v-if="row.state==2">已通过</el-tag>
                            <el-tag type="danger" size="large" effect="dark" disable-transitions="false" v-else-if="row.state==1">已拒绝</el-tag>
                            <el-tag type="warning" size="large" effect="dark" disable-transitions="false" v-else-if="row.state==-1">已失效</el-tag>
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteApplication(row.id)" circle />
                        </el-space>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页条 -->
            <el-pagination v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize"
                :page-sizes="[5, 10, 20]" layout="jumper, total, sizes, prev, pager, next" :total="pageInfo.total"
                @size-change="onSizeChange" @current-change="onCurrentChange"
                style="margin-top: 20px; justify-content: flex-end" />
        </div>
        <div v-else>
            <el-card>
                <div v-if="JSON.stringify(ApplicationList) == '[]'">
                    <el-empty description="暂无申请">
                        <el-button type="primary" plain @click="SeeAddQuicklyDialog">提出申请</el-button>
                    </el-empty>
                </div>
                <div v-else>
                    <el-descriptions title="我的申请" :column="1" border v-for="(item, index) in ApplicationList">
                        <template #extra>
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteApplication(item.id)">
                                <div v-if="item.state == 0">取消申请</div>
                                <div v-else>删除申请记录</div>
                            </el-button>
                        </template>
                        <el-descriptions-item>
                            <template #label>目标寝室</template>
                            {{ item.newBuildingName }} {{ item.newUnitNumber }}单元 {{ item.newFloorNumber }}楼 {{
                                item.newName }}
                        </el-descriptions-item>
                        <el-descriptions-item v-if="item.newStuId !== -1">
                            <template #label>目标床位</template>
                            {{ item.newStuStudyId }}{{ item.newStuName }}的床位
                        </el-descriptions-item>
                        <el-descriptions-item v-if="item.newStuId === -1">
                            <template #label>目标床位</template>
                            空闲床位
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>申请时间</template>
                            {{ item.createTime }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>处理时间</template>
                            {{ item.updateTime }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template #label>申请状态</template>
                            <div v-if="item.state == 0">
                                <el-tag type="info" size="large" effect="dark" disable-transitions="false">暂未处理</el-tag>
                            </div>
                            <div v-else-if="item.state == 1">
                                <el-tag type="danger" size="large" effect="dark" disable-transitions="false">已拒绝</el-tag>
                            </div>
                            <div v-else-if="item.state==2">
                                <el-tag type="success" size="large" effect="dark" disable-transitions="false">已通过</el-tag>
                            </div>
                            <div v-else>
                                <el-tag type="warning" size="large" effect="dark" disable-transitions="false">已失效</el-tag>
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>

            </el-card>
        </div>
    </el-card>
    <AddQuicklyDialogVue />
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
</style>
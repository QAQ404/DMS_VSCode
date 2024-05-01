<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, provide, nextTick, onActivated } from 'vue'
import { Plus, Edit, Delete, View, Refresh, Check, Search } from '@element-plus/icons-vue'
import defaultPicture from '@/assets/default2.jpg'

//照片上传的回调
const uploadSuccess = (result) => {
    if (result.data === 'big') {
        ElMessage.error('图片大小需小于1MB'); return;
    }
    AddData.value.picture = result.data;
}

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

import { RepairAppGetAppListService ,RepairAppAddAppListService ,RepairAppDeleteAppListService ,RepairAppSolveService} from '@/api/repairApplication.js'

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
        troubleItem: searchData.value.troubleItem ? searchData.value.troubleItem : null,
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
const clearSearchData = () => {
    searchData.value = ref({}).value;
    if (userInfoStore.info.role === 1) {
        searchData.value.userId = userInfoStore.info.id;
    }
    getApplicationList()
}
const getSearchData = () => {
    getApplicationList();
}

/* ------------------------------------------------------- */
const SelectAddStudentRef = ref()
const headClick = (row, column, cell, event) => {
    if (column.label !== '操作' && column.label !== '申请状态') {
        SelectAddStudentRef.value.toggleRowExpansion(row)
    }
}
const dormitoryNameForm = (row, column, cellValue, index) => { //格式化寝室名称
    return row.buildingName + row.unitNumber + '单元' + row.floorNumber + '楼' + cellValue
}
const studentNameForm = (row, column, cellValue, index) => {
    return row.stuStudyId + row.stuName;
}
/* --------------------添加------------------------------- */
const ifShowAddDialogVue = ref(false);
const repairType = ref(['电灯','插座','门','窗','电扇','空调','家具','电源开关','墙','水管','天花板','地板','水表'
,'停水','停电','水槽','马桶','淋浴器','其他'])
const AddData = ref({troubleItem:'',description:''})
const SeeAddQuicklyDialog = ()=>{
    AddData.value = ref({troubleItem:'',description:'',picture: null}).value;
    ifShowAddDialogVue.value = true;
}
const closeDialog = () => {
    ifShowAddDialogVue.value = false;
}
const addDataBack = async () =>{
    if(AddData.value.troubleItem == ''){
        ElMessage.error("请选择故障类型"); return;
    }
    let result = await RepairAppAddAppListService(AddData.value);
    getApplicationList();
    ifShowAddDialogVue.value = false;
}
/* -------------------------处理报修------------------------------- */
const ifShowReturnDialogVue = ref(false);
const sovleData = ref({id:'',type:'',message:''})
const AcceptApplication = (id)=>{
    sovleData.value.id = id;
    sovleData.value.type = 1;
    ifShowReturnDialogVue.value = true;
}
const RefusesApplication = (id)=>{
    sovleData.value.id = id;
    sovleData.value.type = 0;
    ifShowReturnDialogVue.value = true;
}
const closeReturnDialog = () => {
    ifShowReturnDialogVue.value = false;
    sovleData.value.message = '';
}
const sovleApplication = async ()=>{
    let result = await RepairAppSolveService(sovleData.value);
    getApplicationList()
    ifShowReturnDialogVue.value = false;
    sovleData.value.message = '';
}
/* -----------------------删除--------------------------------- */
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
            let result = await RepairAppDeleteAppListService(id);
            ElMessage({
                type: 'success',
                message: '操作成功',
            })
            getApplicationList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
/* -------------------------------------------------------- */
onActivated(() => {
    if (userInfoStore.info.role === 1) {
        searchData.value.userId = userInfoStore.info.id;
    }
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
            <el-form :inline="true" :model="searchData" size="default" v-if="userInfoStore.info.role !== 1"> <!-- 搜索表单 -->
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
                <el-form-item label="报修内容">
                <el-select v-model="searchData.troubleItem" filterable  style="width: 150px;" size="small">
                    <el-option v-for="item in repairType" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
                <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search" size="small">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain size="small">重置</el-button>
                </el-form-item>
             </el-form>
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
                                <el-descriptions-item v-if="props.row.state>0">
                                    <template #label> 处理时间 </template>
                                    {{ props.row.updateTime }}
                                </el-descriptions-item>
                                <el-descriptions-item v-else>
                                </el-descriptions-item>
                                <el-descriptions-item>
                                    <template #label> 详细描述 </template>
                                    <el-input v-model="props.row.description" :rows="5" type="textarea" disabled />
                                </el-descriptions-item>
                                <el-descriptions-item> <template #label> 故障照片 </template>
                                    <div>
                                        <el-image v-if="props.row.picture" :src="props.row.picture" class="avatar"
                                            :fit="fill" :preview-src-list="[props.row.picture]" />
                                        <el-image v-else :src="defaultPicture" class="avatar" :fit="fill"
                                            :preview-src-list="[defaultPicture]" />
                                    </div>
                                </el-descriptions-item>
                                <el-descriptions-item v-if="props.row.state>0">
                                    <template #label> 宿舍回复 </template>
                                    <el-input v-model="props.row.managerMessage" :rows="3" type="textarea" disabled />
                                </el-descriptions-item>
                                <el-descriptions-item v-if="props.row.state>0">
                                    <template #label> 宿管姓名 </template>
                                    {{ props.row.managerName }}
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
                <el-table-column label="申请状态" v-else width="150" fixed="right">
                    <template #default="{ row }">
                        <el-space  size="large">
                            <el-tag type="success" size="large" effect="dark" disable-transitions="false"
                            v-if="row.state == 2">已通过</el-tag>
                            <el-tag type="danger" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == 1">已拒绝</el-tag>
                            <el-tag type="info" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == 0">暂未处理</el-tag>
                            <el-tag type="warning" size="large" effect="dark" disable-transitions="false"
                            v-else-if="row.state == -1">已失效</el-tag>
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete"  v-if="row.state == 0"
                            @click="DeleteApplication(row.id)" circle />
                        </el-space>
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
    <el-dialog  v-model="ifShowAddDialogVue" @close="closeDialog()" draggable>
        <template #header>
            申请报修
        </template>
        <el-form :model="AddData" v-if="userInfoStore.info.role === 1" :inline="true">
            <el-form-item label="报修内容">
                <el-select v-model="AddData.troubleItem" filterable placeholder="" style="width: 470px;">
                    <el-option v-for="item in repairType" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="照片">
                <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="AddData.picture" :src="AddData.picture" class="avatar2" />
                    <div v-else> <img :src="defaultPicture" class="avatar2" /> </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="AddData.description" :rows="5" type="textarea" style="width:300px"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="closeDialog()">取消</el-button>
                <el-button type="primary" @click="addDataBack">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="ifShowReturnDialogVue"  @close="closeReturnDialog()">
         <template #header>
            <div v-if="sovleData.type==1">解决报修</div>
            <div v-if="sovleData.type==0">拒绝报修</div>
        </template>
        <el-form :model="sovleData">
            <el-form-item label="回复">
                <el-input v-model="sovleData.message" :rows="5" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="closeReturnDialog()">取消</el-button>
                <el-button type="primary" @click="sovleApplication()">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}

.avatar {
    width: 130px;
    height: 130px;
    display: block;
}

:deep(.el-table__expand-icon) {
    display: none;
}
.avatar2 {
    width: 120px;
    height: 120px;
    display: block;
}
</style>
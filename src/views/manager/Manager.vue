<script setup>
import { Plus, Edit, Delete, Key, Search, Refresh } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import { managerGetListService, managerAddService, managerUpdateService, managerGetByIdService, managerUpdatePasswordService, managerDeleteService } from '@/api/manager.js'
import defaultPicture from '@/assets/default.jpg'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getManagerList()
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getManagerList()
}

const searchData = ref({})  //搜索栏数据
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})

const managerList = ref([]) //在表格里展示的宿管信息
const getManagerList = async () => { //获取宿管信息功能
    let Data = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        workId: searchData.value.workId ? searchData.value.workId : null,
        name: searchData.value.name ? searchData.value.name : null,
        gender: searchData.value.gender ? searchData.value.gender : null,
    }
    let result = await managerGetListService(Data);
    managerList.value = result.data.items;
    pageInfo.value.total = result.data.total;
}
getManagerList()

const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getManagerList();
}
const clearSearchData = ()=>{
    searchData.value = ref({}).value;
    getManagerList()
}
const getSearchData = ()=>{
    getManagerList();
}
/* ----------------------------------------添加宿管组件--------------------------------------------------------------------- */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false) //添加宿管弹窗是否显示
const AddQuicklyDialogData = ref({}) //添加宿管的输入信息
const AddQuicklyDialogType = ref('manager')
const SeeAddQuicklyDialog = () => {
    ifShowAddQuicklyDialogVue.value = true;
    AddQuicklyDialogData.value = ref({}).value;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('giveReturnData', async () => { //添加宿管的按钮功能    
    let result = await managerAddService(AddQuicklyDialogData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    ifShowAddQuicklyDialogVue.value = false;
    getManagerList();
})

/* ------------------------------------------更新的弹窗组件------------------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue'
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('manager')
const UpdateInfoDialogData = ref({})
const ifChangeWorkId = ref()
const SeeUpdateDialog = async (row) => {
    let result = await managerGetByIdService(row.id)
    UpdateInfoDialogData.value = result.data;   //先传值，在显示弹窗！！！
    ifChangeWorkId.value = UpdateInfoDialogData.value.workId;
    ifShowUpdateInfoDialogVue.value = true;
}
provide('ifShowUpdateInfoDialogVue', ifShowUpdateInfoDialogVue)
provide('changeIfShowUpdateInfoDialogVue', (newISUIDV) => {
    ifShowUpdateInfoDialogVue.value = newISUIDV;
})
provide('UpdateInfoDialogType', UpdateInfoDialogType)
provide('UpdateInfoDialogData', UpdateInfoDialogData)
provide('getReturnData', async () => {
    // Reflect.set(UpdateInfoDialogData.value,'old',ifChangeWorkId.value) 
    let result = await managerUpdateService(UpdateInfoDialogData.value, ifChangeWorkId.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    getManagerList()
    ifShowUpdateInfoDialogVue.value = false;
})
/* ------------------------------------------更改密码对话框------------------------------------------------------------------- */
const ifShowUpdatePasswordDialog = ref(false)
const updatePasswordData = ref({ id: '' })
const SeeUpdatePasswordDialog = (id) => {
    ifShowUpdatePasswordDialog.value = true;
    updatePasswordData.value = ref({ id: '' }).value;
    updatePasswordData.value.id = id;
}
const closeUpdatePasswordDialog = () => {
    ifShowUpdatePasswordDialog.value = false;
}
const UpdatePassword = async () => {
    console.log(updatePasswordData.value);
    let result = await managerUpdatePasswordService(updatePasswordData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    closeUpdatePasswordDialog();
}
/* ------------------------------------------------------------------------------------------------------------- */

const checkRePassword = (rule, value, callback) => {
    if (updatePasswordData.value.rePassword !== updatePasswordData.value.password) callback(new Error("两次密码输入不一致"))
    else callback()
}
//定义表单校验规则
const rules = {
    rePassword: [
        { validator: checkRePassword, trigger: "blur" }
    ]
}

const DeleteManager = (row) => { //删除宿管
    if (row.buildingNumber > 0) {
        ElMessage({ type: 'error', message: '该宿管仍在管理楼栋' })
        return;
    }
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
            let result = await managerDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getManagerList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片头部 -->
            <div class="card-header">
                <span>宿管信息</span>
                <div>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog" :icon="Plus">添加宿管</el-button>
                </div>
            </div>
        </template>
        <el-form :inline="true" :model="searchData" size="default"> <!-- 搜索表单 -->
            <el-form-item label="编号"><el-input v-model="searchData.workId"  placeholder="请输入工作编号"/></el-form-item>
            <el-form-item label="姓名"><el-input v-model="searchData.name" placeholder="请输入姓名"/></el-form-item>
            <el-form-item label="性别"><el-select v-model="searchData.gender" style="width: 100px;">
                    <el-option label="男" value="男" /><el-option label="女" value="女" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 主体表格 -->
        <el-table style="width: 100%;" border :data="managerList" @sort-change="sortChange" tooltip-effect="light">
            <el-table-column label="编号" prop="workId" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="照片" width="70">
                <template #default="scope">
                    <el-avatar shape="square" :size="45" :src="scope.row.picture ? scope.row.picture : defaultPicture" />
                    <!-- <button @click="console.log(scope.column)">+</button> -->
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别" prop="gender" width="55" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="电话" prop="phone" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" prop="email" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column label="管理楼栋数" prop="buildingNumber" sortable="custom" width="130"
                show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-tooltip content="修改密码" effect="light" :enterable="false" placement="bottom-end">
                            <el-button color="#E6A23C" :dark="isDark" plain :icon="Key"
                                @click="SeeUpdatePasswordDialog(row.id)" />
                        </el-tooltip>
                        <el-tooltip content="修改" effect="light" :enterable="false">
                            <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row)" />
                        </el-tooltip>
                        <el-tooltip content="删除" effect="light" :enterable="false">
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteManager(row)" />
                        </el-tooltip>
                    </el-button-group>
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
    </el-card>
    <!-- 修改密码对话框 -->
    <el-dialog v-model="ifShowUpdatePasswordDialog" @close="closeUpdatePasswordDialog()" title="修改密码">
        <el-form :data="updatePasswordData" label-width="150px" :rules="rules" autocomplete="off">
            <el-form-item label="新的密码" style="width: 80%;">
                <el-input v-model="updatePasswordData.password" placeholder="请输入新的密码" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" style="width: 80%;" prop="rePassword">
                <el-input v-model="updatePasswordData.rePassword" placeholder="请再次输入密码" type="password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="closeUpdatePasswordDialog()"> 取消 </el-button>
                <el-button type="primary" @click="UpdatePassword"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
    <AddQuicklyDialogVue />
    <UpdateInfoDialogVue />
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
</style>
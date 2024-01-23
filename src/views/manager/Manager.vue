<script setup>
import { Plus, Edit, Delete, Key } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import { managerGetListService, managerAddService, managerUpdateService } from '@/api/manager.js'
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

/* ------------------------------------------------------------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('manager')
const UpdateInfoDialogData = ref({})
const ifChangeWorkId = ref()
const SeeUpdateDialog = async (row) => { //会和row绑定在一起，需要修改！！！
    UpdateInfoDialogData.value = row;   //先传值，在显示弹窗！！！
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

/* ------------------------------------------------------------------------------------------------------------- */
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
        <!-- 主体表格 -->
        <el-table style="width: 100%;" border :data="managerList" @sort-change="sortChange">
            <el-table-column label="编号" prop="workId" sortable="custom"></el-table-column>
            <el-table-column label="照片" width="70"><el-avatar shape="square" :size="45"
                    :src="managerList.picture ? managerList.picture : defaultPicture" /></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="性别" prop="gender" width="55" align="center"></el-table-column>
            <el-table-column label="电话" prop="phone" width="120"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="200"></el-table-column>
            <el-table-column label="管理楼栋数" prop="buildingNumber" sortable="custom" width="130"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-tooltip content="修改密码" effect="light" :enterable="false" placement="bottom-end">
                            <el-button color="#E6A23C" :dark="isDark" plain :icon="Key" @click="" />
                        </el-tooltip>
                        <el-tooltip content="修改" effect="light" :enterable="false">
                            <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row)" />
                        </el-tooltip>
                        <el-tooltip content="删除" effect="light" :enterable="false">
                            <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="" />
                        </el-tooltip>
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
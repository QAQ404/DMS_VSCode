<script setup>
import { Edit, Delete, AddLocation, Search, Refresh } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { majorGetMajorListService ,majorAddService,majorGetMajorByIdService,updateMajorService,majorDeleteService} from '@/api/major.js'
import { instituteGetInstituteNameListService } from '@/api/institute.js'

const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getMajorList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getMajorList();
}
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})

const instituteList = ref([])
const getInstituteList = async ()=>{
    let result = await instituteGetInstituteNameListService();
    instituteList.value = result.data;
}
getInstituteList()

const searchData = ref({})  //搜索栏数据
const majorList = ref([])
const getMajorList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        name: searchData.value.name ? searchData.value.name : null,
        stuNumber: searchData.value.stuNumber ? searchData.value.stuNumber : null,
        insName: searchData.value.insName ? searchData.value.insName : null,
        clazzNumber: searchData.value.clazzNumber ? searchData.value.clazzNumber : null,
    }
    let result = await majorGetMajorListService(params);
    pageInfo.value.total = result.data.total;
    majorList.value = result.data.items;
}
getMajorList()
const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getMajorList();
}
const clearSearchData = () => {
    searchData.value = ref({}).value;
    getMajorList()
}
const getSearchData = () => {
    getMajorList();
}
/* ---------------------------------------------------添加楼栋弹窗---------------------------------------------------------- */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false) 
const AddQuicklyDialogData = ref({}) 
const AddQuicklyDialogType = ref('major')
const SeeAddQuicklyDialog = () => {
    ifShowAddQuicklyDialogVue.value = true;
    AddQuicklyDialogData.value = ref({}).value;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogData2', instituteList)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('giveReturnData', async () => { //添加楼栋的按钮功能    
    if (AddQuicklyDialogData.value.name == null) {
        ElMessage.error("输入不能为空"); return;
    }
    if (AddQuicklyDialogData.value.name.length > 20) {
        ElMessage.error("名称需小于20位"); return;
    }
    let result = await majorAddService(AddQuicklyDialogData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    ifShowAddQuicklyDialogVue.value = false;
    getMajorList();
})
/* -----------------------------------------------------更新框组件-------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('major')
const UpdateInfoDialogData = ref({})
const ifNameChange = ref()
const SeeUpdateDialog = async (id) => {
    let result = await majorGetMajorByIdService(id);
    UpdateInfoDialogData.value = result.data;   //先传值，在显示弹窗！！！
    ifNameChange.value = UpdateInfoDialogData.value.name;
    ifShowUpdateInfoDialogVue.value = true;
}
provide('ifShowUpdateInfoDialogVue', ifShowUpdateInfoDialogVue)
provide('changeIfShowUpdateInfoDialogVue', (newISUIDV) => {
    ifShowUpdateInfoDialogVue.value = newISUIDV;
})
provide('UpdateInfoDialogType', UpdateInfoDialogType)
provide('UpdateInfoDialogData', UpdateInfoDialogData)
provide('getReturnData', async () => {
    if (UpdateInfoDialogData.value.name == null) {
        ElMessage.error("输入不能为空"); return;
    }
    if (UpdateInfoDialogData.value.name.length > 20) {
        ElMessage.error("名称需小于20位"); return;
    }
    if (UpdateInfoDialogData.value.name != ifNameChange.value) {
        let result = await updateMajorService(UpdateInfoDialogData.value);
    }
    ElMessage.success('修改成功');
    getMajorList();
    ifShowUpdateInfoDialogVue.value = false;
})
/* ------------------------------------------------------------------------------------------------------------- */

const DeleteInstitute = (id) => {    //删除楼栋
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
            let result = await majorDeleteService(id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getMajorList();
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
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <span>学院信息</span>
                <div>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog" :icon="AddLocation">添加学院</el-button>
                </div>
            </div>
        </template>
        <el-form :inline="true" :model="searchData" size="default"> <!-- 搜索表单 -->
            <el-form-item label="名称"><el-input v-model="searchData.name" placeholder="专业名称"
                    style="width: 150px;" /></el-form-item>
            <el-form-item  label="学院">
                <el-select v-model="searchData.insName" filterable style="width: 130px" size="small">
                    <el-option v-for="item in instituteList" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="班级不少于"><el-input-number size="small" v-model="searchData.clazzNumber" :min="0"
                    class="input-with" /></el-form-item>
            <el-form-item label="学生不少于"><el-input-number size="small" v-model="searchData.stuNumber" :min="0"
                    class="input-with" /></el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search" size="small">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格主体 -->
        <el-table :data="majorList" style="width: 100%;" border @sort-change="sortChange" tooltip-effect="light">
            <el-table-column label="专业名称" prop="name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="所属学院" prop="insName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="班级数" prop="clazzNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="学生数" prop="stuNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row.id)" />
                        <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteInstitute(row.id)" />
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

.input-with {
    width: 100px;
}
</style>
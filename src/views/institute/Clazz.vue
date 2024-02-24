<script setup>
import { Edit, Delete, AddLocation, Search, Refresh } from '@element-plus/icons-vue'
import { ref, provide ,onActivated} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { clazzGetClazzListService, clazzAddService, clazzGetClazzByIdService, updateClazzService, clazzDeleteService } from '@/api/clazz.js'
import { majorGetMajorNameListService } from '@/api/major.js'
import { instituteGetInstituteNameListService } from '@/api/institute.js'

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getClazzList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getClazzList();
}
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})

const instituteList = ref([])
const getInstituteList = async () => {
    let result = await instituteGetInstituteNameListService();
    instituteList.value = result.data;
}


const searchData = ref({})  //搜索栏数据
const majorList = ref([])
const getMajorList = async (data) => {
    let result = await majorGetMajorNameListService(data);
    majorList.value = result.data;
}


const clazzList = ref([])
const getClazzList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        name: searchData.value.name ? searchData.value.name : null,
        stuNumber: searchData.value.stuNumber ? searchData.value.stuNumber : null,
        insName: searchData.value.insName ? searchData.value.insName : null,
        majorName: searchData.value.majorName ? searchData.value.majorName : null,
        entranceYear: searchData.value.entranceYear ? searchData.value.entranceYear : null,
    }
    let result = await clazzGetClazzListService(params);
    pageInfo.value.total = result.data.total;
    clazzList.value = result.data.items;
}

const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getClazzList();
}
const clearSearchData = () => {
    searchData.value = ref({}).value;
    selectSearchDisabled.value = true;
    getClazzList()
}
const getSearchData = () => {
    getClazzList();
}
const selectSearchDisabled = ref(true)
const changeSearchIntitute = () => { //select标签选择了学院
    selectSearchDisabled.value = false;
    getMajorList(searchData.value.insName);
    searchData.value.majorName = ''
}
/* ---------------------------------------------------添加班级弹窗---------------------------------------------------------- */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false)
const ifShowAddQuicklyDialogVue2 = ref(true)
const AddQuicklyDialogData = ref({})
const AddQuicklyDialogData3 = ref({})
const AddQuicklyDialogType = ref('clazz')
const SeeAddQuicklyDialog = () => {
    AddQuicklyDialogData.value = ref({}).value;
    ifShowAddQuicklyDialogVue.value = true;
    ifShowAddQuicklyDialogVue2.value = true;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('ifShowAddQuicklyDialogVue2', ifShowAddQuicklyDialogVue2)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogData2', instituteList)
provide('AddQuicklyDialogData3', AddQuicklyDialogData3)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('AddQuicklyDialogFunction', async () => {
    let result = await majorGetMajorNameListService(AddQuicklyDialogData.value.insName);
    AddQuicklyDialogData3.value = result.data;
    AddQuicklyDialogData.value.majorName = null;
    ifShowAddQuicklyDialogVue2.value = false;
})
provide('giveReturnData', async () => { //添加的按钮功能    
    if (AddQuicklyDialogData.value.name == null || AddQuicklyDialogData.value.insName == null || AddQuicklyDialogData.value.majorName == null || AddQuicklyDialogData.value.entranceYear == null) {
        ElMessage.error("输入不能为空"); return;
    }
    let result = await clazzAddService(AddQuicklyDialogData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    ifShowAddQuicklyDialogVue.value = false;
    getClazzList();
})
/* -----------------------------------------------------更新框组件-------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('clazz')
const UpdateInfoDialogData = ref({})
const ifNameChange = ref()
const SeeUpdateDialog = async (id) => {
    let result = await clazzGetClazzByIdService(id);
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
    if (UpdateInfoDialogData.value.name != ifNameChange.value) {
        let result = await updateClazzService(UpdateInfoDialogData.value);
    }
    ElMessage.success('修改成功');
    getClazzList();
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
            let result = await clazzDeleteService(id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getClazzList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

const nameForm = (row, column, cellValue, index) => { //表格的方法，格式化展示的数据 
    return cellValue + '班';
}

onActivated(()=>{
    searchData.value.insName = '';
    searchData.value.majorName = '';
    selectSearchDisabled.value = true;
    getInstituteList()
    getClazzList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <span>班级信息</span>
                <div>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog" :icon="AddLocation" v-if="userInfoStore.info.role===3">添加班级</el-button>
                </div>
            </div>
        </template>
        <el-form :inline="true" :model="searchData" size="default"> <!-- 搜索表单 -->
            <el-form-item label="名称"><el-input v-model="searchData.name" placeholder="班级号" style="width: 100px;"
                    size="small" /></el-form-item>
            <el-form-item label="年级"><el-date-picker v-model="searchData.entranceYear" type="year" placeholder="选择年份"
                    size="small" style="width: 90px;" value-format="YYYY" /></el-form-item>
            <el-form-item label="学院">
                <el-select v-model="searchData.insName" filterable style="width: 100px" size="small"
                    @change="changeSearchIntitute">
                    <el-option v-for="item in instituteList" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="专业">
                <el-select v-model="searchData.majorName" filterable style="width: 100px" size="small"
                    :disabled="selectSearchDisabled" placeholder="先选择学院">
                    <el-option v-for="item in majorList" :key="item.value" :label="item.label" :value="item.label" />
                </el-select>
            </el-form-item>
            <el-form-item label="学生不少于"><el-input-number size="small" v-model="searchData.stuNumber" :min="0"
                    class="input-with" style="width: 80px;" /></el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search" size="small">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain size="small">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格主体 -->
        <el-table :data="clazzList" style="width: 100%;" border @sort-change="sortChange" tooltip-effect="light">
            <el-table-column label="班级号" prop="name" sortable="custom" show-overflow-tooltip
                :formatter="nameForm"></el-table-column>
            <el-table-column label="年级" prop="entranceYear" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="学院" prop="insName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="专业" prop="majorName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="学生数" prop="stuNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" v-if="userInfoStore.info.role===3">
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
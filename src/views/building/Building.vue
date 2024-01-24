<script setup>
import { Edit, Delete, View, AddLocation, Search, Refresh } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import { buildingGetListService, buildingAddService, buildingGetInfoByIdService, buildingUpdateInfoService, buildingDeleteService } from '@/api/building.js'
import { managerGetOnlyNameService, managerChangeBuildingNumberService } from '@/api/manager.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getBuildingList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getBuildingList();
}

const buildings = ref([])   //获取的楼栋集合
const searchData = ref({})  //搜索栏数据
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})
const getBuildingList = async () => {     //获取楼栋集合功能
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        name: searchData.value.name ? searchData.value.name : null,
        unit_number: searchData.value.unit_number ? searchData.value.unit_number : null,
        dor_number: searchData.value.dor_number ? searchData.value.dor_number : null,
        stu_number: searchData.value.stu_number ? searchData.value.stu_number : null,
        manager_id: searchData.value.manager_id ? searchData.value.manager_id : null,
    }

    let result = await buildingGetListService(params);
    pageInfo.value.total = result.data.total;
    buildings.value = result.data.items;
}
getBuildingList();

const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getBuildingList();
}

const clearSearchData = () => {  //清空搜索框
    searchData.value = ref({})
}

const getSearchData = () => { //进行搜索
    if (searchData.value.manager_id != null && searchData.value.manager_id[0] != null)
        searchData.value.manager_id = searchData.value.manager_id[0];
    getBuildingList();
}

const managerList = ref([])
const getManagerList = async () => {  //获取全体管理员的名字和工作编号
    let result = await managerGetOnlyNameService();
    managerList.value = result.data;
}
getManagerList();
/* ---------------------------------------------------添加楼栋弹窗---------------------------------------------------------- */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false) //添加楼栋弹窗是否显示
const AddQuicklyDialogData = ref({ unitNumber: 1 }) //添加楼栋的输入信息
const AddQuicklyDialogType = ref('building')
const SeeAddQuicklyDialog = () => {
    ifShowAddQuicklyDialogVue.value = true;
    AddQuicklyDialogData.value = ref({ unitNumber: 1 }).value;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogData2', managerList)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('giveReturnData', async () => { //添加楼栋的按钮功能    
    if (AddQuicklyDialogData.value.managerId == null) {
        ElMessage.error("输入不能为空"); return;
    }
    if (AddQuicklyDialogData.value.managerId[0] != null)
        AddQuicklyDialogData.value.managerId = AddQuicklyDialogData.value.managerId[0];
    let result = await buildingAddService(AddQuicklyDialogData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    ifShowAddQuicklyDialogVue.value = false;
    getBuildingList();
})
/* ---------------------------------------------------对话框组件---------------------------------------------------------- */
import SeeInfoDialogVue from '@/components/SeeInfoDialog.vue'   //查看详情的对话框的组件
const ifShowSeeInfoDialogVue = ref(false)   //父传子，让弹窗显示
const SeeInfoDialogData = ref({})   //存储从后端拿过来的数据
const SeeInfoDialogType = ref('building')   //数据类型是building
const SeeBuildingInfo = async (id) => { //展示楼栋详细信息，传值过去
    ifShowSeeInfoDialogVue.value = true;
    let result = await buildingGetInfoByIdService(id);
    SeeInfoDialogData.value = result.data;
}
provide('SeeInfoDialogType', SeeInfoDialogType) //传递的数据类型
provide('SeeInfoDialogData', SeeInfoDialogData)  //传递给弹窗组件楼栋的详细数据
provide('ifShowSeeInfoDialogVue', ifShowSeeInfoDialogVue)    //传递弹窗信息
provide('changeifShowSeeInfoDialogVue', (newISSIDV) => {
    ifShowSeeInfoDialogVue.value = newISSIDV;
})
/* -----------------------------------------------------更新框组件-------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('building')
const UpdateInfoDialogData = ref({})
const UpdateInfoDialogData2 = ref({})
const ifManagerChange = ref()
const SeeUpdateDialog = async (id) => {
    let result = await buildingGetInfoByIdService(id);
    UpdateInfoDialogData.value = result.data;   //先传值，在显示弹窗！！！
    UpdateInfoDialogData2.value = managerList.value;
    ifManagerChange.value = UpdateInfoDialogData.value.manId;
    ifShowUpdateInfoDialogVue.value = true;
}
provide('ifShowUpdateInfoDialogVue', ifShowUpdateInfoDialogVue)
provide('changeIfShowUpdateInfoDialogVue', (newISUIDV) => {
    ifShowUpdateInfoDialogVue.value = newISUIDV;
})
provide('UpdateInfoDialogType', UpdateInfoDialogType)
provide('UpdateInfoDialogData', UpdateInfoDialogData)
provide('UpdateInfoDialogData2', UpdateInfoDialogData2)
provide('getReturnData', async () => {
    if (UpdateInfoDialogData.value.manId[0] != null)
        UpdateInfoDialogData.value.manId = UpdateInfoDialogData.value.manId[0];
    let result = await buildingUpdateInfoService(UpdateInfoDialogData.value);
    ElMessage.success(result.message ? result.message : '修改成功');
    if (ifManagerChange.value !== UpdateInfoDialogData.value.manId) {
        let result2 = await managerChangeBuildingNumberService(ifManagerChange.value, UpdateInfoDialogData.value.manId);
    }
    getBuildingList();
    ifShowUpdateInfoDialogVue.value = false;
})
/* ------------------------------------------------------------------------------------------------------------- */

const DeleteBuilding = (id) => {    //删除楼栋
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
            let result = await buildingDeleteService(id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getBuildingList();
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
                <span>楼栋信息</span>
                <div>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog" :icon="AddLocation">添加楼栋</el-button>
                </div>
            </div>
        </template>
        <el-form :inline="true" :model="searchData" size="default"> <!-- 搜索表单 -->
            <el-form-item label="宿舍楼名称"><el-input v-model="searchData.name" style="width: 200px;"
                    placeholder="请输入宿舍楼名称" />&nbsp;&nbsp;</el-form-item>
            <el-form-item label="宿舍楼单元数"><el-input-number v-model="searchData.unit_number" :min="1"
                    class="input-with" />&nbsp;&nbsp;&nbsp;</el-form-item>
            <el-form-item label="宿舍管理员"><el-cascader placeholder="请选择宿舍管理员" filterable :options="managerList"
                    v-model="searchData.manager_id" style="width: 250px;" /></el-form-item>
            <el-form-item label="寝室数量不少于"><el-input-number v-model="searchData.dor_number" :min="0"
                    class="input-with" /></el-form-item>
            <el-form-item label="学生数量不少于"><el-input-number v-model="searchData.stu_number" :min="0"
                    class="input-with" /></el-form-item>
            <el-form-item>
                <el-button type="primary" plain @click="getSearchData" :icon="Search">搜索</el-button>
                <el-button @click="clearSearchData" :icon="Refresh" type="warning" plain>重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格主体 -->
        <el-table :data="buildings" style="width: 100%;" border @sort-change="sortChange" tooltip-effect="light">
            <el-table-column label="楼栋名称" prop="name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="单元数" prop="unitNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="寝室数" prop="dorNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="学生数" prop="stuNumber" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="宿管" prop="manName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="SeeBuildingInfo(row.id)" />
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row.id)" />
                        <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteBuilding(row.id)" />
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
    <SeeInfoDialogVue />
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
    width: 180px;
}
</style>
<script setup>
import { Plus, Edit, Delete, View, Search, Refresh } from '@element-plus/icons-vue'
import { ref, provide } from 'vue'
import defaultPicture from '@/assets/default2.jpg'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dormitoryGetListService, dormitoryAddService } from '@/api/dormitory.js'
import { buildingGetOnlyNameService, buildingGetUnitAndFloorService } from '@/api/building.js'


const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 5,
    total: 0
})
const onSizeChange = (size) => {    //分页条改页面大小
    pageInfo.value.pageSize = size;
    getdormitoryList();
}
const onCurrentChange = (num) => {  //分页条改当前页面
    pageInfo.value.pageNum = num;
    getdormitoryList();
}
const sortData = ref({  //选择排序的数据
    prop: '',
    order: ''
})

const dormitoryList = ref([])
const searchData = ref({})  //搜索栏数据
const getdormitoryList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
    }
    let result = await dormitoryGetListService(params);
    pageInfo.value.total = result.data.total;
    dormitoryList.value = result.data.items;
}
getdormitoryList()
const sortChange = (data) => {  //排序选择
    if (data.order === null) {
        sortData.value.prop = '';
        sortData.value.order = '';
    } else {
        sortData.value.prop = data.prop;
        sortData.value.order = data.order;
    }
    getdormitoryList();
}
const clearSearchData = () => {  //清空搜索框
    searchData.value = ref({}).value
}

/* ----------------------------------------添加宿管组件--------------------------------------------------------------------- */
import AddQuicklyDialogVue from '@/components/addQuicklyDialog.vue'
const ifShowAddQuicklyDialogVue = ref(false) //添加宿管弹窗是否显示
const AddQuicklyDialogData = ref({ unitNumber: 1, floorNumber: 1, bedNumber: 4, buildingId: 14 }) //添加宿管的输入信息
const AddQuicklyDialogData2 = ref(null)
const AddQuicklyDialogData3 = ref({})
const AddQuicklyDialogType = ref('dormitory')
const SeeAddQuicklyDialog = async () => {
    ifShowAddQuicklyDialogVue.value = true;
    AddQuicklyDialogData.value = ref({ unitNumber: 1, floorNumber: 1, bedNumber: 4, buildingId: 14 }).value;
    if (AddQuicklyDialogData2.value === null) {
        let result = await buildingGetOnlyNameService();
        AddQuicklyDialogData2.value = result.data;
    }
    let result2 = await buildingGetUnitAndFloorService(14);
    AddQuicklyDialogData3.value = result2.data;
}
provide('ifShowAddQuicklyDialogVue', ifShowAddQuicklyDialogVue)
provide('AddQuicklyDialogData', AddQuicklyDialogData)
provide('AddQuicklyDialogData2', AddQuicklyDialogData2)
provide('AddQuicklyDialogData3', AddQuicklyDialogData3)
provide('AddQuicklyDialogType', AddQuicklyDialogType)
provide('changeifAddQuicklyDialogVue', (newV) => {
    ifShowAddQuicklyDialogVue.value = newV;
})
provide('giveReturnData', async () => { //添加宿管的按钮功能    
    let result = await dormitoryAddService(AddQuicklyDialogData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    ifShowAddQuicklyDialogVue.value = false;
    getdormitoryList();
})
provide('AddQuicklyDialogFunction', async (value) => {
    let result = await buildingGetUnitAndFloorService(value);
    AddQuicklyDialogData3.value = result.data;
    AddQuicklyDialogData.value.unitNumber = 1;
    AddQuicklyDialogData.value.floorNumber = 1;
})
/* --------------------------------------------------------------------------------------------------------------- */
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header>
            <div class="card-header">
                <span>寝室信息</span>
                <div>
                    <el-button type="primary" plain @click="SeeAddQuicklyDialog" :icon="Plus">添加寝室</el-button>
                </div>
            </div>
        </template>
        <!-- 主体表格 -->
        <el-table border :data="dormitoryList" @sort-change="sortChange" tooltip-effect="light">
            <el-table-column label="寝室名称" prop="name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在单元" prop="unitNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="所在楼栋" prop="buildingName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在楼层" prop="floorNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="学生数" prop="stuNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="宿管" prop="manName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="SeeDormitoryInfo(row.id)" />
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row.id)" />
                        <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" @click="DeleteDormitory(row.id)" />
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
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
</style>
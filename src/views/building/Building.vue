<script setup>
import { Edit, Delete, View, AddLocation } from '@element-plus/icons-vue'
import { ref ,provide } from 'vue'
import { buildingGetListService, buildingAddService ,buildingGetInfoById ,buildingUpdateInfo} from '@/api/building.js'
import { managerGetOnlyName } from '@/api/manager.js'
import { ElMessage } from 'element-plus'

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

const getBuildingList = async () => {     //获取楼栋集合功能
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
    }

    let result = await buildingGetListService(params);
    pageInfo.value.total = result.data.total;
    buildings.value = result.data.items;
}
getBuildingList();

const dialogFormVisible = ref(false);   //添加楼栋弹窗是否显示
const addBuildingData = ref({ unitNumber: 1 })  //添加楼栋的输入信息

const managerList = ref([])
const getManagerList = async () => {  //获取全体管理员的名字和工作编号
    let result = await managerGetOnlyName();
    managerList.value = result.data;
}
getManagerList();

const clearAddBuilding = () => {    //清理输入框
    addBuildingData.value = { unitNumber: 1 };
}

const addBuilding = async () => {   //添加楼栋的按钮功能    /* 待办：给管理员的管理楼数加1 */
    if (addBuildingData.value.managerId == null) {
        ElMessage.error("输入不能为空"); return;
    }
    addBuildingData.value.managerId = addBuildingData.value.managerId[0];

    let result = await buildingAddService(addBuildingData.value);
    ElMessage.success(result.message ? result.message : '添加成功');

    dialogFormVisible.value = false;
    getBuildingList();
}

import SeeInfoDialogVue from '@/components/SeeInfoDialog.vue'   //查看详情的对话框的组件
const ifShowSeeInfoDialogVue = ref(false)   //父传子，让弹窗显示
const SeeInfoDialogData = ref({})   //存储从后端拿过来的数据
const SeeInfoDialogType = ref('building')   //数据类型是building
const SeeBuildingInfo = async (id) => { //展示楼栋详细信息，传值过去
    ifShowSeeInfoDialogVue.value = true;
    let result = await buildingGetInfoById(id); 
    SeeInfoDialogData.value = result.data;
}
provide('SeeInfoDialogType',SeeInfoDialogType) //传递的数据类型
provide('SeeInfoDialogData',SeeInfoDialogData)  //传递给弹窗组件楼栋的详细数据
provide('ifShowSeeInfoDialogVue',ifShowSeeInfoDialogVue)    //传递弹窗信息
provide('changeifShowSeeInfoDialogVue',(newISSIDV)=>{
    ifShowSeeInfoDialogVue.value = newISSIDV;
})

import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('building')
const UpdateInfoDialogData = ref({})
const UpdateInfoDialogData2 = ref({})
const UpdateInfoDialogReturnData = ref({})
const SeeUpdateDialog = async (id)=>{     
    let result = await buildingGetInfoById(id);
    UpdateInfoDialogData.value = result.data;   //先传值，在显示弹窗！！！
    UpdateInfoDialogData2.value = managerList.value;
    ifShowUpdateInfoDialogVue.value = true;
}
provide('ifShowUpdateInfoDialogVue',ifShowUpdateInfoDialogVue)
provide('changeIfShowUpdateInfoDialogVue',(newISUIDV)=>{ 
    ifShowUpdateInfoDialogVue.value = newISUIDV;
})
provide('UpdateInfoDialogType',UpdateInfoDialogType)
provide('UpdateInfoDialogData',UpdateInfoDialogData)
provide('UpdateInfoDialogData2',UpdateInfoDialogData2)
provide('getReturnData',async (newData)=>{
    UpdateInfoDialogReturnData.value = newData;
    let result = await buildingUpdateInfo(UpdateInfoDialogReturnData.value);
    console.log(result.data);
    ElMessage.success(result.message ? result.message : '修改成功');
    getBuildingList();
})

</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <span>楼栋信息</span>
                <div>
                    <el-button type="primary" plain @click="dialogFormVisible = true; clearAddBuilding();">添加楼栋<el-icon>
                            <AddLocation />
                        </el-icon></el-button>
                </div>
            </div>
        </template>
        <!-- 表格主体 -->
        <el-table :data="buildings" style="width: 100%;" border >
            <el-table-column label="楼栋名称" prop="name"></el-table-column>
            <el-table-column label="单元数" prop="unitNumber"></el-table-column>
            <el-table-column label="寝室数" prop="dorNumber"></el-table-column>
            <el-table-column label="学生数" prop="stuNumber"></el-table-column>
            <el-table-column label="宿管" prop="manName"></el-table-column>
            <el-table-column label="操作" >
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark="isDark" plain :icon="View" @click="SeeBuildingInfo(row.id)" />
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" @click="SeeUpdateDialog(row.id)"/>
                        <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete" />
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
    <!-- 添加楼栋的弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="快速添加" draggable>
        <el-form :model="addBuildingData">
            <el-form-item label="楼栋名称">
                <el-input v-model="addBuildingData.name" placeholder="请输入楼栋名称" />
            </el-form-item>
            <el-form-item label="楼栋单元数">
                <el-input-number v-model="addBuildingData.unitNumber" :min="1" />
            </el-form-item>
            <el-form-item label="宿舍管理员">
                <el-cascader placeholder="请选择对应的宿舍管理员" filterable :options="managerList"
                    v-model="addBuildingData.managerId" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addBuilding">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
    <SeeInfoDialogVue/>
    <UpdateInfoDialogVue/>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* :deep(.el-table__expand-icon) { display: none; } */

</style>
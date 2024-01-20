<script setup>
import { Edit, Delete, View, AddLocation } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { buildingGetListService, buildingAddService } from '@/api/building.js'
import { managerGetOnlyName } from '@/api/manager.js'
import { ElMessage } from 'element-plus'
const pageInfo = ref({  //分页条的信息
    pageNum: 1,
    pageSize: 10,
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

const dialogFormVisible = ref(false);
const addBuildingData = ref({unitNumber:1})

const managerList = ref([])
const getManagerList = async () => {  //获取全体管理员的名字和工作编号
    let result = await managerGetOnlyName();
    managerList.value = result.data;
}
getManagerList();

const clearAddBuilding = () => {    //清理输入框
    addBuildingData.value = {unitNumber:1};
}

const addBuilding = async () => {
    if (addBuildingData.value.managerId == null) {
        ElMessage.error("输入不能为空"); return;
    }
    addBuildingData.value.managerId = addBuildingData.value.managerId[0];

    let result = await buildingAddService(addBuildingData.value);
    ElMessage.success(result.message ? result.message : '添加成功');
    dialogFormVisible.value = false;
    getBuildingList();
}
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
        <el-table :data="buildings" style="width: 100%;" border>
            <el-table-column label="楼栋名称" prop="name"></el-table-column>
            <el-table-column label="单元数" prop="unitNumber"></el-table-column>
            <el-table-column label="寝室数" prop="dorNumber"></el-table-column>
            <el-table-column label="学生数" prop="stuNumber"></el-table-column>
            <el-table-column label="宿管" prop="manName"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark="isDark" plain :icon="View" />
                        <el-button color="#E6A23C" :dark="isDark" plain :icon="Edit" />
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
    <el-dialog v-model="dialogFormVisible" title="添加楼栋" draggable>
        <el-form :model="addBuildingData">
            <el-form-item label="楼栋名称" :label-width="formLabelWidth">
                <el-input v-model="addBuildingData.name"  />
            </el-form-item>
            <el-form-item label="楼栋单元数" :label-width="formLabelWidth">
                <el-input-number v-model="addBuildingData.unitNumber" :min="1"  />
            </el-form-item>
            <el-form-item label="宿舍管理员" :label-width="formLabelWidth">
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
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
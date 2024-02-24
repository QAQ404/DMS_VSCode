<script setup>
import { Plus, Edit, Delete, View, Refresh, Check } from '@element-plus/icons-vue'
import { ref, provide, nextTick, onActivated } from 'vue'
import defaultPicture from '@/assets/default2.jpg'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dormitoryAddManyService, dormitoryGetNameListCheckTheSameName, dormitoryDeleteService, dormitoryGetListService, dormitoryAddService, dormitoryGetDormitoryByIdService, dormitoryUpdateInfoService } from '@/api/dormitory.js'
import { buildingGetOnlyNameService, buildingGetUnitAndFloorService } from '@/api/building.js'
import { studentDeleteService } from '@/api/student.js'
import { managerGetOnlyNameService } from '@/api/manager.js'
import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

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

const tagData = ref([
    { label: '寝室姓名：', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 1, index: 0, data: '' },
    { label: '所在单元：', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 2, index: 1, data: '' },
    { label: '所在楼栋：', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 3, index: 2, data: '' },
    { label: '所在楼层：', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 2, index: 3, data: '' },
    { label: '学生数>=', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 2, index: 4, data: '' },
    { label: '空闲床位>=', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 2, index: 5, data: '' },
    { label: '宿管：', value: '', ifShow: false, old: '', popoverVisible: false, inputType: 4, index: 6, data: '' },
]) //标签组
const dormitoryList = ref([])
const getdormitoryList = async () => {
    let params = {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
        prop: sortData.value.prop ? sortData.value.prop : null,
        order: sortData.value.order ? sortData.value.order : null,
        name: tagData.value[0].value ? tagData.value[0].value : null,
        unitNumber: tagData.value[1].data === 0 || tagData.value[1].data != '' ? tagData.value[1].data : null,
        buildingId: tagData.value[2].data ? tagData.value[2].data : null,
        floorNumber: tagData.value[3].data === 0 || tagData.value[3].data != '' ? tagData.value[3].data : null,
        stuNumber: tagData.value[4].data === 0 || tagData.value[4].data != '' ? tagData.value[4].data : null,
        bedNumber: tagData.value[5].data === 0 || tagData.value[5].data != '' ? tagData.value[5].data : null,
        managerId: tagData.value[6].data ? tagData.value[6].data : null,
    }
    let result = await dormitoryGetListService(params);
    pageInfo.value.total = result.data.total;
    dormitoryList.value = result.data.items;
    SelectAddStudentList.value = ref([]).value;
}

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

const managerList = ref([])
const getManagerList = async () => {  //获取全体管理员的名字和工作编号
    let result = await managerGetOnlyNameService();
    managerList.value = result.data;
}

const buildingList = ref([])
const getBuildingList = async () => {  //获取全体寝室楼的名字和工作编号
    let result = await buildingGetOnlyNameService();
    buildingList.value = result.data;
}

/* ----------------------------------------添加组件--------------------------------------------------------------------- */
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
        AddQuicklyDialogData2.value = buildingList.value;
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
    if (AddQuicklyDialogData3.value.unitNumber < AddQuicklyDialogData.value.unitNumber)
        AddQuicklyDialogData.value.unitNumber = AddQuicklyDialogData3.value.unitNumber;
    if (AddQuicklyDialogData3.value.floorNumber < AddQuicklyDialogData.value.floorNumber)
        AddQuicklyDialogData.value.floorNumber = AddQuicklyDialogData3.value.floorNumber;
})
/* -----------------------------------------------------更新框组件-------------------------------------------------------- */
import UpdateInfoDialogVue from '@/components/UpdateInfoDialog.vue' //更新的弹窗组件
const ifShowUpdateInfoDialogVue = ref(false);
const UpdateInfoDialogType = ref('dormitory')
const UpdateInfoDialogData = ref({})
const UpdateInfoDialogData2 = ref(null)
const UpdateInfoDialogData3 = ref({})
const SeeUpdateDialog = async (id) => {
    let result = await dormitoryGetDormitoryByIdService(id);
    UpdateInfoDialogData.value = result.data;   //先传值，在显示弹窗！！！
    if (UpdateInfoDialogData2.value === null) {
        let result2 = await buildingGetOnlyNameService();
        UpdateInfoDialogData2.value = result2.data;
    }
    let result3 = await buildingGetUnitAndFloorService(UpdateInfoDialogData.value.buildingId);
    UpdateInfoDialogData3.value = result3.data;
    ifShowUpdateInfoDialogVue.value = true;
}
provide('ifShowUpdateInfoDialogVue', ifShowUpdateInfoDialogVue)
provide('changeIfShowUpdateInfoDialogVue', (newISUIDV) => {
    ifShowUpdateInfoDialogVue.value = newISUIDV;
})
provide('UpdateInfoDialogType', UpdateInfoDialogType)
provide('UpdateInfoDialogData', UpdateInfoDialogData)
provide('UpdateInfoDialogData2', UpdateInfoDialogData2)
provide('UpdateInfoDialogData3', UpdateInfoDialogData3)
provide('getReturnData', async () => {
    let result = await dormitoryUpdateInfoService(UpdateInfoDialogData.value);
    ElMessage.success(result.message ? result.message : '修改成功');
    getdormitoryList();
    ifShowUpdateInfoDialogVue.value = false;
})
provide('UpdateInfoDialogFunction', async (value) => {
    let result = await buildingGetUnitAndFloorService(value);
    UpdateInfoDialogData3.value = result.data;
    if (UpdateInfoDialogData3.value.unitNumber < UpdateInfoDialogData.value.unitNumber)
        UpdateInfoDialogData.value.unitNumber = UpdateInfoDialogData3.value.unitNumber;
    if (UpdateInfoDialogData3.value.floorNumber < UpdateInfoDialogData.value.floorNumber)
        UpdateInfoDialogData.value.floorNumber = UpdateInfoDialogData3.value.floorNumber;
})
/* ---------------------------------------------------对话框组件---------------------------------------------------------- */
import SeeInfoDialogVue from '@/components/SeeInfoDialog.vue'   //查看详情的对话框的组件
const ifShowSeeInfoDialogVue = ref(false)   //父传子，让弹窗显示
const SeeInfoDialogData = ref({})   //存储从后端拿过来的数据
const SeeInfoDialogType = ref('dormitory')   //数据类型是building
const SeeDormitoryInfo = async (row) => { //展示楼栋详细信息，传值过去
    ifShowSeeInfoDialogVue.value = true;
    SeeInfoDialogData.value = row;
}
provide('SeeInfoDialogType', SeeInfoDialogType) //传递的数据类型
provide('SeeInfoDialogData', SeeInfoDialogData)  //传递给弹窗组件楼栋的详细数据
provide('ifShowSeeInfoDialogVue', ifShowSeeInfoDialogVue)    //传递弹窗信息
provide('changeifShowSeeInfoDialogVue', (newISSIDV) => {
    ifShowSeeInfoDialogVue.value = newISSIDV;
})
/* ------------------------------------------------搜索--------------------------------------------------------------- */
const handleClose = (tag) => { //删除标签
    tag.ifShow = false; tag.popoverVisible = false;
    tag.value = ''; tag.data = '';
    getdormitoryList();
}
const addSearchTag = (command) => { //添加标签
    tagData.value[command].ifShow = true;
    if (command == 0) tagData.value[command].value = '';
    else if (command == 1 || command == 3) { tagData.value[command].value = 1; tagData.value[command].data = 1; }
    else if (command == 4) { tagData.value[command].value = 0; tagData.value[command].data = 0; }
    else if (command == 5) { tagData.value[command].value = 1; tagData.value[command].data = 1; }
    else if (command == 6) { tagData.value[command].value = ''; tagData.value[command].data = '' }
    else if (command == 2) { tagData.value[command].value = ''; tagData.value[command].data = '' }
    getdormitoryList();
}
const clearSearchData = () => {  //清空搜索框
    for (const i of tagData.value) { i.ifShow = false; i.popoverVisible = false; i.value = ''; i.data = '' }
    getdormitoryList();
}
const changeTag = (tag) => { //展示输入框
    if (tag.index == 2 || tag.index == 6) tag.old = tag.data;
    else tag.old = tag.value;
    tag.popoverVisible = true;
}
const doSearch = (tag) => { //确定按钮，搜索
    if (tag.index !== 2 && tag.index !== 6)
        tag.data = tag.value;
    tag.popoverVisible = false;
    getdormitoryList();
}
const doBack = (tag) => { //取消修改,回到上一步
    if (tag.index == 2) { tag.data = tag.old; selectBuildingChange(tag); }
    else if (tag.index == 6) { tag.data = tag.old; selectManagerChange(tag); }
    else tag.value = tag.old;
    tag.popoverVisible = false;
}
const selectManagerChange = (tag) => { //选择宿管后改变展示
    for (const i of managerList.value) {
        if (i.value == tag.data) {
            tag.value = i.label; break;
        }
    }
    if (tag.data == '') tag.value = '';
    getdormitoryList();
}
const selectBuildingChange = (tag) => { //选择寝室楼后改变展示
    for (const i of buildingList.value) {
        if (i.value == tag.data) {
            tag.value = i.label; break;
        }
    }
    if (tag.data == '') tag.value = '';
    getdormitoryList();
}
/* -------------------------------------------批量添加-------------------------------------------------------------------- */
const ifShowAddDetailedDialog = ref(false)
const AddDetailedDialogData = ref({ unitNumber: 1, floorNumber: 1, bedNumber: 4, buildingId: 14, nameList: [] })
const AddDetailedDialogData2 = ref(null)
const AddDetailedDialogData3 = ref({})
const AddDetailedDialogInputShow = ref(false)
const AddDetailedDialogInputData = ref()
const AddDetailedDialogData4 = ref()
const SeeAddDetailedDialog = async () => { //打开批量添加对话框，初始化数据
    ifShowAddDetailedDialog.value = true;
    AddDetailedDialogData.value = ref({ unitNumber: 1, floorNumber: 1, bedNumber: 4, buildingId: 14, nameList: [] }).value;
    if (AddDetailedDialogData2.value === null) {
        AddDetailedDialogData2.value = buildingList.value;
    }
    let result2 = await buildingGetUnitAndFloorService(14);
    AddDetailedDialogData3.value = result2.data;
    let params = {
        unitNumber: AddDetailedDialogData.value.unitNumber,
        buildingId: AddDetailedDialogData.value.buildingId,
        floorNumber: AddDetailedDialogData.value.floorNumber,
    }
    let result3 = await dormitoryGetNameListCheckTheSameName(params);
    AddDetailedDialogData4.value = result3.data;
}
const closeAddDetailedDialog = () => { //关闭对话框
    ifShowAddDetailedDialog.value = false;
}
const AddDetailedDialogFunction = async (value) => {
    let result = await buildingGetUnitAndFloorService(value);
    AddDetailedDialogData3.value = result.data;
    if (AddDetailedDialogData3.value.unitNumber < AddDetailedDialogData.value.unitNumber)
        AddDetailedDialogData.value.unitNumber = AddDetailedDialogData3.value.unitNumber;
    if (AddDetailedDialogData3.value.floorNumber < AddDetailedDialogData.value.floorNumber)
        AddDetailedDialogData.value.floorNumber = AddDetailedDialogData3.value.floorNumber;
    let params = {
        unitNumber: AddDetailedDialogData.value.unitNumber,
        buildingId: AddDetailedDialogData.value.buildingId,
        floorNumber: AddDetailedDialogData.value.floorNumber,
    }
    let result2 = await dormitoryGetNameListCheckTheSameName(params);
    AddDetailedDialogData4.value = result2.data;
    clearAddDetailedTag()

}
const AddDetailedTag = () => {
    AddDetailedDialogInputShow.value = true;
    nextTick(() => {
        refInput.value.focus()
    })
}
const handleInputConfirm = () => {
    if (AddDetailedDialogInputData.value) {
        if (AddDetailedDialogInputData.value.length > 10) {
            ElMessage.error("名称需小于10位"); return;
        }
        for (const i of AddDetailedDialogData.value.nameList) {
            if (i === AddDetailedDialogInputData.value) {
                ElMessage.error("有重名寝室"); return;
            }
        }
        for (const i of AddDetailedDialogData4.value) {
            if (i === AddDetailedDialogInputData.value) {
                ElMessage.error("有重名寝室"); return;
            }
        }
        AddDetailedDialogData.value.nameList.push(AddDetailedDialogInputData.value)
    }
    AddDetailedDialogInputShow.value = false
    AddDetailedDialogInputData.value = ''
}
const CloseAddDetailedTag = (tag) => {
    AddDetailedDialogData.value.nameList.splice(AddDetailedDialogData.value.nameList.indexOf(tag), 1)
}
const clearAddDetailedTag = () => {
    AddDetailedDialogData.value.nameList = ref({ unitNumber: 1, floorNumber: 1, bedNumber: 4, buildingId: 14, nameList: [] }).value.nameList;
}
const AddDetailedForm = async () => {
    console.log(tagData.value);
    let result = await dormitoryAddManyService(AddDetailedDialogData.value);
    ifShowAddDetailedDialog.value = false;
    getdormitoryList();
}
const refInput = ref()
/* --------------------------------------------------------------------------------------------------------------- */
const DeleteDormitory = (id) => {    //删除楼栋
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
            let result = await dormitoryDeleteService(id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getdormitoryList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
/* ----------------------------子表格------------------------------------------------------------------ */
const clazzNameForm = (row, column, cellValue, index) => { //表格的方法，格式化展示的数据 
    return row.clazzYear + '级' + cellValue + '班';
}
const lastBedForm = (row, column, cellValue, index) => {
    return row.bedNumber - row.stuNumber;
}
const SeeBuildingInfo = (studentId) => {
    router.push({ name: 'studentInfo', params: { studentId } })
}
const GoToUpdateVue = (studentId) => {
    router.push({ name: 'studentUpdate', params: { studentId } })
}
const DeleteStudent = (id) => {
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
            let result = await studentDeleteService(id);
            ElMessage({
                type: 'success',
                message: '成功删除',
            })
            getdormitoryList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
/* ----------------------------多选----------------------------------------------------------- */
const SelectAddStudentList = ref([])
const SelectAddStudentRef = ref()
const handleSelectionChange = (val) => {
    SelectAddStudentList.value = val
}
const headClick = (row, column, cell, event) => {
    if (column.label !== '操作') {
        dormitoryList.value.forEach((item, i) => {
            if (item !== row)
                SelectAddStudentRef.value.toggleRowExpansion(item, false)
        })
        SelectAddStudentRef.value.toggleRowExpansion(row)
        SelectAddStudentList.value = ref([]).value;
    }
}
const getRowKeys = (row) => {
    return row.id;
}
/* ----------------------------------批量迁入----------------------------------------------------- */
import UpdateStuDorDialogVue from '@/components/UpdateStuDorDialog.vue'
const ifShowUpdateStuDorDialogVue = ref(false);
const UpdateStuDorDialogData = ref()
const selectMany = () => {
    UpdateStuDorDialogData.value = SelectAddStudentList.value;
    ifShowUpdateStuDorDialogVue.value = true;
}
provide('changeIfShowUpdateStuDorDialogVue', (newISUIDV, ifF5) => {
    ifShowUpdateStuDorDialogVue.value = newISUIDV;
    if (ifF5) { getdormitoryList(); }
})
provide('UpdateStuDorDialogData', UpdateStuDorDialogData)
provide('ifShowUpdateStuDorDialogVue', ifShowUpdateStuDorDialogVue)
/* --------------------------------------------------------------------------------------- */

onActivated(() => {
    tagData.value[2].data = ''; tagData.value[2].value = '';
    tagData.value[6].data = ''; tagData.value[6].value = '';
    // 
    getdormitoryList()
    getManagerList();
    getBuildingList();
})
</script>
<template>
    <el-card style="min-height: 99%;">
        <template #header>
            <div class="card-header">
                <span>寝室信息</span>
                <el-space>
                    <el-button type="primary" plain @click="selectMany"  v-if="userInfoStore.info.role===3" >批量迁入寝室</el-button>
                    <el-dropdown trigger="click" placement="bottom-start" v-if="userInfoStore.info.role===3">
                        <el-button :icon="Plus" type="primary" plain >添加寝室</el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="SeeAddDetailedDialog">批量添加寝室</el-dropdown-item>
                                <el-dropdown-item @click="SeeAddQuicklyDialog">添加单个寝室</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-space>
            </div>
        </template>
        <!-- 搜索栏 -->
        <el-descriptions :column="1" :size="default" border direction="vertical">
            <el-descriptions-item label="自定义搜索">
                <el-space wrap>
                    <el-button :icon=" Refresh " type="warning" plain size="small" @click=" clearSearchData "></el-button>
                    <el-dropdown trigger="click" placement="right-start" @command=" addSearchTag ">
                        <el-button type="primary" plain size="small" :icon=" Plus "></el-button>
                        <template #dropdown>
                            <el-dropdown-menu style="user-select: none;">
                                <el-dropdown-item command="0" :disabled=" tagData[0].ifShow ">寝室名称</el-dropdown-item>
                                <el-dropdown-item command="1" :disabled=" tagData[1].ifShow ">所在单元</el-dropdown-item>
                                <el-dropdown-item command="2" :disabled=" tagData[2].ifShow ">所在楼栋</el-dropdown-item>
                                <el-dropdown-item command="3" :disabled=" tagData[3].ifShow ">所在楼层</el-dropdown-item>
                                <el-dropdown-item command="4" :disabled=" tagData[4].ifShow ">学生数不少于</el-dropdown-item>
                                <el-dropdown-item command="5" :disabled=" tagData[5].ifShow ">空闲床位不少于</el-dropdown-item>
                                <el-dropdown-item command="6" :disabled=" tagData[6].ifShow ">宿管</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <div v-for="                      tag                       in                       tagData                      "
                        :key=" tag ">
                        <el-popover :visible=" tag.popoverVisible " placement="bottom" :width=" 140 "
                            style="user-select: none;">
                            <el-input v-model=" tag.value " size="small" v-if=" tag.inputType === 1 "
                                style="user-select: none;" />
                            <el-input-number v-model=" tag.value " size="small" v-else-if=" tag.inputType === 2 "
                                style="user-select: none;" :min=" 0 " />
                            <el-select v-model=" tag.data " filterable style="width: 130px;user-select: none;"
                                v-else-if=" tag.inputType === 3 " @change="selectBuildingChange(tag)" size="small">
                                <el-option
                                    v-for="                    item                     in                     buildingList                    "
                                    :key=" item.value " :label=" item.label " :value=" item.value "
                                    style="user-select: none;" />
                            </el-select>
                            <el-select v-model=" tag.data " filterable style="width: 130px;user-select: none;"
                                @change="selectManagerChange(tag)" v-else-if=" tag.inputType === 4 " size="small">
                                <el-option
                                    v-for="                    item                     in                     managerList                    "
                                    :key=" item.value " :label=" item.label " :value=" item.value "
                                    style="user-select: none;" />
                            </el-select>
                            <div style="text-align: right; padding-top: 10px;user-select: none;">
                                <el-button size="small" type="info" @click="doBack(tag)">取消</el-button>
                                <el-button size="small" type="primary" @click="doSearch(tag)">确认</el-button>
                            </div>
                            <template #reference>
                                <el-tag closable :disable-transitions=" false " @close="handleClose(tag)"
                                    @click="changeTag(tag)" v-show=" tag.ifShow ">
                                    <div style="display: flex;">
                                        {{ tag.label + tag.value }}</div>
                                </el-tag>
                            </template>
                        </el-popover>
                    </div>
                </el-space>
            </el-descriptions-item>
        </el-descriptions>
        <!-- 主体表格 -->
        <el-table border :data=" dormitoryList " @sort-change=" sortChange " tooltip-effect="light"
            ref="SelectAddStudentRef" @cell-click=" headClick " highlight-current-row>
            <el-table-column type="expand" width="1">
                <template #default="props">
                    <el-table :data=" props.row.studentList " @selection-change=" handleSelectionChange "
                        :row-key=" getRowKeys ">
                        <el-table-column type="selection" width="55" fixed="left"
                            :reserve-selection=' true ' v-if="userInfoStore.info.role===3"></el-table-column>
                        <el-table-column label="姓名" width="120" prop="name"></el-table-column>
                        <el-table-column label="性别" width="80" prop="gender"></el-table-column>
                        <el-table-column label="学号" width="140" prop="studyId"></el-table-column>
                        <el-table-column label="年级" width="80" prop="entranceYear"></el-table-column>
                        <el-table-column label="学院" width="120" prop="insName"></el-table-column>
                        <el-table-column label="专业" width="120" prop="majorName"></el-table-column>
                        <el-table-column label="班级" width="120" prop="clazzName"
                            :formatter=" clazzNameForm "></el-table-column>
                        <el-table-column label="操作" fix="right" width="170">
                            <template #default="{ row }">
                                <el-button-group>
                                    <el-button color="#626aef" :dark=" isDark " plain :icon=" View "
                                        @click="SeeBuildingInfo(row.id)" />
                                    <el-button color="#E6A23C" :dark=" isDark " plain :icon=" Edit "
                                        @click="GoToUpdateVue(row.id)"  v-if="userInfoStore.info.role===3||(userInfoStore.info.role===2&&userInfoStore.info.id===row.managerId) " />
                                    <el-button color="#F56C6C" :dark=" isDark " plain :icon=" Delete "
                                        @click="DeleteStudent(row.id)"  v-if="userInfoStore.info.role===3"/>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column width="120" label="寝室名称" prop="name" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在单元" prop="unitNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="所在楼栋" prop="buildingName" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column label="所在楼层" prop="floorNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="学生数" prop="stuNumber" sortable="custom" show-overflow-tooltip
                width="120"></el-table-column>
            <el-table-column label="空闲床位" prop="bedNumber" sortable="custom" show-overflow-tooltip width="120"
                :formatter=" lastBedForm "></el-table-column>
            <el-table-column label="宿管" prop="manName" sortable="custom" width="120"
                show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" fix="right" width="170">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button color="#626aef" :dark=" isDark " plain :icon=" View " @click="SeeDormitoryInfo(row)" />
                        <el-button color="#E6A23C" :dark=" isDark " plain :icon=" Edit " @click="SeeUpdateDialog(row.id)" v-if="userInfoStore.info.role===3" />
                        <el-button v-if=" row.id !== 1 && userInfoStore.info.role===3" color="#F56C6C" :dark=" isDark " plain :icon=" Delete "
                            @click="DeleteDormitory(row.id)" />
                    </el-button-group>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page=" pageInfo.pageNum " v-model:page-size=" pageInfo.pageSize "
            :page-sizes=" [5, 10, 20] " layout="jumper, total, sizes, prev, pager, next" :total=" pageInfo.total "
            @size-change=" onSizeChange " @current-change=" onCurrentChange "
            style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
    <el-dialog v-model=" ifShowAddDetailedDialog " draggable title="批量添加" @close=" closeAddDetailedDialog ">
        <el-form v-model=" AddDetailedDialogData " autocomplete="off" :inline=" true ">
            <el-form-item label="单元号">
                <el-tooltip effect="light" placement="top">
                    <template #content>
                        该楼栋的最大单元号为{{ AddDetailedDialogData3.unitNumber }}
                    </template>
                    <el-input-number v-model=" AddDetailedDialogData.unitNumber " :min=" 1 "
                        :max=" AddDetailedDialogData3.unitNumber " />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="寝室床位数">
                <el-input-number v-model=" AddDetailedDialogData.bedNumber " :min=" 0 " />
            </el-form-item>&nbsp;
            <el-form-item label="楼层号">
                <el-tooltip effect="light" placement="bottom">
                    <template #content>
                        该楼栋的最高层数为{{ AddDetailedDialogData3.floorNumber }}
                    </template>
                    <el-input-number v-model=" AddDetailedDialogData.floorNumber " :min=" 1 "
                        :max=" AddDetailedDialogData3.floorNumber " />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="所在楼栋">
                <el-select v-model=" AddDetailedDialogData.buildingId " filterable style="width: 180px"
                    @change="AddDetailedDialogFunction(AddDetailedDialogData.buildingId)">
                    <el-option
                        v-for="                  item                   in                   AddDetailedDialogData2                  "
                        :key=" item.value " :label=" item.label " :value=" item.value " />
                </el-select>
            </el-form-item>
            <el-descriptions :column=" 1 " :size=" small " border direction="vertical">
                <el-descriptions-item label="寝室名称">
                    <el-space wrap>
                        <el-button :icon=" Refresh " type="warning" plain size="small"
                            @click=" clearAddDetailedTag "></el-button>
                        <div v-for="             tag              in              AddDetailedDialogData.nameList             "
                            :key=" tag ">
                            <el-tag closable :disable-transitions=" false " @close="CloseAddDetailedTag(tag)">
                                <div style="display: flex;">{{ tag }}</div>
                            </el-tag>
                        </div>
                        <el-button type="primary" plain size="small" :icon=" Plus " @click=" AddDetailedTag "
                            v-if=" !AddDetailedDialogInputShow "></el-button>
                        <el-input v-else size="small" @keyup.enter=" handleInputConfirm " @blur=" handleInputConfirm "
                            v-model=" AddDetailedDialogInputData " ref="refInput"></el-input>
                    </el-space>
                </el-descriptions-item>
            </el-descriptions>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="closeAddDetailedDialog()">取消</el-button>
                <el-button type="primary" @click=" AddDetailedForm() ">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
    <AddQuicklyDialogVue />
    <UpdateInfoDialogVue />
    <SeeInfoDialogVue />
    <UpdateStuDorDialogVue />
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}

:deep(.el-table__expand-icon) {
    display: none;
}</style>
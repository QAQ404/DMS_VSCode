<script setup>
import { ref, inject,onActivated } from 'vue'
import { ElMessage ,ElMessageBox} from 'element-plus'
import { dormitoryGetDormitoryListCascaderService } from '@/api/dormitory.js'
import { studentUpdateDorService } from '@/api/student.js'

const ifShowUpdateStuDorDialogVue = inject('ifShowUpdateStuDorDialogVue')
const changeISUID = inject('changeIfShowUpdateStuDorDialogVue')
const closeDialog = (ifF5) => {
    changeISUID(false,ifF5)
}
const UpdateStuDorDialogData = inject('UpdateStuDorDialogData')

const dormitoryList = ref([])
const getDormitoryList = async () => {
    let result = await dormitoryGetDormitoryListCascaderService();
    dormitoryList.value = result.data;
}


const dormitoryNameForm = (row, column, cellValue, index) => { //格式化寝室名称
    return row.buildingName + row.unitNumber + '单元' + row.floorNumber + '楼' + cellValue
}
const clazzNameForm = (row, column, cellValue, index) => {
    return row.insName + row.majorName + row.clazzYear + "级" + row.clazzName + "班"
}
const dormitoryId = ref('')
const changeDormitoryId = () => {
    dormitoryId.value = dormitoryId.value[3]
}

const ConfirmUpdate = ()=>{
    if(UpdateStuDorDialogData.value.length == 0){
        ElMessage.error('未选中学生')
    }
    else if(dormitoryId.value == ''){
        ElMessage.error('请选择迁入寝室')
    }
    else{
        ElMessageBox.confirm(
            '是否确认迁入寝室',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                let result = await studentUpdateDorService(UpdateStuDorDialogData.value,dormitoryId.value);
                dormitoryId.value = ref('').value;
                getDormitoryList()
                closeDialog(true)
                ElMessage({
                    type: 'success ',
                    message: '迁入成功',
                })
            })
    }
}
onActivated(()=>{
    getDormitoryList()
})
</script>

<template>
    <el-dialog v-model="ifShowUpdateStuDorDialogVue" @close="closeDialog(false)" title="迁入寝室">
        <el-table :data="UpdateStuDorDialogData" tooltip-effect="light" empty-text="未选中学生">
            <el-table-column prop="name" label="姓名" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="gender" label="性别" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="studyId" label="学号" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dormitoryName" label="寝室" :formatter="dormitoryNameForm" width="250"
                show-overflow-tooltip></el-table-column>
            <el-table-column prop="clazzName" label="班级" :formatter="clazzNameForm" width="250"
                show-overflow-tooltip></el-table-column>
        </el-table>
        <div style="padding-top: 5px;">
            <span>迁入寝室: </span>
            <el-cascader :options="dormitoryList" style="width: 370px;" v-model="dormitoryId" filterable
                :show-all-levels="false" @change="changeDormitoryId">
                <template #default="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    <span v-if="data.bed >= 0">(剩余床位:{{ data.bed }})</span>
                </template>
            </el-cascader>
        </div>
        <template #footer>
            <span>
                <el-button type="primary" @click="ConfirmUpdate">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>
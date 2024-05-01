<script setup>
import { useRouter } from 'vue-router'
import { ref, provide, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Refresh, Plus, Select } from '@element-plus/icons-vue'
import { clazzGetClazzListCascaderService } from '@/api/clazz.js'
import { AddStudentService } from '@/api/student.js'

const router = useRouter();
const backStudentVue = () => {
    router.back();
}

const AddStudentList = ref([])
const SelectAddStudentList = ref([])
const clazzList = ref([])
const getClazzList = async () => {
    let result = await clazzGetClazzListCascaderService();
    clazzList.value = result.data;
}

const AddTableColumn = () => {
    AddStudentList.value.push({ name: '', gender: '男', entranceYear: '2020', studyId: '', password: '123456', clazzId: '' })
}
const deleteTableColumn = (index) => {
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
            if (index !== -1) {
                AddStudentList.value.splice(index, 1)
            }
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
const clearTableColumn = () => {
    ElMessageBox.confirm(
        '是否确认清空',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            AddStudentList.value = ref([]).value
            ElMessage({
                type: 'success',
                message: '清空成功',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
const submitAddStudent = async () => {
    ElMessageBox.confirm(
        '是否确认添加',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let ifReturn = false;
            let ifReturn2 = false;
            let ifReturn3 = false;
            AddStudentList.value.forEach((item, i) => {
                if (!ifReturn) {
                    if (item.name === '' || item.entranceYear === null || item.studyId === '' || item.password === '' || item.clazzId === '') {
                        ElMessage.error("输入不能为空");
                        ifReturn = true;
                    }
                }
                if (!ifReturn2) {
                    if (item.name.length>20) {
                        ElMessage.error(item.name+":姓名需小于20位");
                        ifReturn2 = true;
                    }
                    else if(item.studyId.length>20){
                        ElMessage.error(item.studyId+":学号需小于20位");
                        ifReturn2 = true;
                    }
                    else if(item.password.length>20){
                        ElMessage.error(item.password+":密码需小于20位");
                        ifReturn2 = true;
                    }
                }
            })
            for(var i=0;i<AddStudentList.value.length;i++){
                for(var j = i+1;j<AddStudentList.value.length && !ifReturn3;j++){
                    if(AddStudentList.value[i].studyId == AddStudentList.value[j].studyId){
                        ifReturn3 = true;
                        ElMessage.error(AddStudentList.value[i].studyId+":输入重复学号");
                        break;
                    }
                }
                if(ifReturn3) break;
            }
            if (ifReturn) return;
            if (ifReturn2) return;
            if (ifReturn3) return;
            let result = await AddStudentService(AddStudentList.value);
            AddStudentList.value = ref([]).value
            router.push({ name: 'student' })
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消添加',
            })
        })
}
/* --------------------------------------多选框----------------------------------------------------------------------- */
const handleSelectionChange = (val) => {
    SelectAddStudentList.value = val
}
const SelectManyChange = (row, id) => {
    const index = SelectAddStudentList.value.indexOf(row)
    if (index !== -1) {
        if (id === 'name') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.name = row.name;
            })
        }
        else if (id === 'gender') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.gender = row.gender;
            })
        }
        else if (id === 'entranceYear') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.entranceYear = row.entranceYear;
            })
        }
        else if (id === 'studyId') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.studyId = row.studyId;
            })
        }
        else if (id === 'password') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.password = row.password;
            })
        }
        else if (id === 'clazzId') {
            SelectAddStudentList.value.forEach((item, i) => {
                item.clazzId = row.clazzId;
            })
        }
    }
}
/* ---------------------------------------------------------------------------------------------------------- */

onActivated(() => {
    getClazzList();
    AddStudentList.value.forEach((item, i) => {
        item.clazzId = ''
    })
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <el-page-header @back="backStudentVue">
                    <template #content>
                        <span> 添加学生 </span>
                    </template>
                </el-page-header>
            </div>
        </template>
        <el-table style="width: 100%;" :data="AddStudentList" tooltip-effect="light"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed="left"></el-table-column>
            <el-table-column type='index' label="序号" width="55"></el-table-column>
            <el-table-column label="姓名" width="200" show-overflow-tooltip>
                <template #default="{ row }">
                    <el-input placeholder="请输入姓名" v-model="row.name" clearable @input="SelectManyChange(row, 'name')" />
                </template>
            </el-table-column>
            <el-table-column label="性别" width="100">
                <template #default="{ row }">
                    <el-select v-model="row.gender" placeholder="" @change="SelectManyChange(row, 'gender')">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="年级" width="140">
                <template #default="{ row }">
                    <el-date-picker v-model="row.entranceYear" type="year" placeholder="选择年份" value-format="YYYY"
                        style="width:110px" @change="SelectManyChange(row, 'entranceYear')" />
                </template>
            </el-table-column>
            <el-table-column label="学号" width="200" show-overflow-tooltip>
                <template #default="{ row }">
                    <el-input placeholder="学号就是账号" v-model="row.studyId" clearable
                        @input="SelectManyChange(row, 'studyId')" />
                </template>
            </el-table-column>
            <el-table-column label="密码" width='200' show-overflow-tooltip>
                <template #default="{ row }">
                    <el-input placeholder="请输入密码" v-model="row.password" clearable
                        @input="SelectManyChange(row, 'password')" />
                </template>
            </el-table-column>
            <el-table-column label="班级" width="400">
                <template #default="{ row }">
                    <el-cascader :options="clazzList" style="width: 370px;" v-model="row.clazzId" placement="left-start"
                        @change="SelectManyChange(row, 'clazzId')" filterable :show-all-levels="false">
                        <template #default="{ node, data }">
                            <span>{{ data.label }}</span>
                            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                        </template>
                    </el-cascader>
                </template>
            </el-table-column>
            <el-table-column label="操作" with="100" fixed="right">
                <template #default="scope">
                    <el-button color="#F56C6C" :dark="isDark" plain :icon="Delete"
                        @click="deleteTableColumn(scope.$index)" />
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 5px;">
            <el-button @click="AddTableColumn" type="primary" :icon="Plus">添加</el-button>
            <el-button @click="clearTableColumn" type='warning' :icon="Refresh">清空</el-button>
            <el-button @click="submitAddStudent" type='success' :icon="Select">确认</el-button>
        </div>
    </el-card>
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
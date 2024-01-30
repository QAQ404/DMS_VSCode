<script setup>
//显示快速添加的弹窗组件
import { ref, inject } from 'vue'

const ifShowAddQuicklyDialogVue = inject('ifShowAddQuicklyDialogVue')
const changeIAQDV = inject('changeifAddQuicklyDialogVue');    //接收修改是否显示弹窗的功能
const closeDialog = () => {   //子用父，关闭弹窗
    changeIAQDV(false);
}

const AddQuicklyDialogType = inject('AddQuicklyDialogType')   //数据来源
const AddQuicklyDialogData = inject('AddQuicklyDialogData');  //从父组件中获取展示的数据
const AddQuicklyDialogData2 = inject('AddQuicklyDialogData2');
const AddQuicklyDialogData3 = inject('AddQuicklyDialogData3');
const giveReturnData = inject('giveReturnData')
const addDataBack = () => {
    giveReturnData();
}
const AddQuicklyDialogFunction = inject('AddQuicklyDialogFunction');
const Function = (value) => {
    AddQuicklyDialogFunction(value);
}
//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (AddQuicklyDialogData.value.rePassword !== AddQuicklyDialogData.value.password) callback(new Error("两次密码输入不一致"))
    else callback()
}
//定义表单校验规则
const rules = {
    rePassword: [
        { validator: checkRePassword, trigger: "blur" }
    ]
}


</script>

<template>
    <el-dialog v-model="ifShowAddQuicklyDialogVue" @close="closeDialog()" draggable title="快速添加">
        <div v-if="AddQuicklyDialogType === 'building'"> <!-- 宿舍快速添加 -->
            <el-form :data="AddQuicklyDialogData" autocomplete="off">
                <el-form-item label="楼栋名称">
                    <el-input v-model="AddQuicklyDialogData.name" placeholder="请输入楼栋名称" />
                </el-form-item>
                <el-form-item label="楼栋单元数">
                    <el-input-number v-model="AddQuicklyDialogData.unitNumber" :min="1" />
                </el-form-item>
                <el-form-item label="宿舍管理员">
                    <el-cascader placeholder="请选择对应的宿舍管理员" filterable :options="AddQuicklyDialogData2"
                        v-model="AddQuicklyDialogData.managerId" />
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="AddQuicklyDialogType === 'manager'"> <!-- 宿管快速添加 -->
            <el-form :data="AddQuicklyDialogData" autocomplete="off" :rules="rules" inline>
                <el-form-item label="登录账号">
                    <el-input v-model="AddQuicklyDialogData.username" placeholder="创建后不可修改" />
                </el-form-item>
                <el-form-item label="宿管姓名">
                    <el-input v-model="AddQuicklyDialogData.name" placeholder="请输入宿管姓名" />
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input v-model="AddQuicklyDialogData.password" placeholder="请输入登录密码" type="password" />
                </el-form-item>
                <el-form-item label="工作编号">
                    <el-input v-model="AddQuicklyDialogData.workId" placeholder="请输入工作编号(独一无二)" />
                </el-form-item>
                <el-form-item label="确认密码" prop="rePassword">
                    <el-input v-model="AddQuicklyDialogData.rePassword" placeholder="请再次输入登录密码" type="password" />
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="AddQuicklyDialogType === 'dormitory'"> <!-- 寝室快速添加 -->
            <el-form :data="AddQuicklyDialogData" autocomplete="off" :inline="true">
                <el-form-item label="名称">
                    <el-input v-model="AddQuicklyDialogData.name" placeholder="请输入寝室名称" />
                </el-form-item>
                <el-form-item label="单元号">
                    <el-tooltip effect="light" placement="top">
                        <template #content>
                            该楼栋的最大单元号为{{ AddQuicklyDialogData3.unitNumber }}
                        </template>
                        <el-input-number v-model="AddQuicklyDialogData.unitNumber" :min="1"
                            :max="AddQuicklyDialogData3.unitNumber" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="寝室床位数">
                    <el-input-number v-model="AddQuicklyDialogData.bedNumber" :min="0" />
                </el-form-item>&nbsp;
                <el-form-item label="楼层号">
                    <el-tooltip effect="light" placement="bottom">
                        <template #content>
                            该楼栋的最高层数为{{ AddQuicklyDialogData3.floorNumber }}
                        </template>
                        <el-input-number v-model="AddQuicklyDialogData.floorNumber" :min="1"
                            :max="AddQuicklyDialogData3.floorNumber" />
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="所在楼栋">
                    <el-select v-model="AddQuicklyDialogData.buildingId" filterable style="width: 180px"
                        @change="Function(AddQuicklyDialogData.buildingId)">
                        <el-option v-for="item in AddQuicklyDialogData2" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="AddQuicklyDialogType === 'institute'"> <!-- 学院快速添加 -->
            <el-form :data="AddQuicklyDialogData" autocomplete="off" >
                <el-form-item label="学院名称">
                    <el-input v-model="AddQuicklyDialogData.name" placeholder="请输入学院名称" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span>
                <el-button @click="closeDialog()">取消</el-button>
                <el-button type="primary" @click="addDataBack">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped></style>
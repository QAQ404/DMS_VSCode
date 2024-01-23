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
const giveReturnData = inject('giveReturnData')
const addDataBack = ()=>{
    giveReturnData();
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
    <div v-if="AddQuicklyDialogType==='building'"> <!-- 宿舍快速添加 -->
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
    <div v-else-if="AddQuicklyDialogType==='manager'"> <!-- 宿管快速添加 -->
        <el-form :data="AddQuicklyDialogData" autocomplete="off" :rules="rules" inline>
            <el-form-item label="登录账号">
                <el-input v-model="AddQuicklyDialogData.username" placeholder="创建后不可修改" />
            </el-form-item>
            <el-form-item label="宿管姓名" >
                <el-input v-model="AddQuicklyDialogData.name" placeholder="请输入宿管姓名" />
            </el-form-item>
            <el-form-item label="登录密码" > 
                <el-input v-model="AddQuicklyDialogData.password" placeholder="请输入登录密码" type="password"/>
            </el-form-item>
            <el-form-item label="工作编号" >
                <el-input v-model="AddQuicklyDialogData.workId" placeholder="请输入工作编号(独一无二)" />
            </el-form-item>
            <el-form-item label="确认密码" prop="rePassword">
                <el-input v-model="AddQuicklyDialogData.rePassword" placeholder="请再次输入登录密码" type="password"/>
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

<style scoped>

</style>
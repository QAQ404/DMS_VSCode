<script setup>
//修改详细信息的弹窗组件
import {
    Plus
} from '@element-plus/icons-vue'
import { ref, inject } from 'vue'
import defaultPicture from '@/assets/default2.jpg'
import defaultPicture2 from '@/assets/default.jpg'
import { useTokenStore } from '@/stores/token.js';
import { ElMessage } from 'element-plus'
const tokenStore = useTokenStore();
//照片上传的回调
const uploadSuccess = (result) => {
    if (result.data === 'big') {
        ElMessage.error('图片大小需小于1MB'); return;
    }
    UpdateInfoDialogData.value.picture = result.data;
}

const ifShowUpdateInfoDialog = inject('ifShowUpdateInfoDialogVue')
const changeISUID = inject('changeIfShowUpdateInfoDialogVue')
const closeDialog = () => {
    changeISUID(false)
}

const UpdateInfoDialogType = inject('UpdateInfoDialogType')
const UpdateInfoDialogData = inject('UpdateInfoDialogData')
const UpdateInfoDialogData2 = inject('UpdateInfoDialogData2')

const getReturnData = inject('getReturnData')
const addDataBack = () => {
    getReturnData();
}
</script>

<template>
    <el-dialog v-model="ifShowUpdateInfoDialog" @close="closeDialog()"  title="修改信息">
        <div v-if="UpdateInfoDialogType === 'building'"> <!-- 楼栋的更新表单 -->
            <el-form :model="UpdateInfoDialogData" :inline="true"> 
                <el-form-item label="楼栋名称" placeholder="请输入楼栋名称" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
                <el-form-item label="单元数" style="width: 40%;">
                    <el-input-number v-model="UpdateInfoDialogData.unitNumber" :min="1" />
                </el-form-item>
                <el-form-item label="寝室数" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.dorNumber" disabled />
                </el-form-item>
                <el-form-item label="学生数" style="width: 40%;">
                    <el-input v-model="UpdateInfoDialogData.stuNumber" disabled />
                </el-form-item>
                <el-form-item label="宿管">
                    <el-cascader placeholder="请选择对应的宿舍管理员" filterable :options="UpdateInfoDialogData2"
                        v-model="UpdateInfoDialogData.manId" />
                </el-form-item>
                <el-form-item label="建造年份" style="width: 40%;">
                    <el-date-picker v-model="UpdateInfoDialogData.buildYear" type="date" value-format="YYYY-MM-DD"
                        format="YYYY/MM/DD" />
                </el-form-item>
                <el-form-item label="楼层数" style="width: 40%;">
                    <el-input-number v-model="UpdateInfoDialogData.floorNumber" :min="1" />
                </el-form-item><br>
                <el-form-item label="照片">
                    <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="UpdateInfoDialogData.picture" :src="UpdateInfoDialogData.picture" class="avatar" />
                        <div v-else> <img :src="defaultPicture" class="avatar" /> </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="介绍" style="width: 100%;">
                    <el-input v-model="UpdateInfoDialogData.introduction" type="textarea" :rows="6"
                        placeholder="关于楼栋...." />
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="UpdateInfoDialogType === 'manager'"> <!-- 宿管的更新表单 -->
            <el-form :data="UpdateInfoDialogData" inline> 
                <el-form-item label="编号" placeholder="请输入宿管姓名" style="width: 40%;">
                    <el-input v-model="UpdateInfoDialogData.workId" />
                </el-form-item>
                <el-form-item label="姓名" placeholder="请输入宿管姓名" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
                <el-form-item label="账号" style="width: 50%;">
                    <el-input v-model="UpdateInfoDialogData.username" disabled/>
                </el-form-item>
                <el-form-item label="性别" style="width: 30%;">
                    <el-select v-model="UpdateInfoDialogData.gender">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" placeholder="请输入宿管姓名" style="width: 40%;">
                    <el-input v-model="UpdateInfoDialogData.phone" />
                </el-form-item>
                <el-form-item label="邮箱" placeholder="请输入宿管姓名" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.email" />
                </el-form-item>
                <el-form-item label="照片">
                    <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="UpdateInfoDialogData.picture" :src="UpdateInfoDialogData.picture" class="avatar" />
                        <div v-else> <img :src="defaultPicture2" class="avatar2" /> </div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span>
                <el-button type="primary" @click="addDataBack">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.avatar {
    width: 185px;
    height: 150px;
    display: block;
}
.avatar2 {
    width: 150px;
    height: 150px;
    display: block;
}
</style>
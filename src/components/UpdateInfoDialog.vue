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
const UpdateInfoDialogData3 = inject('UpdateInfoDialogData3')

const getReturnData = inject('getReturnData')
const addDataBack = () => {
    getReturnData();
}

const UpdateInfoDialogFunction = inject('UpdateInfoDialogFunction');
const Function = (value) => {
    UpdateInfoDialogFunction(value);
}
</script>

<template>
    <el-dialog v-model="ifShowUpdateInfoDialog" @close="closeDialog()" title="修改信息">
        <div v-if="UpdateInfoDialogType === 'building'"> <!-- 楼栋的更新表单 -->
            <el-form :model="UpdateInfoDialogData" :inline="true">
                <el-form-item label="楼栋名称" placeholder="请输入楼栋名称" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
                <el-form-item label="单元数" style="width: 40%;">
                    <el-tooltip effect="light" placement="top">
                        <template #content>
                            <div v-if="UpdateInfoDialogData3.msg === 0">
                                该楼现存寝室中单元号最大为{{ UpdateInfoDialogData3.unitNumber }}
                            </div>
                            <div v-else>该宿舍楼未拥有寝室</div>
                        </template>
                        <el-input-number v-model="UpdateInfoDialogData.unitNumber"
                            :min="UpdateInfoDialogData3.unitNumber" />
                    </el-tooltip>
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
                    <el-tooltip effect="light" placement="bottom">
                        <template #content>
                            <div v-if="UpdateInfoDialogData3.msg === 0">
                                该楼现存寝室中楼层最高为{{ UpdateInfoDialogData3.floorNumber }}
                            </div>
                            <div v-else>该宿舍楼未拥有寝室</div>
                        </template>
                        <el-input-number v-model="UpdateInfoDialogData.floorNumber"
                            :min="UpdateInfoDialogData3.floorNumber" />
                    </el-tooltip>
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
                <el-form-item label="编号" style="width: 40%;">
                    <el-input v-model="UpdateInfoDialogData.workId" placeholder="请输入工作编号" />
                </el-form-item>
                <el-form-item label="姓名" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="账号" style="width: 50%;">
                    <el-input v-model="UpdateInfoDialogData.username" disabled />
                </el-form-item>
                <el-form-item label="性别" style="width: 30%;">
                    <el-select v-model="UpdateInfoDialogData.gender">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" style="width: 40%;">
                    <el-input v-model="UpdateInfoDialogData.phone" placeholder="请输入电话" />
                </el-form-item>
                <el-form-item label="邮箱" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="照片">
                    <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="UpdateInfoDialogData.picture" :src="UpdateInfoDialogData.picture" class="avatar2" />
                        <div v-else> <img :src="defaultPicture2" class="avatar2" /> </div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="UpdateInfoDialogType === 'dormitory'"> <!-- 宿管的更新表单 -->
            <el-form :data="UpdateInfoDialogData" inline>
                <el-form-item label="寝室名称" placeholder="请输入寝室名称" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
                <el-form-item label="单元号" style="width: 40%;">
                    <el-tooltip effect="light" placement="top">
                        <template #content>
                            该楼的最大单元号为{{ UpdateInfoDialogData3.unitNumber }}
                        </template>
                        <el-input-number v-model="UpdateInfoDialogData.unitNumber"
                            :max="UpdateInfoDialogData3.unitNumber" :min="1"/>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="入住人数" style="width: 45%;">
                    <el-input v-model="UpdateInfoDialogData.stuNumber" disabled />
                </el-form-item>
                <el-form-item label="床位数" style="width: 40%;">
                    <el-input-number v-model="UpdateInfoDialogData.bedNumber" :min="UpdateInfoDialogData.stuNumber"/>
                </el-form-item>
                <el-form-item label="所在楼栋">
                    <el-select v-model="UpdateInfoDialogData.buildingId" filterable style="width: 200px"
                        @change="Function(UpdateInfoDialogData.buildingId)">
                        <el-option v-for="item in UpdateInfoDialogData2" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所在楼层" style="width: 40%;">
                    <el-tooltip effect="light" placement="bottom">
                        <template #content>
                                该楼共有{{ UpdateInfoDialogData3.floorNumber }}层
                        </template>
                        <el-input-number v-model="UpdateInfoDialogData.floorNumber"
                            :max="UpdateInfoDialogData3.floorNumber" :min="1"/>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="寝室照片">
                    <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                        :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="UpdateInfoDialogData.picture" :src="UpdateInfoDialogData.picture" class="avatar" />
                        <div v-else> <img :src="defaultPicture" class="avatar" /> </div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="UpdateInfoDialogType === 'institute'"> <!-- 学院的更新表单 -->
            <el-form :data="UpdateInfoDialogData">
                <el-form-item label="学院名称" placeholder="请输入学院名称">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="UpdateInfoDialogType === 'major'"> <!-- 专业的更新表单 -->
            <el-form :data="UpdateInfoDialogData">
                <el-form-item label="专业名称" placeholder="请输入专业名称">
                    <el-input v-model="UpdateInfoDialogData.name" />
                </el-form-item>
            </el-form>
        </div>
        <div v-else-if="UpdateInfoDialogType === 'clazz'"> <!-- 专业的更新表单 -->
            <el-form :data="UpdateInfoDialogData">
                <el-form-item label="班级号">
                    <el-input-number v-model="UpdateInfoDialogData.name" />
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
    width: 140px;
    height: 180px;
    display: block;
}</style>
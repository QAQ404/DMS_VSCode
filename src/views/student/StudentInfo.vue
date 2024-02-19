<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, provide, onActivated } from 'vue'
import { getStudentByIdService } from '@/api/student.js'
import defaultPicture from '@/assets/default.jpg'

const router = useRouter();
const route = useRoute();
let studentId = route.params.studentId;
const studentInfoData = ref({ studentInfo: {} })
const getStudentInfo = async (id) => {
    let result = await getStudentByIdService(id);
    studentInfoData.value = result.data;
}

const GoToUpdateVue = (studentId) => {
    router.push({ name: 'studentUpdate', params: { studentId } })
}

const backStudentVue = () => {
    router.back();
}
onActivated(() => {
    studentId = route.params.studentId;
    getStudentInfo(studentId)
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <el-page-header @back="backStudentVue">
                    <template #content>
                        <span> 学生详细信息 </span>
                    </template>
                </el-page-header>
                <el-button type="primary" plain @click="GoToUpdateVue(studentId)">修改信息</el-button>
            </div>
        </template>
        <el-descriptions :column="3" size="large" border>
            <el-descriptions-item>
                <template #label> 姓名 </template>
                {{ studentInfoData.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 性别 </template>
                {{ studentInfoData.gender }}
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 照片 </template>
                <div>
                    <el-image v-if="studentInfoData.studentInfo.picture" :src="studentInfoData.studentInfo.picture"
                        class="avatar" :fit="fill" :preview-src-list="[studentInfoData.studentInfo.picture]" />
                    <el-image v-else :src="defaultPicture" class="avatar" :fit="fill"
                        :preview-src-list="[defaultPicture]" />
                </div>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 入学年份 </template>
                {{ studentInfoData.entranceYear }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 学号/账号 </template>
                {{ studentInfoData.studyId }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 电话 </template>
                {{ studentInfoData.studentInfo.phone }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 宿舍楼 </template>
                {{ studentInfoData.buildingName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 寝室 </template>
                {{ studentInfoData.unitNumber }}单元 {{ studentInfoData.floorNumber }}楼 {{ studentInfoData.dormitoryName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 民族 </template>
                {{ studentInfoData.studentInfo.ethnicity }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 学院 </template>
                {{ studentInfoData.insName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 专业 </template>
                {{ studentInfoData.majorName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 班级 </template>
                {{ studentInfoData.clazzYear }}级 {{ studentInfoData.clazzName }}班
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 生日 </template>
                {{ studentInfoData.studentInfo.birthday }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 邮箱 </template>
                {{ studentInfoData.studentInfo.email }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 更新时间 </template>
                {{ studentInfoData.studentInfo.updateTime }}
            </el-descriptions-item>
            <el-descriptions-item :span="3">
                <template #label> 个人介绍 </template>
                <el-input v-model="studentInfoData.studentInfo.introduction" :rows="6" type="textarea" disabled />
            </el-descriptions-item>
        </el-descriptions>
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

.avatar {
    width: 100px;
    height: 120px;
    display: block;
}
</style>
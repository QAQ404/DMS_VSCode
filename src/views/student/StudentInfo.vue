<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, provide } from 'vue'
import { getStudentByIdService } from '@/api/student.js'
const router = useRouter();
const route = useRoute();
let studentId = route.params.studentId;
const studentInfoData = ref({})
const getStudentInfo = async (id) => {
    let result = await getStudentByIdService(id);
    studentInfoData.value = result.data;
}
getStudentInfo(studentId);

const backStudentVue = () => {
    router.back();
}
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
            </div>
        </template>
        学生详细信息{{ studentInfoData }}
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
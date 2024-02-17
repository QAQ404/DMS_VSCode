<script setup>
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, provide } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudentByIdService } from '@/api/student.js'
import { clazzGetClazzListCascaderService } from '@/api/clazz.js'
import defaultPicture from '@/assets/default.jpg'
const router = useRouter();
const route = useRoute();
let studentId = route.params.studentId;

const oldData = ref({ studentInfo: {} })
const studentInfoData = ref({ studentInfo: {} })
const getStudentInfo = async (id) => {
    let result = await getStudentByIdService(id);
    studentInfoData.value = result.data;
    for (let key in result.data) {
        let value = result.data[key];
        Reflect.set(oldData.value, key, value)
    }
}
getStudentInfo(studentId)

const clazzList = ref([])
const getClazzList = async () => {
    let result = await clazzGetClazzListCascaderService();
    clazzList.value = result.data;
}
getClazzList()

const backStudentVue = () => {
    router.back();
}

const ObjectEqual = (oldV, newV) => {
    let res = true;
    for (let key in oldV) {
        if (oldV[key] != newV[key]) {
            res = false;
            break;
        }
    }
    return res;
}
onBeforeRouteLeave((to, from, next) => {
    if (!ObjectEqual(oldData.value, studentInfoData.value)) {
        ElMessageBox.confirm(
            '暂未保存，是否退出修改',
            '温馨提示',
            {
                confirmButtonText: '不保存并退出',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                next()
                ElMessage({
                    type: 'info',
                    message: '取消保存',
                })
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    }
    else {
        next()
    }
})

</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <el-page-header @back="backStudentVue">
                    <template #content>
                        <span> 修改学生信息</span>
                    </template>
                </el-page-header>
            </div>
        </template>
        {{ studentInfoData }}<br />
    </el-card>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}
</style>
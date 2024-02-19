<script setup>
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, provide } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTokenStore } from '@/stores/token.js';
import { getStudentByIdService, UpdateStudentInfoService } from '@/api/student.js'
import {managerUpdatePasswordService} from '@/api/manager.js'
import { clazzGetClazzListCascaderService } from '@/api/clazz.js'
import { dormitoryGetDormitoryListCascaderService } from '@/api/dormitory.js'
import defaultPicture from '@/assets/default.jpg'
const tokenStore = useTokenStore();
//照片上传的回调
const uploadSuccess = (result) => {
    if (result.data === 'big') {
        ElMessage.error('图片大小需小于1MB'); return;
    }
    UpdateInfoDialogData.value.picture = result.data;
}

const nationList = ref([
    {
        "id": "01",
        "name": "汉族"
    },
    {
        "id": "02",
        "name": "蒙古族"
    },
    {
        "id": "03",
        "name": "回族"
    },
    {
        "id": "04",
        "name": "藏族"
    },
    {
        "id": "05",
        "name": "维吾尔族"
    },
    {
        "id": "06",
        "name": "苗族"
    },
    {
        "id": "07",
        "name": "彝族"
    },
    {
        "id": "08",
        "name": "壮族"
    },
    {
        "id": "09",
        "name": "布依族"
    },
    {
        "id": "10",
        "name": "朝鲜族"
    },
    {
        "id": "11",
        "name": "满族"
    },
    {
        "id": "12",
        "name": "侗族"
    },
    {
        "id": "13",
        "name": "瑶族"
    },
    {
        "id": "14",
        "name": "白族"
    },
    {
        "id": "15",
        "name": "土家族"
    },
    {
        "id": "16",
        "name": "哈尼族"
    },
    {
        "id": "17",
        "name": "哈萨克族"
    },
    {
        "id": "18",
        "name": "傣族"
    },
    {
        "id": "19",
        "name": "黎族"
    },
    {
        "id": "20",
        "name": "傈僳族"
    },
    {
        "id": "21",
        "name": "佤族"
    },
    {
        "id": "22",
        "name": "畲族"
    },
    {
        "id": "23",
        "name": "高山族"
    },
    {
        "id": "24",
        "name": "拉祜族"
    },
    {
        "id": "25",
        "name": "水族"
    },
    {
        "id": "26",
        "name": "东乡族"
    },
    {
        "id": "27",
        "name": "纳西族"
    },
    {
        "id": "28",
        "name": "景颇族"
    },
    {
        "id": "29",
        "name": "柯尔克孜族"
    },
    {
        "id": "30",
        "name": "土族"
    },
    {
        "id": "31",
        "name": "达斡尔族"
    },
    {
        "id": "32",
        "name": "仫佬族"
    },
    {
        "id": "33",
        "name": "羌族"
    },
    {
        "id": "34",
        "name": "布朗族"
    },
    {
        "id": "35",
        "name": "撒拉族"
    },
    {
        "id": "36",
        "name": "毛难族"
    },
    {
        "id": "37",
        "name": "仡佬族"
    },
    {
        "id": "38",
        "name": "锡伯族"
    },
    {
        "id": "39",
        "name": "阿昌族"
    },
    {
        "id": "40",
        "name": "普米族"
    },
    {
        "id": "41",
        "name": "塔吉克族"
    },
    {
        "id": "42",
        "name": "怒族"
    },
    {
        "id": "43",
        "name": "乌孜别克族"
    },
    {
        "id": "44",
        "name": "俄罗斯族"
    },
    {
        "id": "45",
        "name": "鄂温克族"
    },
    {
        "id": "46",
        "name": "崩龙族"
    },
    {
        "id": "47",
        "name": "保安族"
    },
    {
        "id": "48",
        "name": "裕固族"
    },
    {
        "id": "49",
        "name": "京族"
    },
    {
        "id": "50",
        "name": "塔塔尔族"
    },
    {
        "id": "51",
        "name": "独龙族"
    },
    {
        "id": "52",
        "name": "鄂伦春族"
    },
    {
        "id": "53",
        "name": "赫哲族"
    },
    {
        "id": "54",
        "name": "门巴族"
    },
    {
        "id": "55",
        "name": "珞巴族"
    },
    {
        "id": "56",
        "name": "基诺族"
    }
]
)

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
        if (key != 'studentInfo')
            Reflect.set(oldData.value, key, value)
        else {
            for (let key2 in result.data.studentInfo) {
                let value2 = result.data.studentInfo[key2];
                Reflect.set(oldData.value.studentInfo, key2, value2)
            }
        }
    }
}
getStudentInfo(studentId)

const clazzList = ref([])
const getClazzList = async () => {
    let result = await clazzGetClazzListCascaderService();
    clazzList.value = result.data;
}
getClazzList()

const dormitoryList = ref([])
const getDormitoryList = async () => {
    let result = await dormitoryGetDormitoryListCascaderService();
    dormitoryList.value = result.data;
}
getDormitoryList()

const changeClazzId = () => {
    studentInfoData.value.clazzId = studentInfoData.value.clazzId[2]
}

const changeDormitoryId = () => {
    studentInfoData.value.dormitoryId = studentInfoData.value.dormitoryId[3]
}

const giveUpdate = async () => { //提交修改
    if (studentInfoData.value.name === '' || studentInfoData.value.entranceYear === null) {
        ElMessage.error('输入不能为空');
    }
    else if (studentInfoData.value.name.length > 20) { ElMessage.error("姓名需小于20位"); }
    else if (studentInfoData.value.studentInfo.phone !== null && studentInfoData.value.studentInfo.phone.length > 11) { ElMessage.error("电话需小于11位"); }
    else if (studentInfoData.value.studentInfo.email!==null && studentInfoData.value.studentInfo.email.length > 128) { ElMessage.error("邮箱长度过长"); }
    else {
        ElMessageBox.confirm(
            '是否确认修改',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                let result = await UpdateStudentInfoService(studentInfoData.value);
                getStudentInfo(studentId)
                ElMessage({
                    type: 'success ',
                    message: '修改成功',
                })
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消修改',
                })
            })
    }
}
/* -----------------------------------------更改密码--------------------------------------------------------- */
const ifShowUpdatePasswordDialog = ref(false)
const updatePasswordData = ref({ id: '' })
const SeeUpdatePasswordDialog = (id) => {
    ifShowUpdatePasswordDialog.value = true;
    updatePasswordData.value = ref({ id: '' }).value;
    updatePasswordData.value.id = id;
}
const closeUpdatePasswordDialog = () => {
    ifShowUpdatePasswordDialog.value = false;
}
const UpdatePassword = async () => {
    if(updatePasswordData.value.password.length>32) ElMessage.error('密码需小于32位');
    else{
        let result = await managerUpdatePasswordService(updatePasswordData.value);
        ElMessage.success(result.message ? result.message : '添加成功');
        closeUpdatePasswordDialog();
    }
}
/* ----------------------------------------------------------------------------------------------------- */
const checkRePassword = (rule, value, callback) => {
    if (updatePasswordData.value.rePassword !== updatePasswordData.value.password) callback(new Error("两次密码输入不一致"))
    else callback()
}
//定义表单校验规则
const rules = {
    rePassword: [
        { validator: checkRePassword, trigger: "blur" }
    ]
}

const backStudentVue = () => {
    router.back();
}

const ObjectEqual = (oldV, newV) => {
    let res = true;
    for (let key in oldV) {
        if (key == 'studentInfo') {
            res = ObjectEqual(oldV.studentInfo, newV.studentInfo);
            if (!res) break;
        }
        else if (oldV[key] != newV[key]) {
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
                <el-button type="warning" @click="SeeUpdatePasswordDialog(studentId)">修改密码</el-button>
            </div>
        </template>
        <el-descriptions :column="3" size="large" direction="vertical">
            <el-descriptions-item>
                <template #label> 姓名 </template>
                <el-input v-model="studentInfoData.name" class="input-width" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 性别 </template>
                <el-select v-model="studentInfoData.gender" placeholder="" style="width: 100px;">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item> <template #label> 照片 </template>
                <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="studentInfoData.studentInfo.picture" :src="studentInfoData.studentInfo.picture"
                        class="avatar" />
                    <div v-else> <img :src="defaultPicture" class="avatar" /> </div>
                </el-upload>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 入学年份 </template>
                <el-date-picker v-model="studentInfoData.entranceYear" type="year" value-format="YYYY"
                    style="width:150px" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 学号/账号 </template>
                <el-input v-model="studentInfoData.studyId" class="input-width" disabled/>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 电话 </template>
                <el-input v-model="studentInfoData.studentInfo.phone" class="input-width" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 民族 </template>
                <el-select v-model="studentInfoData.studentInfo.ethnicity" filterable placeholder="" style="width: 150px;">
                    <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 生日 </template>
                <el-date-picker v-model="studentInfoData.studentInfo.birthday" type="date" value-format="YYYY-MM-DD" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 邮箱 </template>
                <el-input v-model="studentInfoData.studentInfo.email" class="input-width" />
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 寝室 </template>
                <el-cascader :options="dormitoryList" style="width: 370px;" v-model="studentInfoData.dormitoryId" filterable
                    :show-all-levels="false" @change="changeDormitoryId">
                    <template #default="{ node, data }">
                        <span>{{ data.label }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                        <span v-if="data.bed >= 0">(剩余床位:{{ data.bed }})</span>
                    </template>
                </el-cascader>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label> 班级 </template>
                <el-cascader :options="clazzList" style="width: 370px;" v-model="studentInfoData.clazzId" filterable
                    :show-all-levels="false" @change="changeClazzId">
                    <template #default="{ node, data }">
                        <span>{{ data.label }}</span>
                        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                    </template>
                </el-cascader>
            </el-descriptions-item>
            <el-descriptions-item></el-descriptions-item>
            <el-descriptions-item :span="3">
                <template #label> 个人介绍 </template>
                <el-input v-model="studentInfoData.studentInfo.introduction" :rows="6" type="textarea" />
            </el-descriptions-item>
        </el-descriptions>
        <div>
            <el-button type="primary" @click="giveUpdate">确认修改</el-button>
        </div>
    </el-card>
    <!-- 修改密码对话框 -->
    <el-dialog v-model="ifShowUpdatePasswordDialog" @close="closeUpdatePasswordDialog()" title="修改密码">
        <el-form :data="updatePasswordData" label-width="150px" :rules="rules" autocomplete="off">
            <el-form-item label="新的密码" style="width: 80%;">
                <el-input v-model="updatePasswordData.password" placeholder="请输入新的密码" type="password" />
            </el-form-item>
            <el-form-item label="确认密码" style="width: 80%;" prop="rePassword">
                <el-input v-model="updatePasswordData.rePassword" placeholder="请再次输入密码" type="password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button @click="closeUpdatePasswordDialog()"> 取消 </el-button>
                <el-button type="primary" @click="UpdatePassword"> 确认 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
}

.input-width {
    width: 200px;
}

.avatar {
    width: 40px;
    height: 50px;
    display: block;
}
</style>
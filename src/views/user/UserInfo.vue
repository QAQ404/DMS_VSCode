<script setup>
import { ref, provide, onActivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import defaultPicture2 from '@/assets/default.jpg'

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

//照片上传的回调
const uploadSuccess = (result) => {
    if (result.data === 'big') {
        ElMessage.error('图片大小需小于1MB'); return;
    }
    UserData.value.picture = result.data;
}
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

import { useRouter, onBeforeRouteLeave } from 'vue-router';
const router = useRouter();

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

import { managerGetByIdService, managerUpdatePasswordService, managerUpdateService } from '@/api/manager.js'
import { getStudentByIdService, UpdateStudentInfoService } from '@/api/student.js'

import { clazzGetClazzListCascaderService } from '@/api/clazz.js'
import { dormitoryGetDormitoryListCascaderService } from '@/api/dormitory.js'
const clazzList = ref([])
const getClazzList = async () => {
    let result = await clazzGetClazzListCascaderService();
    clazzList.value = result.data;
}
const dormitoryList = ref([])
const getDormitoryList = async () => {
    let result = await dormitoryGetDormitoryListCascaderService();
    dormitoryList.value = result.data;
}

const UserData = ref({studentInfo:{}})
const oldData = ref({studentInfo:{}})
const getUserData = async () => {
    if (userInfoStore.info.role === 1) {
        let result = await getStudentByIdService(userInfoStore.info.id);
        UserData.value = result.data;
    }
    else {
        let result = await managerGetByIdService(userInfoStore.info.id);
        UserData.value = result.data;
        
    }
    for (let key in UserData.value) {
        let value = UserData.value[key];
        if (key != 'studentInfo')
            Reflect.set(oldData.value, key, value)
        else {
            for (let key2 in UserData.value.studentInfo) {
                let value2 = UserData.value.studentInfo[key2];
                Reflect.set(oldData.value.studentInfo, key2, value2)
            }
        }
    }
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
/* -----------------------------------更改密码------------------------------------------------ */
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
    if (updatePasswordData.value.password.length > 32) ElMessage.error('密码需小于32位');
    else {
        let result = await managerUpdatePasswordService(updatePasswordData.value);
        ElMessage.success(result.message ? result.message : '添加成功');
        closeUpdatePasswordDialog();
    }
}
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
/* ----------------------------------------------------------------------------------- */
const sumbitUpdate = async () => {
    if (userInfoStore.info.role === 1) {
        if (UserData.value.name === '') { ElMessage.error('姓名输入不能为空'); }
        else if (UserData.value.entranceYear === null) { ElMessage.error('入学年份输入不能为空'); }
        else if (UserData.value.name.length > 20) { ElMessage.error("姓名需小于20位"); }
        else if (UserData.value.studentInfo.phone !== null && UserData.value.studentInfo.phone.length > 11) { ElMessage.error("电话需小于11位"); }
        else if (UserData.value.studentInfo.email !== null && UserData.value.studentInfo.email.length > 128) { ElMessage.error("邮箱长度过长"); }
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
                    let result = await UpdateStudentInfoService(UserData.value);
                    userInfoStore.info.name = UserData.value.name;
                    userInfoStore.info.picture = UserData.value.picture;
                    getUserData()

                    ElMessage({
                        type: 'success ',
                        message: '修改成功',
                    })
                })
        }
    }
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
                let result = await managerUpdateService(UserData.value, oldData.value.workId);
                userInfoStore.info.name = UserData.value.name;
                userInfoStore.info.picture = UserData.value.picture;
                getUserData()
                ElMessage({
                    type: 'success ',
                    message: '修改成功',
                })
            })
    }
}
/* ----------------------------------------------------------------------------------- */
onBeforeRouteLeave((to, from, next) => {
    if (!ObjectEqual(oldData.value, UserData.value)) {
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
    }
    else {
        next()
    }
})

onActivated(() => {
    getUserData()
    getClazzList()
    getDormitoryList()
})
</script>

<template>
    <el-card style="min-height: 99%;">
        <template #header> <!-- 卡片顶部区域 -->
            <div class="card-header">
                <span> 我的资料</span>

            </div>
        </template>
        <!-- --------------------------学生---------------------------------------- -->
        <el-form :model="UserData" v-if="userInfoStore.info.role === 1" :inline="true">
            <el-form-item label="姓名"><el-input v-model="UserData.name" placeholder="请输入姓名"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="性别">
                <el-select v-model="UserData.gender" style="width: 200px;">
                    <el-option label="男" value="男" /><el-option label="女" value="女" />
                </el-select>
            </el-form-item>
            <el-form-item label="电话"><el-input v-model="UserData.phone" placeholder="请输入电话"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="邮箱"><el-input v-model="UserData.email" placeholder="请输入邮箱"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="学号"><el-input v-model="UserData.studyId" disabled
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="入学年份">
                <el-date-picker v-model="UserData.entranceYear" type="year" value-format="YYYY"
                    style="width:320px" disabled/>
            </el-form-item>
            <el-form-item label="民族">
                <el-select v-model="UserData.studentInfo.ethnicity" filterable placeholder="" style="width: 350px;">
                    <el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="UserData.studentInfo.birthday" type="date" value-format="YYYY-MM-DD" style="width: 350px;" />
            </el-form-item>
            <el-form-item label="寝室">
                <el-cascader :options="dormitoryList" style="width: 350px;" v-model="UserData.dormitoryId" filterable
                    :show-all-levels="false" disabled>
                    <template #default="{ node, data }">
                        <span>{{ data.label }}</span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item label="班级">
                <el-cascader :options="clazzList" style="width: 350px;" v-model="UserData.clazzId" filterable
                    :show-all-levels="false" disabled>
                    <template #default="{ node, data }">
                        <span>{{ data.label }}</span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item label="照片">
                <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="UserData.studentInfo.picture" :src="UserData.studentInfo.picture" class="avatar" />
                    <div v-else> <img :src="defaultPicture2" class="avatar" /> </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="个人介绍">
                <el-input v-model="UserData.studentInfo.introduction" :rows="9" type="textarea" style="width:520px"/>
            </el-form-item>
        </el-form>
        <!-- --------------------------管理员---------------------------------------- -->
        <el-form :model="UserData" v-if="userInfoStore.info.role !== 1" :inline="true">
            <el-form-item label="姓名"><el-input v-model="UserData.name" placeholder="请输入姓名"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="性别">
                <el-select v-model="UserData.gender" style="width: 200px;">
                    <el-option label="男" value="男" /><el-option label="女" value="女" />
                </el-select>
            </el-form-item>
            <el-form-item label="电话"><el-input v-model="UserData.phone" placeholder="请输入电话"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="邮箱"><el-input v-model="UserData.email" placeholder="请输入邮箱"
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="账号"><el-input v-model="UserData.username" disabled
                    class="input-width"></el-input></el-form-item>
            <el-form-item label="工作编号"><el-input v-model="UserData.workId" class="input-width"></el-input></el-form-item>
            <el-form-item label="照片">
                <el-upload :auto-upload="true" :show-file-list="false" action="/api/upload" name="file"
                    :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                    <img v-if="UserData.picture" :src="UserData.picture" class="avatar" />
                    <div v-else> <img :src="defaultPicture2" class="avatar" /> </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="warning" @click="SeeUpdatePasswordDialog(userInfoStore.info.id)">修改密码</el-button>
            <el-button type="primary" @click="sumbitUpdate">保存修改</el-button>
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
    width: 350px;
}

.avatar {
    width: 150px;
    height: 200px;
    display: block;
}
</style>
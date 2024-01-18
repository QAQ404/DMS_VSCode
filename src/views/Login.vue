<script setup>
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'

const user = ref({
    username: '',
    password: ''
})

import { userLoginService } from '@/api/user.js'
import {useTokenStore} from '@/stores/token.js';
const tokemStore = useTokenStore();

const login = async () => {
    let result = await userLoginService(user.value);
    ElMessage.success("登录成功");
    tokemStore.setToken(result.data);

}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="15" class="bg"></el-col>
        <el-col :span="7" :offset="1" class="form">
            <el-card class="card">
                <el-form size="large" autocomplete="off" :model="user">
                    <el-form-item>
                        <h1>宿舍管理系统</h1>
                    </el-form-item>
                    <el-form-item>
                        <el-input :prefix-icon="User" placeholder="请输入账号" v-model="user.username"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                            v-model="user.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="button" type="warning" auto-insert-space @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #f8e3c5;

    .bg {
        background: url('@/assets/login.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none; //用户是否可以选中文本

        .button {
            width: 100%;
        }
    }

    .card {
        background-color: #fdf6ec;
        border-radius: 20px;
    }

    h1 {
        color: #b88230;
    }
}
</style>
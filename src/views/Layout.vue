<script setup>
import { UserFilled, SwitchButton, School, Postcard, OfficeBuilding, HomeFilled, User, House, Connection, Reading } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import avatar from '@/assets/default.jpg'
import { ref } from 'vue'

import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

import { userExitService, userGetInfoService } from '@/api/user.js'
import router from '@/routers'

//右上角头像的下拉菜单的选项响应
const dropCommand = (command) => {
    if (command === 'logout') { //推出登录
        ElMessageBox.confirm(
            '是否确认退出',
            '退出登录',
            {
                confirmButtonText: '退出',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //后端退出
                let result = await userExitService();
                //清空pinia和token
                tokenStore.removeToken();
                userInfoStore.removeInfo();

                ElMessage({
                    type: 'success',
                    message: '退出登录',
                })
                router.push('/login');
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    } else {
        //路由
        router.push('/user/' + command);
    }
}

import { useUserInfoStore } from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

//把该账号的id和角色类型存到pinia中
const getUserInfoMethod = async () => {
    let result = await userGetInfoService();
    userInfoStore.setInfo(result.data);
}
getUserInfoMethod();

</script>

<template>
    <el-container class="layout">
        <!-- 头部 -->
        <el-header class="e-header">
            <div class="header-in"> <!-- 左边的图标和标题 -->
                <el-space>
                    <el-icon size="50">
                        <School />
                    </el-icon>
                    <h2>宿舍管理系统</h2>
                </el-space>
            </div>
            <div class="header-in"> <!-- 右边的欢迎和头像 -->
                <el-space>
                    <div>欢迎你，{{ userInfoStore.info.name }}</div>
                    <el-dropdown placement="bottom-end" @command="dropCommand">
                        <span class="e-avatar">
                            <el-avatar :src="avatar" :size="35" />
                        </span>
                        <template #dropdown> <!-- 头像下拉菜单的插槽 -->
                            <el-dropdown-menu class="user-select-none">
                                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-space>
            </div>
        </el-header>
        <el-container style="user-select: none;">
            <!-- 页面左边菜单栏 -->
            <el-aside class="e-left-menu">
                <el-menu active-text-color="#ffd04b"  background-color="#545c64" text-color="#fff"
                    router>
                    <el-sub-menu index="1">
                        <template #title>
                            <span>宿舍管理</span>
                        </template>
                        <el-menu-item index="/dormitory">
                            <el-icon>
                                <HomeFilled />
                            </el-icon>
                            <span>寝室管理</span>
                        </el-menu-item>
                        <el-menu-item index="/building">
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                            <span>楼栋管理</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/student">
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>学生管理</span>
                    </el-menu-item>
                    <el-sub-menu indx="2">
                        <template #title>
                            <span>学院信息</span>
                        </template>
                        <el-menu-item index="/institute">
                            <el-icon>
                                <School />
                            </el-icon>
                            <span>学院管理</span>
                        </el-menu-item>
                        <el-menu-item index="/major">
                            <el-icon>
                                <Reading />
                            </el-icon>
                            <span>专业管理</span>
                        </el-menu-item>
                        <el-menu-item index="/clazz">
                            <el-icon>
                                <Connection />
                            </el-icon>
                            <span>班级管理</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="/manager">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>宿管管理</span>
                    </el-menu-item>
                    <el-sub-menu index="3"> <!-- 父菜单-个人中心 -->
                        <template #title>
                            <span>个人中心</span>
                        </template>
                        <el-menu-item index="/main">
                            <el-icon>
                                <House />
                            </el-icon>
                            <span>我的主页</span>
                        </el-menu-item>
                        <el-menu-item index="/userinfo">
                            <el-icon>
                                <Postcard />
                            </el-icon>
                            <span>基本资料</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <!-- 页面主页内容 -->
            <el-main style="background-color: #F2F6FC;padding: 7px;">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped>
.layout {
    height: 100vh;
}

.e-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    background-color: #909399;
}

.header-in {
    display: flex;
    align-items: center;
    flex-direction: row;
}

.e-avatar {
    outline: none;
}

.e-left-menu {
    background-color: #545c64;
    width: 150px;
    user-select: none;
}

.user-select-none {
    user-select: none;
}

.el-sub-menu :deep(.el-sub-menu__icon-arrow) {
    transform: rotate(-90deg) !important;
}

/*菜单展开箭头样式*/
.el-sub-menu.is-opened> :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
    transform: rotate(0deg) !important;
}</style>
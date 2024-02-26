import { createRouter, createWebHistory, routeLocationKey } from "vue-router";

import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import MainVue from '@/views/user/Main.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import BuildingVue from '@/views/building/Building.vue'
import ManagerVue from '@/views/manager/Manager.vue'
import DormitoryVue from '@/views/dormitory/Dormitory.vue'
import ChangeDormitoryApplicationVue from '@/views/dormitory/ChangeDormitoryApplication.vue'
import StudentVue from '@/views/student/Student.vue'
import StudentInfoVue from '@/views/student/StudentInfo.vue'
import StudentAddVue from '@/views/student/StudentAdd.vue'
import StudentUpdateVue from '@/views/student/StudentUpdate.vue'
import InstituteVue from '@/views/institute/Institute.vue'
import MajorVue from '@/views/institute/Major.vue'
import ClazzVue from '@/views/institute/Clazz.vue'

const routers = [
    { path: '/login', component: LoginVue},    /* 登录界面 */
    {
        path: '/', component: LayoutVue,
        redirect: '/login',
        children: [
            { path: '/main',name:'main', component: MainVue , meta:{keepAlive:true}},  /* 我的主页 */
            { path: '/userInfo', component: UserInfoVue,name:'userInfo', meta:{keepAlive:true} },  /* 我的资料 */
            { path: '/building', component: BuildingVue ,name:'building', meta:{keepAlive:true}},  /* 宿舍楼管理 */
            { path: '/manager', component: ManagerVue ,name:'manager', meta:{keepAlive:true}},    /* 宿管管理 */
            { path: '/dormitory', component: DormitoryVue,name:'dormitory', meta:{keepAlive:true} },    /* 寝室管理 */
            { path: '/changeDormitoryApplication', component: ChangeDormitoryApplicationVue,name:'changeDormitoryApplication', meta:{keepAlive:true} },    /* 寝室管理 */
            { path: '/student', component: StudentVue, name:'student', meta:{keepAlive:true}},    /* 学生管理 */
            { path: '/student/studentAdd', component: StudentAddVue, name:'studentAdd', meta:{keepAlive:true}},    /* 学生添加 */
            { path: '/student/studentInfo/:studentId', component: StudentInfoVue,name:'studentInfo', meta:{keepAlive:true}}, /* 学生详细信息管理 */
            { path: '/student/studentUpdate/:studentId', component: StudentUpdateVue,name:'studentUpdate'}, /* 学生详细信息管理 */
            { path: '/institute', component: InstituteVue,name:'institute', meta:{keepAlive:true} },    /* 学院管理 */
            { path: '/major', component: MajorVue ,name:'major', meta:{keepAlive:true}},    /* 专业管理 */
            { path: '/clazz', component: ClazzVue ,name:'clazz', meta:{keepAlive:true}},    /* 班级管理 */
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

import { useUserInfoStore } from '@/stores/userInfo.js'
import { ref } from 'vue'

router.beforeEach((to,from) => {
    const userInfoStore = useUserInfoStore();
    const routerList = ref(['studentAdd','studentUpdate'])
    const routerList2 = ref(['studentAdd','changeDormitoryApplication'])
    if(userInfoStore.info.role == 1){
        routerList.value.forEach((item,i)=>{
            if(to.name == item) { router.push({name:'main'}) }
        })
    }
    else if(userInfoStore.info.role == 2){
        routerList2.value.forEach((item,i)=>{
            if(to.name == item) { router.push({name:'main'}) }
        })
    }
})

export default router
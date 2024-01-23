import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import MainVue from '@/views/user/Main.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import BuildingVue from '@/views/building/Building.vue'
import ManagerVue from '@/views/manager/Manager.vue'

const routers = [
    { path: '/login', component: LoginVue },    /* 登录界面 */
    {
        path: '/', component: LayoutVue,
        redirect: '/login',
        children: [
            { path: '/main', component: MainVue },  /* 我的主页 */
            { path: '/userinfo', component: UserInfoVue },  /* 我的资料 */
            { path: '/building', component: BuildingVue },  /* 宿舍楼管理 */
            { path: '/manager', component: ManagerVue },    /* 宿管管理 */
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

export default router
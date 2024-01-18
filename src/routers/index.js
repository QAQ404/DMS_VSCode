import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

const routers = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, redirect: '/login',
        children:[
            
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

export default router
import axios from 'axios';
import { ElMessage } from 'element-plus'

const baseURL = '/api';
const instance = axios.create({ baseURL })

import {useTokenStore} from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //添加token
        const tokenStore = useTokenStore();
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (err)=>{
        //请求错误的回调
        Promise.reject(err)
    }
)
import router from '@/routers'

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务代码
        if (result.data.code === 0) {
            return result.data;
        }

        ElMessage.error(result.data.message ? result.data.message : "服务异常")
        //异步操作的状态转化为失败
        return Promise.reject(result.data);
    },
    err => {
        //判断响应状态码，如果为401则证明未登录
        if(err.response.status===401){
            ElMessage.error('请先登录');
            router.push('/login');
        }
        else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;
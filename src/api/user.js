import request from '@/utils/request.js'

export const userLoginService = (loginData) => {    /* 账号密码登录Post */
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
    return request.post("/user/login", params);
}

export const userExitService = ()=>{    /* 退出登录Get */
    return request.get('/user/exit')
}

export const userGetInfoService = ()=>{ /* 获取账号基本信息Get */
    return request.get('/user/userInfo')
}

export const userGetListService = ()=>{
    return request.get('/user/getUserList')
}


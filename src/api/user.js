import request from '@/utils/request.js'

const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key]);
    }
    return request.post("/user/login", params);
}

const userExitService = ()=>{
    return request.get('/user/exit')
}

export { userLoginService ,userExitService}
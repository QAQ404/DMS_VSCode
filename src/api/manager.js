import request from '@/utils/request.js'

export const managerGetOnlyNameService = ()=>{
    return request.get('/manager/getAllManagerName')
}

export const managerChangeBuildingNumberService = (oldV,newV)=>{
    return request.patch('/manager/changeBuildingNumber?oldV='+oldV+'&newV='+newV)
}

export const managerGetListService = (Data)=>{
    return request.post('/manager/getManagerList',Data)
}

export const managerAddService = (addData)=>{
    const params = new URLSearchParams();
    for (let key in addData) {
        params.append(key, addData[key]);
    }
    return request.post('/manager/addManager',params)
}

export const managerUpdateService = (Data,Data2)=>{
    return request.put('/manager/updateManager?old='+Data2,Data)
}
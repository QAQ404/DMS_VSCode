import request from '@/utils/request.js'

export const managerGetOnlyNameService = ()=>{
    return request.get('/manager/getAllManagerName')
}

export const managerChangeBuildingNumberService = (oldV,newV)=>{
    return request.patch('/manager/changeBuildingNumber?oldV='+oldV+'&newV='+newV)
}
import request from '@/utils/request.js'

export const dormitoryGetListService = (Data)=>{
    return request.post('/dormitory/getDormitoryList',Data)
}
export const dormitoryAddService = (Data) =>{
    return request.post('/dormitory/addDormitory',Data)
}

export const dormitoryGetMaxUnitAndFloorService = (id)=>{
    return request.get('/dormitory/getMaxUnitAndFloor?id='+id)
}
import request from '@/utils/request.js'

export const dormitoryGetListService = (Data) => {
    return request.post('/dormitory/getDormitoryList', Data)
}
export const dormitoryAddService = (Data) => {
    return request.post('/dormitory/addDormitory', Data)
}
export const dormitoryGetMaxUnitAndFloorService = (id) => {
    return request.get('/dormitory/getMaxUnitAndFloor?id=' + id)
}
export const dormitoryGetDormitoryByIdService = (id) => {
    return request.get('/dormitory/getDormitoryById?id='+id)
}
export const dormitoryUpdateInfoService = (Data)=>{
    return request.put('/dormitory/updateDormitory',Data)
}
export const dormitoryDeleteService = (id)=>{
    return request.delete('/dormitory/deleteDormitory?id='+id)
}

export const dormitoryGetNameListCheckTheSameName = (data)=>{
    return request.post('/dormitory/checkDormitoryName', data)
}

export const dormitoryAddManyService = (data)=>{
    return request.post('/dormitory/addDormitoryMany',data)
}
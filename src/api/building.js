import request from '@/utils/request.js'

export const buildingGetListService = (params)=>{   
    return request.get('/building/getBuildingList',{params:params})
}

export const buildingAddService = (addData)=>{
    const params = new URLSearchParams();
    for (let key in addData) {
        params.append(key, addData[key]);
    }
    return request.post('/building/addBuilding',params)
}

export const buildingGetInfoByIdService = (id)=>{
    return request.get('/building/getBuildingInfo?buildingId='+id)
}

export const buildingUpdateInfoService = (Data)=>{
    return request.put('/building/updateBuildingInfo',Data)
}

export const buildingDeleteService = (id)=>{
    return request.delete('/building/deleteBuilding?id='+id)
}

export const buildingGetOnlyNameService = ()=>{
    return request.get('/building/getOnlyName')
}

export const buildingGetUnitAndFloorService = (id)=>{
    return request.get('/building/getUnitAndFloor?id='+id)
}


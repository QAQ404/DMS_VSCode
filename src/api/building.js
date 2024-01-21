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

export const buildingGetInfoById = (id)=>{
    return request.get('/building/getBuildingInfo?buildingId='+id)
}

export const buildingUpdateInfo = (Data)=>{
    return request.put('/building/updateBuildingInfo',Data)
}
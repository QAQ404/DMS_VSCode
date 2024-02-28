import request from '@/utils/request.js'

export const ChangeDorAppGetAppListService = (Data) => {
    return request.post('/changeDormitoryApplication/getApplicationList', Data)
}

export const ChangeDorAppAddAppService = (Data,Bed)=>{
    return request.post('/changeDormitoryApplication/addApplication',{Data,Bed})
}

export const ChangeDorAppDeleteAppService = (id)=>{
    return request.delete('/changeDormitoryApplication/deleteApplication?id='+id)
}

export const ChangeDorAppRefusesAppService = (id)=>{
    return request.put('/changeDormitoryApplication/refusesApplication?id='+id)
}

export const ChangeDorAppAcceptAppService = (id)=>{
    return request.put('/changeDormitoryApplication/acceptApplication?id='+id)
}
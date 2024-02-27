import request from '@/utils/request.js'

export const ChangeDorAppGetAppListService = (Data) => {
    return request.post('/changeDormitoryApplication/getApplicationList', Data)
}

export const ChangeDorAppAddAppService = (Data,Bed)=>{
    return request.post('/changeDormitoryApplication/addApplication',{Data,Bed})
}
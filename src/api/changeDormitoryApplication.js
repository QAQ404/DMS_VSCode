import request from '@/utils/request.js'

export const ChangeDorAppGetAppListService = (Data) => {
    return request.post('/changeDormitoryApplication/getApplicationList', Data)
}
import request from '@/utils/request.js'

export const RepairAppGetAppListService = (Data) => {
    return request.post('/repairApplication/getApplicationList', Data)
}
import request from '@/utils/request.js'

export const RepairAppGetAppListService = (Data) => {
    return request.post('/repairApplication/getApplicationList', Data)
}

export const RepairAppAddAppListService = (Data) => {
    return request.post('/repairApplication/addApplication', Data)
}

export const RepairAppDeleteAppListService = (Data) => {
    return request.delete('/repairApplication/deleteApplication?id='+Data)
}

export const RepairAppSolveService = (Data)=>{
    return request.put('/repairApplication/solveApplication',Data)
}
import request from '@/utils/request.js'

export const managerGetOnlyName = ()=>{
    return request.get('/manager/getAllManagerName')
}
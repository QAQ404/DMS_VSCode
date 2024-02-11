import request from '@/utils/request.js'

export const getStudentListService = (data)=>{
    return request.post('/student/getStudentList',data)
}

export const getStudentByIdService = (id)=>{
    return request.get('/student/getStudentById?id='+id)
}
import request from '@/utils/request.js'

export const getStudentListService = (data)=>{
    return request.post('/student/getStudentList',data)
}

export const getStudentByIdService = (id)=>{
    return request.get('/student/getStudentById?id='+id)
}

export const AddStudentService = (data)=>{
    return request.post('/student/addStudent',data)
}

export const UpdateStudentInfoService = (data)=>{
    return request.put('/student/updateStudentInfo',data)
}
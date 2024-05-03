import request from '@/utils/request.js'

export const EmailAddService = (Data)=>{
    return request.post('/email/addEmail',Data)
}

export const EmailGetEmailListService = (Data)=>{
    return request.post('/email/getEmailList',Data)
}

export const EmailDeleteEmailService = (id,show)=>{
    return request.delete('/email/deleteEmail?id='+id+'&show='+show)
}
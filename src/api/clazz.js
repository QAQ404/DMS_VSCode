import request from '@/utils/request.js'

export const clazzGetClazzListService = (data)=>{
    return request.post('/clazz/getClazzList',data)
}


export const clazzAddService = (data) =>{
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('/clazz/addClazz',params)
}

export const clazzGetClazzByIdService = (id)=>{
    return request.get('/clazz/getClazzById?id='+id)
}

export const updateClazzService = (data)=>{
    return request.put('/clazz/updateClazz',data)
}

export const clazzDeleteService = (id) =>{
    return request.delete('/clazz/deleteClazz?id='+id)
}
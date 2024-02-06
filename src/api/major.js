import request from '@/utils/request.js'

export const majorGetMajorListService = (data)=>{
    return request.post('/major/getMajorList',data)
}

export const majorGetMajorNameListService = (data)=>{
    return request.get('/major/getMajorNameList?insName='+data)
}

export const majorAddService = (data) =>{
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('/major/addMajor',params)
}

export const majorDeleteService = (id) =>{
    return request.delete('/major/deleteMajor?id='+id)
}

export const majorGetMajorByIdService = (id)=>{
    return request.get('/major/getMajorById?id='+id)
}

export const updateMajorService = (data)=>{
    return request.put('/major/updateMajor',data)
}
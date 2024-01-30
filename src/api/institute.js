import request from '@/utils/request.js'

export const instituteGetInstituteListService = (data)=>{
    return request.post('/institute/getInstituteList',data)
}

export const instituteAddService = (data) =>{
    const params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key]);
    }
    return request.post('/institute/addInstitute',params)
}

export const instituteDeleteService = (id) =>{
    return request.delete('/institute/deleteInstitute?id='+id)
}

export const instituteGetInstituteNameService = (id)=>{
    return request.get('/institute/getInstituteName?id='+id)
}

export const updateInstituteService = (data)=>{
    return request.put('/institute/updateInstitute',data)
}
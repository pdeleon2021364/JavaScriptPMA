import {axiosAdmin} from "./api"

export const getFields = async () =>{
    return axiosAdmin.get("/fields")
}

export const createField = async (data) => {
    return await axiosAdmin.post("/fields", data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const updatedField = async (id, data) => {
    return await axiosAdmin.put(`/fields/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const deletedField = async (id) => {
    return await axiosAdmin.put(`/fields/${id}/desactivate`)
}
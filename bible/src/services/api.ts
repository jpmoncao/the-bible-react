import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL_API,
    headers: {
        Authorization: 'Bearer ' + import.meta.env.VITE_TOKEN_API
    }
})

export default api;

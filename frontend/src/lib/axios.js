import axios from "axios";

// axios instance - defining the base url so that can be used easily
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api", // baseURL on top of which remaining url is pasted
    withCredentials: true, // means cookies are to be sent
})
import axios from "axios";

const API_URL = "http://localhost:8080/api/reports";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    }
});

export const uploadReport = (formData) => api.post("/upload", formData);
export const previewReport = (id, format) => api.get(`/preview/${id}?format=${format}`, { responseType: "blob" });
export const getAllReports = () => api.get("/all");
export const deleteReport = (id) => api.delete(`/${id}`);

export default api;

import axios from "axios";

const API_URL = "http://localhost:8080/api/reports";

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export const uploadReport = (formData) => axios.post("/upload", formData);
export const previewReport = (id) => axios.get(`/preview/${id}`, { responseType: "blob" });
export const getAllReports = () => axios.get("/all");

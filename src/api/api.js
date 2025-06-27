import axios from "axios";

const API_URL = "http://localhost:8080";

export const getTemplates = async () =>
    (await axios.get(`${API_URL}/templates`)).data;

export const uploadTemplate = async (data) =>
    (await axios.post(`${API_URL}/templates/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    })).data;

export const generateReport = async (templateId, format, params) =>
    await axios.post(`${API_URL}/reports/generate?templateId=${templateId}&format=${format}`, params, {
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/json" },
    });

export const getReportsByTemplate = async (templateId) =>
    (await axios.get(`${API_URL}/reports?templateId=${templateId}`)).data;
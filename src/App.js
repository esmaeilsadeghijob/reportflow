import "./App.css";
import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import UploadReport from "./components/UploadReport";
import ReportList from "./components/ReportList";
import axios from "axios";

function App() {
    const [reports, setReports] = useState([]);
    const [previewUrl, setPreviewUrl] = useState("");

    const fetchReports = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/reports/all");
            setReports(response.data);
        } catch (error) {
            console.error("دریافت لیست گزارش‌ها ناموفق بود:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handlePreview = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reports/preview/${id}`, {
                responseType: "blob",
            });
            const file = new Blob([response.data], { type: "application/pdf" });
            setPreviewUrl(URL.createObjectURL(file));
        } catch (error) {
            console.error("مشکل در پیش‌نمایش گزارش:", error);
        }
    };

    return (
        <MainLayout>
            <div className="container">
                <div className="left-panel">
                    {previewUrl ? (
                        <embed src={previewUrl} width="100%" height="100%" type="application/pdf" />
                    ) : (
                        <div style={{ textAlign: "center", paddingTop: "20px" }} className="bnazanin-font">
                            پیش‌نمایش گزارش در اینجا نمایش داده می‌شود
                        </div>
                    )}
                </div>
                <div className="right-panel">
                    <UploadReport onUploadSuccess={fetchReports} />
                    <div style={{ marginTop: "20px" }}></div>
                    <ReportList reports={reports} onDeleteSuccess={fetchReports} onPreview={handlePreview} />
                </div>
            </div>
        </MainLayout>
    );
}

export default App;

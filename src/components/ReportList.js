import React, { useState, useEffect } from "react";
import { List, Button, message } from "antd";
import axios from "axios";

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/reports/all");
            setReports(response.data);
            console.log("Reports:", response.data); // بررسی خروجی داده‌ها در کنسول
        } catch (error) {
            message.error("دریافت لیست گزارش‌ها ناموفق بود.");
        }
    };

    const handlePreview = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reports/preview/${id}`, { responseType: "blob" });
            const file = new Blob([response.data], { type: "application/pdf" });
            setPreview(URL.createObjectURL(file));
        } catch (error) {
            message.error("پیش‌نمایش ناموفق بود.");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "20px auto" }}>
            <h2>لیست گزارش‌ها</h2>
            <List
                bordered
                dataSource={reports}
                renderItem={(report) => (
                    <List.Item key={report.id}>
                        گزارش شماره {report.reportCode}
                        <Button onClick={() => handlePreview(report.id)} style={{ marginLeft: 10 }}>
                            پیش‌نمایش
                        </Button>
                    </List.Item>
                )}
            />
            {preview && <embed src={preview} width="600px" height="400px" />}
        </div>
    );
};

export default ReportList;

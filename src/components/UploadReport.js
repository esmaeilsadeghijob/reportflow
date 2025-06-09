import React, { useState } from "react";
import { Upload, Button, Input, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadReport = ({ onUploadSuccess }) => {
    const [cid, setCid] = useState("");
    const [sid, setSid] = useState("");
    const [reportCode, setReportCode] = useState("");
    const [file, setFile] = useState(null);
    const [uploadKey, setUploadKey] = useState(Date.now());
    const [loading, setLoading] = useState(false);

    const uploadProps = {
        beforeUpload: (file) => {
            setFile(file);
            return false; // جلوگیری از آپلود خودکار
        },
        onRemove: () => {
            setFile(null);
        },
        fileList: file ? [file] : [],
    };

    const handleUpload = async () => {
        if (!file || !cid || !sid || !reportCode) {
            message.error("لطفا همه فیلدها را پر کنید!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("cid", cid);
        formData.append("sid", sid);
        formData.append("reportCode", reportCode);

        try {
            setLoading(true); // فعال کردن لودینگ قبل از شروع آپلود
            const response = await axios.post("http://localhost:8080/api/reports/upload", formData);
            message.success(response.data);
            if (onUploadSuccess) onUploadSuccess();

            // پاکسازی مقادیر فرم پس از آپلود موفق
            setFile(null);
            setCid("");
            setSid("");
            setReportCode("");
            setUploadKey(Date.now());
        } catch (error) {
            message.error("آپلود گزارش ناموفق بود.");
            console.error(error);
        } finally {
            setLoading(false); // غیرفعال کردن لودینگ در هر صورت
        }
    };

    return (
        <Spin spinning={loading} tip="در حال آپلود...">
            <div style={{ marginBottom: "20px" }}>
                <h2 style={{ textAlign: "center" }}>آپلود گزارش جدید</h2>

                {/* دکمه انتخاب فایل، مرکز چین شده */}
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Upload key={uploadKey} {...uploadProps}>
                        <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
                    </Upload>
                </div>

                {/* ورودی‌های CID، SID و Report Code به صورت عمودی */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: "8px",
                    }}
                >
                    <Input
                        placeholder="CID"
                        value={cid}
                        onChange={(e) => setCid(e.target.value)}
                        style={{ width: "80%", maxWidth: "300px" }}
                    />
                    <Input
                        placeholder="SID"
                        value={sid}
                        onChange={(e) => setSid(e.target.value)}
                        style={{ width: "80%", maxWidth: "300px" }}
                    />
                    <Input
                        placeholder="Report Code"
                        value={reportCode}
                        onChange={(e) => setReportCode(e.target.value)}
                        style={{ width: "80%", maxWidth: "300px" }}
                    />
                </div>

                {/* دکمه آپلود گزارش، مرکز چین شده */}
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <Button type="primary" onClick={handleUpload}>
                        آپلود گزارش
                    </Button>
                </div>
            </div>
        </Spin>
    );
};

export default UploadReport;

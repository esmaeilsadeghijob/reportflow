import React, { useState } from "react";
import { Upload, Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadReport = ({ onUploadSuccess }) => {
    const [cid, setCid] = useState("");
    const [sid, setSid] = useState("");
    const [reportCode, setReportCode] = useState("");
    const [file, setFile] = useState(null);
    const [uploadKey, setUploadKey] = useState(Date.now());

    const uploadProps = {
        beforeUpload: (file) => {
            setFile(file);
            return false; // جلوگیری از آپلود خودکار
        },
        onRemove: () => {
            setFile(null);
        },
        // کنترل fileList برای نمایش فایل انتخاب شده
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
            const response = await axios.post("http://localhost:8080/api/reports/upload", formData);
            message.success(response.data);
            if (onUploadSuccess) onUploadSuccess();

            // پاک کردن مقادیر فرم پس از آپلود موفق
            setFile(null);
            setCid("");
            setSid("");
            setReportCode("");
            // تغییر کلید Upload تا کامپوننت از نو رندر شود و فایل پاک شود
            setUploadKey(Date.now());
        } catch (error) {
            message.error("آپلود گزارش ناموفق بود.");
        }
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <h2 style={{ textAlign: "center" }}>آپلود گزارش جدید</h2>

            {/* دکمه انتخاب فایل مرکز چین شده */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Upload key={uploadKey} {...uploadProps}>
                    <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
                </Upload>
            </div>

            {/* ورودی‌های CID، SID، Report Code؛ قرارگیری به صورت عمودی */}
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

            {/* دکمه آپلود گزارش مرکز چین شده */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Button type="primary" onClick={handleUpload}>
                    آپلود گزارش
                </Button>
            </div>
        </div>
    );
};

export default UploadReport;

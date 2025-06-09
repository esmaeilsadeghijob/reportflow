import React, { useState } from "react";
import { Upload, Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadReport = ({ onUploadSuccess }) => {
    const [cid, setCid] = useState("");
    const [sid, setSid] = useState("");
    const [reportCode, setReportCode] = useState("");
    const [file, setFile] = useState(null);

    const props = {
        beforeUpload: (file) => {
            setFile(file);
            return false; // جلوگیری از آپلود خودکار
        },
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
            const response = await axios.post(
                "http://localhost:8080/api/reports/upload",
                formData
            );
            message.success(response.data);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            message.error("آپلود گزارش ناموفق بود.");
        }
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <h2 style={{ textAlign: "center" }}>آپلود گزارش جدید</h2>

            {/* دکمه انتخاب فایل در مرکز */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
                </Upload>
            </div>

            {/* فیلدهای ورودی (CID, SID, Report Code) مرکز چین شده با عرض تنظیم‌شده */}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <Input
                    placeholder="CID"
                    onChange={(e) => setCid(e.target.value)}
                    style={{
                        marginBottom: "10px",
                        width: "80%",
                        maxWidth: "300px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
                <Input
                    placeholder="SID"
                    onChange={(e) => setSid(e.target.value)}
                    style={{
                        marginBottom: "10px",
                        width: "80%",
                        maxWidth: "300px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
                <Input
                    placeholder="Report Code"
                    onChange={(e) => setReportCode(e.target.value)}
                    style={{
                        marginBottom: "10px",
                        width: "80%",
                        maxWidth: "300px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
            </div>

            {/* دکمه آپلود گزارش مرکز چین شده */}
            <div style={{ textAlign: "center" }}>
                <Button type="primary" onClick={handleUpload} style={{ marginTop: "10px" }}>
                    آپلود گزارش
                </Button>
            </div>
        </div>
    );
};

export default UploadReport;

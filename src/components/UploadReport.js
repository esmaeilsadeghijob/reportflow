import React, { useState } from "react";
import { Upload, Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const UploadReport = () => {
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
            const response = await axios.post("http://localhost:8080/api/reports/upload", formData);
            message.success(response.data);
        } catch (error) {
            message.error("آپلود گزارش ناموفق بود.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "20px auto" }}>
            <h2>آپلود گزارش جدید</h2>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
            </Upload>
            <Input placeholder="CID" onChange={(e) => setCid(e.target.value)} style={{ marginTop: 10 }} />
            <Input placeholder="SID" onChange={(e) => setSid(e.target.value)} style={{ marginTop: 10 }} />
            <Input placeholder="Report Code" onChange={(e) => setReportCode(e.target.value)} style={{ marginTop: 10 }} />
            <Button type="primary" onClick={handleUpload} style={{ marginTop: 10 }}>
                آپلود گزارش
            </Button>
        </div>
    );
};

export default UploadReport;

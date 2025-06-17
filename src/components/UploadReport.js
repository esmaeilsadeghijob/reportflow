import React, { useState } from "react";
import { Upload, Button, Input, message, Spin, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../services/Api";

const paramTypeMapping = {
    "Integer": 1,
    "String": 2,
    "Date": 3
};

const UploadReport = ({ onUploadSuccess }) => {
    const [cid, setCid] = useState("");
    const [sid, setSid] = useState("");
    const [reportCode, setReportCode] = useState("");
    const [file, setFile] = useState(null);
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const uploadProps = {
        beforeUpload: (file) => {
            setFile(file);
            return false;
        },
        onRemove: () => {
            setFile(null);
        },
        fileList: file ? [file] : [],
    };

    const handleTemplateUpload = async () => {
        if (!file) {
            message.error("لطفا فایل گزارش را انتخاب کنید!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await api.post("/extract-params", formData);

            const filteredParams = response.data.filter(
                (param) => !["cid", "sid", "reportCode"].includes(param.paramName.toLowerCase())
            );

            setParams(filteredParams.map((param) => ({ ...param, value: "", paramType: param.paramType })));
            setStep(2);
            message.success("پارامترهای گزارش استخراج شدند!");
        } catch (error) {
            message.error("استخراج پارامترها ناموفق بود.");
        } finally {
            setLoading(false);
        }
    };

    const handleFinalUpload = async () => {
        if (!cid || !sid || !reportCode) {
            message.error("لطفا تمامی فیلدها را وارد کنید!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("cid", cid);
        formData.append("sid", sid);
        formData.append("reportCode", reportCode);
        params.forEach((param) => {
            formData.append(`param_${param.paramName}`, param.value || "");
            formData.append(`type_${param.paramName}`, paramTypeMapping[param.paramType] || 0);
        });

        try {
            setLoading(true);
            await api.uploadReport(formData);
            message.success("گزارش با موفقیت ثبت شد!");
            onUploadSuccess && onUploadSuccess();
            setStep(1);
            setFile(null);
            setCid("");
            setSid("");
            setReportCode("");
            setParams([]);
        } catch (error) {
            message.error("ثبت گزارش ناموفق بود.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Spin spinning={loading} tip="در حال پردازش...">
            <div style={{ marginBottom: "20px" }}>
                <h2 style={{ textAlign: "center" }} className="entezar-font">
                    {step === 1 ? "آپلود تمپلیت گزارش" : "مقداردهی پارامترها و ثبت گزارش"}
                </h2>

                {step === 1 ? (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>انتخاب فایل گزارش</Button>
                        </Upload>
                        <Button type="primary" onClick={handleTemplateUpload} style={{ marginTop: "10px" }}>
                            استخراج پارامترها
                        </Button>
                    </div>
                ) : (
                    <Form layout="vertical">
                        <Form.Item label="CID">
                            <Input value={cid} onChange={(e) => setCid(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="SID">
                            <Input value={sid} onChange={(e) => setSid(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Report Code">
                            <Input value={reportCode} onChange={(e) => setReportCode(e.target.value)} />
                        </Form.Item>
                        <Button type="primary" onClick={handleFinalUpload} style={{ marginTop: "10px" }}>
                            ذخیره گزارش
                        </Button>
                    </Form>
                )}
            </div>
        </Spin>
    );
};

export default UploadReport;

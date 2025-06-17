import React, { useState } from "react";
import { Button, Input, Form, Select, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons"; // آیکون حذف
import api from "../services/Api";

const CreateReport = () => {
    const [reportName, setReportName] = useState("");
    const [params, setParams] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState("PDF");

    const handleAddParam = () => {
        setParams([...params, { name: "", value: "" }]);
    };

    const handleDeleteParam = (index) => {
        const updatedParams = params.filter((_, i) => i !== index);
        setParams(updatedParams);
    };

    const handleGenerateReport = async () => {
        if (!reportName) {
            message.error("لطفاً نام گزارش را وارد کنید!");
            return;
        }

        const requestData = {
            reportName,
            format: selectedFormat,
            params: params.reduce((acc, param) => {
                acc[param.name] = param.value;
                return acc;
            }, {}),
        };

        try {
            const response = await api.post("/generate", requestData, { responseType: "blob" });
            const file = new Blob([response.data], { type: getMimeType(selectedFormat) });
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${reportName}.${selectedFormat.toLowerCase()}`;
            link.click();
            message.success("گزارش با موفقیت تولید شد!");
        } catch (error) {
            message.error("مشکلی در تولید گزارش وجود دارد!");
        }
    };

    const getMimeType = (format) => {
        switch (format) {
            case "PDF": return "application/pdf";
            case "XLS": return "application/vnd.ms-excel";
            case "CSV": return "text/csv";
            case "HTML": return "text/html";
            case "TXT": return "text/plain";
            default: return "application/octet-stream";
        }
    };

    return (
        <div className="create-report-container">
            <h2 className="entezar-font">ایجاد گزارش جدید</h2>
            <Form layout="vertical" className="create-report-form">
                <Form.Item label="نام گزارش">
                    <Input value={reportName} onChange={(e) => setReportName(e.target.value)} />
                </Form.Item>
                <Form.Item label="فرمت خروجی">
                    <Select value={selectedFormat} onChange={(value) => setSelectedFormat(value)}>
                        <Select.Option value="PDF">PDF</Select.Option>
                        <Select.Option value="XLS">Excel</Select.Option>
                        <Select.Option value="CSV">CSV</Select.Option>
                        <Select.Option value="HTML">HTML</Select.Option>
                        <Select.Option value="TXT">TXT</Select.Option>
                    </Select>
                </Form.Item>
                <h3>پارامترها</h3>
                {params.map((param, index) => (
                    <div key={index} className="param-row">
                        <Button type="link" danger onClick={() => handleDeleteParam(index)}>
                            <DeleteOutlined />
                        </Button>
                        <Input
                            placeholder="مقدار پارامتر"
                            value={param.value}
                            onChange={(e) => {
                                const updatedParams = [...params];
                                updatedParams[index].value = e.target.value;
                                setParams(updatedParams);
                            }}
                        />
                        <Input
                            placeholder="نام پارامتر"
                            value={param.name}
                            onChange={(e) => {
                                const updatedParams = [...params];
                                updatedParams[index].name = e.target.value;
                                setParams(updatedParams);
                            }}
                        />
                    </div>
                ))}
                <Button type="dashed" onClick={handleAddParam} style={{ marginBottom: "10px", width: "100%" }}>
                    افزودن پارامتر جدید
                </Button>
                <Button type="primary" onClick={handleGenerateReport} style={{ width: "100%" }}>
                    تولید گزارش
                </Button>
            </Form>
        </div>
    );
};

export default CreateReport;

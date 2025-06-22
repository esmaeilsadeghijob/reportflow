import React, {useState, useEffect} from "react";
import {Select, Input, Button, message, Form} from "antd";
import api from "../services/Api";
import axios from "axios";

const TemplateAndGenerateReport = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [params, setParams] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState("PDF");
    const [variables, setVariables] = useState([]);

    // گرفتن لیست تمپلیت‌ها
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get("/all");
                setTemplates(response.data);
            } catch (error) {
                message.error("خطا در دریافت لیست تمپلیت‌ها!");
            }
        };
        fetchTemplates();
    }, []);

    // گرفتن پارامترها پس از انتخاب تمپلیت
    useEffect(() => {
        if (selectedTemplateId) {
            const fetchParams = async () => {
                try {
                    console.log("::::::::::::::: 3");

                    const response = await api.get(`/params/${selectedTemplateId}`);
                    const initializedParams = response.data.map(param => ({
                        name: param.paramName,
                        value: ""
                    }));
                    setParams(initializedParams);
                    console.log(":::::::::::::: 1")
                    console.log(response.data)
                    console.log(":::::::::::::: 2")
                } catch (error) {
                    message.error("بارگذاری پارامترها ناموفق بود!");
                }
            };
            fetchParams();
        }
    }, [selectedTemplateId]);

    const handleParamChange = (index, value) => {
        const updated = [...params];
        updated[index].value = value;
        setParams(updated);
    };

    const handleGenerate = async () => {
        if (!selectedTemplateId) {
            message.error("لطفاً یک تمپلیت انتخاب کنید!");
            return;
        }
        const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
        const paramData = {};
        for (let p of params) {
            if (!p.value.trim()) {
                message.error(`مقدار "${p.name}" را وارد کنید!`);
                return;
            }
            paramData[p.name] = p.value;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/reports/generate?templateName=${selectedTemplate.name}&format=${selectedFormat}`,
                paramData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );


            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedTemplate.templateName}.${selectedFormat.toLowerCase()}`;
            link.click();
        } catch
            (error) {
            message.error("خطا در تولید گزارش!");
        }
    };

    const handleAddVariable = () => {
        setVariables([...variables, {param: ""}]);
    }

    const handleDeleteVariable = (index) => {
        const updatedVariables = variables.filter((_, i) => i !== index);
        setVariables(updatedVariables);
    };

    return (
        <div style={{textAlign: "center"}}>
            <h2 className="entezar-font">انتخاب تمپلیت و وارد کردن پارامترها </h2>

            <Select
                placeholder="انتخاب تمپلیت"
                style={{width: "100%", marginBottom: "16px"}}
                onChange={(id) => setSelectedTemplateId(id)}
                value={selectedTemplateId}
            >
                {templates.map((t) => (
                    <Select.Option key={t.id} value={t.id} className="variable-row-select-option">
                        {t.name}
                    </Select.Option>
                ))}
            </Select>

            <p style={{textAlign: "right"}}>پارامترها</p>
            {variables.map((variable, index) => (
                <div key={index} className="variable-row">
                    {params.map((param, index) => (
                        <Input
                            placeholder={`مقدار پارامتر "${param.name}"`}
                            value={param.value}
                            onChange={(e) => handleParamChange(index, e.target.value)}
                        />
                    ))}
                    <Button type="link" danger onClick={() => handleDeleteVariable(index)}>
                        ❌
                    </Button>

                </div>
            ))}

            <Button type="dashed" onClick={handleAddVariable} style={{marginBottom: "10px", width: "100%"}}>
                افزودن سطر جدید
            </Button>

            <Form.Item label="فرمت خروجی" className="variable-row-select-option-center">
                <Select
                    value={selectedFormat}
                    onChange={(value) => setSelectedFormat(value)}
                >
                    <Select.Option value="PDF">PDF</Select.Option>
                    <Select.Option value="XLS">Excel</Select.Option>
                    <Select.Option value="CSV">CSV</Select.Option>
                    <Select.Option value="HTML">HTML</Select.Option>
                    <Select.Option value="TXT">TXT</Select.Option>
                </Select>
            </Form.Item>
            <br/>
            <Button type="primary" onClick={handleGenerate}>
                تولید گزارش
            </Button>
        </div>
    );
};

export default TemplateAndGenerateReport;

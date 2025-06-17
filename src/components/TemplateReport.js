import React, { useState, useEffect } from "react";
import { Button, Select, message } from "antd";
import api from "../services/Api";

const TemplateReport = ({ onTemplateSelect }) => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get("/templates");
                setTemplates(response.data);
            } catch (error) {
                message.error("دریافت لیست تمپلیت‌ها ناموفق بود!");
            }
        };
        fetchTemplates();
    }, []);

    const handleSaveTemplate = async () => {
        if (!selectedTemplate) {
            message.error("لطفاً یک تمپلیت انتخاب کنید!");
            return;
        }

        try {
            await api.post("/templates/save", { templateId: selectedTemplate });
            message.success("تمپلیت گزارش با موفقیت ذخیره شد!");
            onTemplateSelect(selectedTemplate);
        } catch (error) {
            message.error("مشکلی در ذخیره تمپلیت وجود دارد!");
        }
    };

    return (
        <div className="template-container">
            <h2 className="entezar-font">انتخاب تمپلیت گزارش</h2>
            <Select
                value={selectedTemplate}
                onChange={(value) => setSelectedTemplate(value)}
                style={{ width: "100%", marginBottom: "10px" }}
                placeholder="انتخاب تمپلیت"
            >
                {templates.map((template) => (
                    <Select.Option key={template.id} value={template.id}>
                        {template.name}
                    </Select.Option>
                ))}
            </Select>
            <Button type="primary" onClick={handleSaveTemplate} style={{ width: "100%" }}>
                ذخیره تمپلیت
            </Button>
        </div>
    );
};

export default TemplateReport;

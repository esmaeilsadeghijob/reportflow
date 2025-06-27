import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, InputNumber } from "antd";
import axios from "axios";

const UseReportTemplate = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/reports/jrxml/templates/report-templates").then((res) => {
            setTemplates(res.data);
        });
    }, []);

    const onTemplateChange = (id) => {
        const tpl = templates.find((t) => t.id === id);
        setSelectedTemplate(tpl);
    };

    const renderField = (param) => {
        switch (param.type) {
            case "string":
                return <Input />;
            case "number":
                return <InputNumber />;
            case "date":
                return <DatePicker />;
            default:
                return <Input />;
        }
    };

    const onFinish = (values) => {
        console.log(values);
        alert("پارامترها ارسال شدند");
    };

    return (
        <div>
            <Select
                style={{ width: "100%" }}
                placeholder="قالب را انتخاب کنید"
                onChange={onTemplateChange}
            >
                {templates.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                        {t.title}
                    </Select.Option>
                ))}
            </Select>
            {selectedTemplate && (
                <Form layout="vertical" onFinish={onFinish}>
                    {selectedTemplate.parameters.map((param) => (
                        <Form.Item
                            key={param.id}
                            name={param.name}
                            label={param.name}
                            rules={[{ required: true }]}
                        >
                            {renderField(param)}
                        </Form.Item>
                    ))}
                    <Button type="primary" htmlType="submit">تولید گزارش</Button>
                </Form>
            )}
        </div>
    );
};

export default UseReportTemplate;
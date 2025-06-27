import { Form, Button, Input, Select, message } from "antd";
import { useState } from "react";
import { generateReport } from "../api/api";

const ParameterForm = ({ template }) => {
    const [format, setFormat] = useState("pdf");

    const onFinish = async (values) => {
        const res = await generateReport(template.id, format, values);
        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);
        window.open(url);
        message.success("گزارش ساخته شده!");
    };
    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="فرمت خروجی">
                <Select value={format} onChange={setFormat}>
                    <Select.Option value="pdf">PDF</Select.Option>
                    <Select.Option value="html">HTML</Select.Option>
                    <Select.Option value="xls">Excel</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="param1" label="پارامتر 1">
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">ساخت گزارش</Button>
        </Form>
    );
};

export default ParameterForm;
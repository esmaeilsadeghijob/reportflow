import React, { useState } from "react";
import { Form, Input, Button, Upload, Space, Select } from "antd";
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CreateReportTemplate = () => {
    const [file, setFile] = useState(null);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();

            // ✅ افزودن فایل
            formData.append("file", file);

            // ✅ افزودن داده‌های JSON به صورت Blob
            formData.append(
                "data",
                new Blob(
                    [
                        JSON.stringify({
                            title: values.title,
                            description: values.description,
                            parameters: values.parameters || []
                        })
                    ],
                    { type: "application/json" }
                )
            );

            // ✅ درخواست به بک‌اند
            await axios.post(
                "http://localhost:8080/api/reports/jrxml/templates/report-templates",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            alert("تمپلیت ساخته شد!");
        } catch (error) {
            console.error(error);
            alert("خطا در ساخت تمپلیت");
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="عنوان" name="title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="توضیحات" name="description">
                <Input.TextArea />
            </Form.Item>

            <Form.Item label="فایل JRXML">
                <Upload
                    beforeUpload={(selectedFile) => {
                        setFile(selectedFile);
                        return false;
                    }}
                >
                    <Button icon={<UploadOutlined />}>انتخاب فایل</Button>
                </Upload>
            </Form.Item>

            <Form.List name="parameters">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    {...field}
                                    name={[field.name, "name"]}
                                    label="نام"
                                    rules={[{ required: true, message: "نام پارامتر را وارد کنید" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "type"]}
                                    label="نوع"
                                    rules={[{ required: true, message: "نوع را انتخاب کنید" }]}
                                >
                                    <Select style={{ width: 120 }}>
                                        <Option value="string">String</Option>
                                        <Option value="number">Number</Option>
                                        <Option value="date">Date</Option>
                                    </Select>
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}

                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={() => add()}
                        >
                            افزودن پارامتر
                        </Button>
                    </>
                )}
            </Form.List>

            <Button type="primary" htmlType="submit">
                ساخت قالب
            </Button>
        </Form>
    );
};

export default CreateReportTemplate;
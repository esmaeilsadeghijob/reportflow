import React, { useState, useEffect } from "react";
import { Button, Input, Form, Select, message } from "antd";
import api from "../services/Api";

const JRXMLTemplate = ({ onTemplateCreated }) => {
    const [templateName, setTemplateName] = useState("");
    const [variables, setVariables] = useState([]);
    const [variableTypes, setVariableTypes] = useState([]);

    // دریافت نوع متغیرها از سرویس بک‌اند
    useEffect(() => {
        const fetchVariableTypes = async () => {
            try {
                const response = await api.get("/jrxml/variable-types");
                setVariableTypes(response.data);
            } catch (error) {
                message.error("مشکلی در دریافت نوع متغیرها وجود دارد!");
            }
        };
        fetchVariableTypes();
    }, []);

    // افزودن متغیر جدید
    const handleAddVariable = () => {
        setVariables([...variables, { name: "", type: "" }]);
    };

    // حذف متغیر
    const handleDeleteVariable = (index) => {
        const updatedVariables = variables.filter((_, i) => i !== index);
        setVariables(updatedVariables);
    };

    // ذخیره تمپلیت JRXML در بک‌اند
    const handleSaveTemplate = async () => {
        if (!templateName) {
            message.error("لطفاً نام تمپلیت را وارد کنید!");
            return;
        }

        try {
            await api.post("/jrxml/templates/create", { name: templateName, variables });
            message.success("تمپلیت JRXML با موفقیت ایجاد شد!");
            setTemplateName("");
            setVariables([]);
            onTemplateCreated && onTemplateCreated();
        } catch (error) {
            message.error("مشکلی در ذخیره تمپلیت وجود دارد!");
        }
    };

    return (
        <div className="jrxml-template-container">
            <h2 className="entezar-font"><a style={{fontSize: "14px"}}>(JRXML با فرمت )</a> - <a>ایجاد تمپلیت</a></h2>
            <Form layout="vertical" className="jrxml-template-form">
                <Form.Item>
                    <p style={{textAlign: "right"}}>نام تمپلیت</p>
                    <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </Form.Item>
                <h3>متغیرها</h3>
                {variables.map((variable, index) => (
                    <div key={index} className="variable-row">
                        <Button type="link" danger onClick={() => handleDeleteVariable(index)}>
                            ❌
                        </Button>
                        <Select
                            placeholder="نوع متغیر"
                            value={variable.type}
                            onChange={(value) => {
                                const updatedVariables = [...variables];
                                updatedVariables[index].type = value;
                                setVariables(updatedVariables);
                            }}
                            style={{ width: "30%" }}
                        >
                            {variableTypes.map((type) => (
                                <Select.Option key={type} value={type}>
                                    {type}
                                </Select.Option>
                            ))}
                        </Select>
                        <Input
                            placeholder="نام متغیر"
                            value={variable.name}
                            onChange={(e) => {
                                const updatedVariables = [...variables];
                                updatedVariables[index].name = e.target.value;
                                setVariables(updatedVariables);
                            }}
                        />
                    </div>
                ))}
                <Button type="dashed" onClick={handleAddVariable} style={{ marginBottom: "10px", width: "100%" }}>
                    افزودن متغیر جدید
                </Button>
                <Button type="primary" onClick={handleSaveTemplate} style={{ width: "100%" }}>
                    ذخیره تمپلیت JRXML
                </Button>
            </Form>
        </div>
    );
};

export default JRXMLTemplate;

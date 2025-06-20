import React, { useState, useEffect } from "react";
import { Button, Input, Form, Select, message } from "antd";
import api from "../services/Api";
import axios from "axios";

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
            console.log("::::::::::::::: 1")
            console.log(templateName)
            console.log(variables)

            await api.post("/jrxml/templates/create", { name: templateName, variables });

            await axios.post(
                'http://localhost:8080/api/reports/jrxml/templates/create',
                JSON.stringify({ value: variables }),
                { params: templateName }
            );

            // await axios.create({
            //     baseURL: "http://localhost:8080",
            //     headers: {
            //         "Access-Control-Allow-Origin": "*",
            //         "Content-Type": "application/json",
            //     }
            // }).post(
            //     '/api/reports/jrxml/templates/create',
            //     variables,
            //     { params: templateName }
            // );

            console.log("::::::::::::::: 2")

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
            <h2 className="entezar-font"><a>ایجاد تمپلیت</a> - <a style={{fontSize: "14px"}}>(با فرمت  JRXML)</a></h2>
            <Form layout="vertical" className="jrxml-template-form">
                <Form.Item label="نام تمپلیت" >
                    <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </Form.Item>
                <p style={{textAlign: "right"}}>متغیرها</p>
                {variables.map((variable, index) => (
                    <div key={index} className="variable-row">
                        <Input
                            placeholder="نام متغیر"
                            value={variable.name}
                            onChange={(e) => {
                                const updatedVariables = [...variables];
                                updatedVariables[index].name = e.target.value;
                                setVariables(updatedVariables);
                            }}
                        />
                        <Select
                            defaultValue={variableTypes[0]}
                            style={{width: "40%"}}
                            placeholder="نوع متغیر"
                            value={variable.type}
                            onChange={(value) => {
                                const updatedVariables = [...variables];
                                updatedVariables[index].type = value;
                                setVariables(updatedVariables);
                            }}
                        >
                            {variableTypes.map((type) => (
                                <Select.Option key={type} value={type} className="variable-row-select-option">
                                    {type}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button type="link" danger onClick={() => handleDeleteVariable(index)}>
                            ❌
                        </Button>
                    </div>
                ))}
                <Button type="dashed" onClick={handleAddVariable} style={{ marginBottom: "10px", width: "100%" }}>
                    افزودن متغیر جدید
                </Button>
                {/*<Button type="primary" onClick={handleSaveTemplate} style={{ width: "100%" }}>*/}
                <Button type="primary" onClick={handleSaveTemplate} style={{marginTop: "10px", width: "40%"}}>
                    ذخیره تمپلیت JRXML
                </Button>
            </Form>
        </div>
    );
};

export default JRXMLTemplate;

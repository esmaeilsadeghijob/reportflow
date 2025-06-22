import React, { useState, useEffect } from "react";
import { Upload, Button, Input, message, Spin, Form, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const paramTypeMapping = {
    Integer: 1,
    String: 2,
    Date: 3,
    Boolean: 4,
    Double: 5,
    Long: 6
};

const reverseParamType = {
    1: "Integer",
    2: "String",
    3: "Date",
    4: "Boolean",
    5: "Double",
    6: "Long"
};

const UploadReport = ({ onUploadSuccess }) => {
    const [cid, setCid] = useState("");
    const [sid, setSid] = useState("");
    const [reportCode, setReportCode] = useState("");
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [variableTypes, setVariableTypes] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/reports/jrxml/variable-types")
            .then((res) => setVariableTypes(res.data))
            .catch(() => message.error("دریافت لیست نوع متغیرها ناموفق بود"));
    }, []);

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
            const response = await axios
                .create({
                    baseURL: "http://localhost:8080/api/reports",
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .post("/extract-params", formData);

            const filteredParams = response.data.filter(
                (param) =>
                    !["cid", "sid", "reportcode", "filename"].includes(
                        param.paramName.toLowerCase()
                    )
            );

            setParams(
                filteredParams.map((param) => ({
                    ...param,
                    value: "",
                    source: param.source || "parameter",
                    paramType:
                        param.source === "field"
                            ? reverseParamType[param.paramType] || "String"
                            : param.paramType
                }))
            );
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
            message.error("لطفا تمامی فیلدهای اجباری را وارد کنید!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("cid", cid);
        formData.append("sid", sid);
        formData.append("filename", filename);
        formData.append("reportCode", reportCode);

        params.forEach((param) => {
            formData.append(`param_${param.paramName}`, param.value || "");
            const typeValue =
                typeof param.paramType === "string"
                    ? paramTypeMapping[param.paramType]
                    : param.paramType;
            formData.append(`type_${param.paramName}`, typeValue || 0);
        });

        try {
            setLoading(true);
            await axios
                .create({
                    baseURL: "http://localhost:8080/api/reports",
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .post("/upload", formData);

            message.success("گزارش با موفقیت ثبت شد!");
            onUploadSuccess && onUploadSuccess();
            setStep(1);
            setFile(null);
            setCid("");
            setSid("");
            setFilename("");
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
                        <Button
                            type="primary"
                            onClick={handleTemplateUpload}
                            style={{ marginTop: "10px" }}
                        >
                            استخراج پارامترها
                        </Button>
                    </div>
                ) : (
                    <Form
                        layout="vertical"
                        className="uploadReportform label-left"
                        labelAlign="left" // <=== این خط اضافه شده برای چپ‌چین
                    >
                        <Form.Item label="Filename">
                            <Input
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                placeholder="نام گزارش"
                            />
                        </Form.Item>
                        <Form.Item label="CID">
                            <Input value={cid} onChange={(e) => setCid(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="SID">
                            <Input value={sid} onChange={(e) => setSid(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="Report Code">
                            <Input
                                value={reportCode}
                                onChange={(e) => setReportCode(e.target.value)}
                            />
                        </Form.Item>

                        {params.map((param, index) => (
                            <Form.Item
                                label={
                                    <>
                                        {param.paramName}
                                        <span style={{fontSize: "12px", color: "#888", marginInlineStart: 6}}>
                      ({param.source === "field" ? "فیلد داخلی" : "پارامتر ورودی"})
                    </span>
                                    </>
                                }
                                key={index}
                            >
                                {param.source === "field" ? (
                                    <Select
                                        placeholder="نوع فیلد را انتخاب کنید"
                                        value={param.paramType}
                                        onChange={(value) => {
                                            const updated = [...params];
                                            updated[index].paramType = value;
                                            setParams(updated);
                                        }}
                                    >
                                        {variableTypes.map((type) => (
                                            <Select.Option key={type} value={type}>
                                                {type}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Input
                                        value={param.value}
                                        placeholder="مقدار"
                                        onChange={(e) => {
                                            const updated = [...params];
                                            updated[index].value = e.target.value;
                                            setParams(updated);
                                        }}
                                    />
                                )}
                            </Form.Item>
                        ))}

                        <div style={{textAlign: "center"}}>
                            <Button
                                type="primary"
                                onClick={handleFinalUpload}
                                style={{marginTop: "10px", width: "40%"}}
                            >
                                ذخیره گزارش
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </Spin>
    );
};

export default UploadReport;

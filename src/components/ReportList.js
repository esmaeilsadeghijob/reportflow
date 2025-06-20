import React from "react";
import {List, Button, message, Popconfirm, Tooltip} from "antd";
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import axios from "axios";

const ReportList = ({reports, onDeleteSuccess, onPreview}) => {
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/reports/${id}`);
            message.success("گزارش با موفقیت حذف شد.");
            if (onDeleteSuccess) onDeleteSuccess();
        } catch (error) {
            message.error("حذف گزارش ناموفق بود.");
            console.error("Error in deleting report:", error);
        }
    };

    return (
        <div>
            <h2 style={{textAlign: "center"}} className="entezar-font">لیست گزارش‌ها</h2>
            <List
                bordered
                dataSource={reports}
                renderItem={(report) => (
                    <List.Item key={report.id}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            <span style={{fontWeight: "bold", fontSize: "14px"}}>
                                شماره گزارش: {report.reportCode}
                            </span>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Tooltip title="پیش‌نمایش">
                                    <Button
                                        type="link"
                                        icon={<EyeOutlined/>}
                                        onClick={() => onPreview(report.id)}
                                        style={{marginRight: 10}}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="آیا مطمئن هستید که می‌خواهید حذف کنید؟"
                                    onConfirm={() => handleDelete(report.id)}
                                    okText="بله"
                                    cancelText="خیر"
                                >
                                    <Button type="link" icon={<DeleteOutlined/>} danger/>
                                </Popconfirm>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ReportList;

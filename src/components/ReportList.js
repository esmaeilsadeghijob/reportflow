import React from "react";
import { List, Button, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ReportList = ({ reports, onDeleteSuccess, onPreview }) => {
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
            <h2 style={{ textAlign: "center" }} className="entezar-font">لیست گزارش‌ها</h2>
            <List
                bordered
                dataSource={reports}
                renderItem={(report) => (
                    <List.Item key={report.id}>
                        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                            <Popconfirm
                                title="آیا مطمئن هستید که می‌خواهید حذف کنید؟"
                                onConfirm={() => handleDelete(report.id)}
                                okText="بله"
                                cancelText="خیر"
                            >
                                <Button
                                    type="link"
                                    icon={<DeleteOutlined />}
                                    danger
                                    style={{ marginRight: 10 }}
                                />
                            </Popconfirm>
                            <span style={{ flex: 1 }}>گزارش شماره {report.reportCode}</span>
                            <Button onClick={() => onPreview(report.id)} style={{ marginLeft: 10 }}>
                                پیش‌نمایش
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ReportList;

import {List} from "antd";
import {useEffect, useState} from "react";
import {getReportsByTemplate} from "../api/api";

const ReportsList = ({templateId, onSelect}) => {
    const [reports, setReports] = useState([]);
    useEffect(() => {
        if (templateId) {
            getReportsByTemplate(templateId).then(setReports);
        }
    }, [templateId]);

    return (
        <List
            bordered
            header="خروجی‌های ساخته شده"
            dataSource={reports}
            renderItem={(item) => (
                <List.Item onClick={() => onSelect(item)} style={{cursor: "pointer"}}>
                    {item.format} - {new Date(item.createdAt).toLocaleString()}
                </List.Item>
            )}
        />
    );
};
export default ReportsList;
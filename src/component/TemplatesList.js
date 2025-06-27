import {useEffect, useState} from "react";
import {getTemplates} from "../api/api";
import {List} from "antd";

const TemplatesList = ({onSelect}) => {
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        getTemplates().then(setTemplates);
    }, []);

    return (
        <List
            bordered
            header="قالب‌ها"
            dataSource={templates}
            renderItem={(item) => (
                <List.Item onClick={() => onSelect(item)} style={{cursor: "pointer"}}>
                    {item.name}
                </List.Item>
            )}
        />
    );
};
export default TemplatesList;
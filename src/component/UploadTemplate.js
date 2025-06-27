import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadTemplate } from "../api/api";

const UploadTemplate = () => {
    const props = {
        beforeUpload: async (file) => {
            const formData = new FormData();
            formData.append("name", prompt("نام قالب؟"));
            formData.append("description", prompt("توضیحات قالب؟"));
            formData.append("file", file);
            await uploadTemplate(formData);
            message.success("تمپلیت آپلود شد!");
            return false;
        },
    };
    return <Upload {...props}><Button icon={<UploadOutlined />}>آپلود قالب</Button></Upload>;
};

export default UploadTemplate;
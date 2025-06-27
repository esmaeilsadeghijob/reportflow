import { Row, Col } from "antd";
import TemplatesList from "../component/TemplatesList";
import UploadTemplate from "../component/UploadTemplate";
import ParameterForm from "../component/ParameterForm";
import ReportsList from "../component/ReportsList";
import PreviewPanel from "../component/PreviewPanel";
import { useState } from "react";

const MainPage = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    return (
        <Row style={{ direction: "rtl" }}>
            <Col span={12}>
                <UploadTemplate />
                <TemplatesList onSelect={setSelectedTemplate} />
                {selectedTemplate && (
                    <>
                        <ParameterForm template={selectedTemplate} />
                        <ReportsList
                            templateId={selectedTemplate.id}
                            onSelect={setSelectedReport}
                        />
                    </>
                )}
            </Col>
            <Col span={12}>
                <PreviewPanel report={selectedReport} />
            </Col>
        </Row>
    );
};

export default MainPage;
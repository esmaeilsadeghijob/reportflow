const PreviewPanel = ({ report }) => {
    if (!report) return <div>خروجی‌ای انتخاب نشده</div>;
    const blob = new Blob([new Uint8Array(report.data)], {
        type:
            report.format === "pdf"
                ? "application/pdf"
                : "text/html",
    });
    const url = URL.createObjectURL(blob);
    return (
        <iframe
            title="preview"
            src={url}
            style={{ width: "100%", height: "100vh" }}
        />
    );
};
export default PreviewPanel;
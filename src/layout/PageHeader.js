import React from 'react';

const PageHeader = () => {
    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                textAlign: 'center',
                padding: '20px 0',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f9f9f9',
                zIndex: 1000,
            }}
        >
            <h1 style={{ margin: 0 }} className="lalezar-font">مدیریت گزارشات جسپر - شرکت دانشوران سرمد</h1>
            <p style={{ margin: '10px 0 0' }} className="mjflow-font">
                پلتفرمی برای پردازش و مدیریت گزارشات جسپر توسط شرکت دانشوران سرمد. وب‌سایت شرکت
            </p>
        </header>
    );
};

export default PageHeader;

import React from 'react';

const PageFooter = () => {
    return (
        <footer
            style={{
                textAlign: 'center',
                padding: '10px 0',
                borderTop: '1px solid #ddd',
                marginTop: '20px',
                backgroundColor: '#f9f9f9'
            }}
        >
            <p>© {new Date().getFullYear()} شرکت دانشوران سرمد. کلیه حقوق محفوظ است.</p>
        </footer>
    );
};

export default PageFooter;

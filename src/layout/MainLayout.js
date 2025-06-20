import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';

const MainLayout = ({ children }) => {
    return (
        <div>
            <PageHeader />
            {/* تنظیم paddingTop برای ایجاد فاصله بین هدر و محتو
            ای اصلی */}
            <main style={{ paddingTop: '120px', minHeight: 'calc(100vh - 120px)' }}>
                {children}
            </main>
            <PageFooter />
        </div>
    );
};

export default MainLayout;

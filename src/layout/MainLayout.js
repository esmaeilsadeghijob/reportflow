// src/layout/MainLayout.js
import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';

const MainLayout = ({ children }) => {
    return (
        <div>
            <PageHeader />
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
                {children}
            </main>
            <PageFooter />
        </div>
    );
};

export default MainLayout;

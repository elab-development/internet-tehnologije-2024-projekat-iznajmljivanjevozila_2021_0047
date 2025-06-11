import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CustomBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);

    const breadcrumbStyle = {
        backgroundColor: '#f1f5f9',
        padding: '10px 20px',
        borderBottom: '1px solid #cbd5e1',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const listStyle = {
        listStyle: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        fontSize: '16px',
        color: '#1e293b',
    };

    const linkStyle = {
        color: '#1e40af',
        textDecoration: 'none',
        fontWeight: '600',
    };

    const separator = <span style={{ margin: '0 8px', color: '#94a3b8' }}>{'>'}</span>;

    return (
        <nav style={breadcrumbStyle}>
            <ol style={listStyle}>
                <li>
                    <Link to="/" style={linkStyle}>Home</Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={to} style={{ display: 'flex', alignItems: 'center' }}>
                            {separator}
                            {isLast ? (
                                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>
                                    {decodeURIComponent(value)}
                                </span>
                            ) : (
                                <Link to={to} style={linkStyle}>
                                    {decodeURIComponent(value)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default CustomBreadcrumbs;



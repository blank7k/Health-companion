import React from "react";

export function Card({ className = "", children, ...props }) {
    return (
        <div
            className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children, ...props }) {
    return (
        <div className={`p-4 border-b border-slate-200 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className = "", children, ...props }) {
    return (
        <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h2>
    );
}

export function CardContent({ className = "", children, ...props }) {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

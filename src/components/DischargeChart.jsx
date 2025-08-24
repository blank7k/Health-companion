import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export default function DischargeChart({ data, loading }) {
    if (loading) {
        return (
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle>Discharge Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className=" shadow-lg border-0 text-white bg-transparent">
            <CardHeader style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-white">Discharge Status Overview</span>
                </CardTitle>
            </CardHeader>
            <CardContent style={{ borderRadius: '0 0 0.5rem 0.5rem' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} style={{ background: 'transparent' }}>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #3b82f6', color: '#fff' }} labelStyle={{ color: '#3b82f6' }} itemStyle={{ color: '#fff' }} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
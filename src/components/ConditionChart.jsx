import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Activity } from "lucide-react";

export default function ConditionChart({ data, loading }) {
    if (loading) {
        return (
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle>Patient Condition Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    Skeleton
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-0 bg-gray-900 text-white bg-transparent">
            <CardHeader style={{ background: '#111827', borderRadius: '0.5rem 0.5rem 0 0' }}>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Patient Condition Distribution</span>
                </CardTitle>
            </CardHeader>
            <CardContent style={{ background: '#111827', borderRadius: '0 0 0.5rem 0.5rem' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #a78bfa', color: '#fff' }} labelStyle={{ color: '#a78bfa' }} itemStyle={{ color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card >
    );
}
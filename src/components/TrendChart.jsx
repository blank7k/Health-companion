import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function TrendChart({ data, loading }) {
    if (loading) {
        return (
            <Card className="shadow-lg border-0">
                <CardHeader>
                    <CardTitle>Discharge Trends (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    Skeleton
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-0 text-white bg-transparent">
            <CardHeader style={{ background: '#111827', borderRadius: '0.5rem 0.5rem 0 0' }}>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-white">Discharge Trends (Last 7 Days)</span>
                </CardTitle>
            </CardHeader>
            <CardContent style={{ background: '#111827', borderRadius: '0 0 0.5rem 0.5rem' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} >
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1' }} />
                        <Tooltip
                            contentStyle={{
                                background: '#1e293b',
                                border: '1px solid #22c55e',
                                color: '#fff',
                            }}
                            labelStyle={{ color: '#22c55e' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="discharges"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>

        </Card>
    );
}
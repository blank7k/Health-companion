import React, { useState } from "react";
import { mockPatients } from "../data/mockData";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity, Users, Calendar } from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";

import MetricCard from "./MetricCard";
import DischargeChart from "./DischargeChart";
import ConditionChart from "./ConditionChart";
import TrendChart from "./TrendChart";

// Types
interface Patient {
    id: string;
    name: string;
    admissionDate?: string;
    dischargeStatus: "ready" | "pending" | "delayed";
}

interface ChartData {
    name: string;
    value: number;
    color?: string;
}

interface TrendData {
    date: string;
    discharges: number;
}

interface Metric {
    title: string;
    value: string | number;
    change: string;
    icon: React.ElementType;
    color: string;
}

const Analytics: React.FC = () => {
    const [patients] = useState < Patient[] > (mockPatients);
    const [loading] = useState < boolean > (false);

    const getAnalyticsData = () => {
        // Fake condition data since not present in mockPatients
        const conditionData: ChartData[] = [
            { name: "Critical", value: 1, color: "#ef4444" },
            { name: "Normal", value: 2, color: "#f59e0b" },
            { name: "Good", value: 2, color: "#22c55e" },
            { name: "Stable", value: 1, color: "#3b82f6" },
        ];

        const dischargeStatusData: ChartData[] = [
            {
                name: "Ready",
                value: patients.filter((p) => p.dischargeStatus === "ready").length,
            },
            {
                name: "Pending",
                value: patients.filter((p) => p.dischargeStatus === "pending").length,
            },
            {
                name: "Delayed",
                value: patients.filter((p) => p.dischargeStatus === "delayed").length,
            },
        ];

        // Generate trend data for the past 7 days
        const last7Days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date(),
        });

        const trendData: TrendData[] = last7Days.map((date) => {
            return {
                date: format(date, "MMM dd"),
                discharges: Math.floor(Math.random() * 3),
            };
        });

        return { conditionData, dischargeStatusData, trendData };
    };

    const { conditionData, dischargeStatusData, trendData } = getAnalyticsData();

    const totalDischarges = patients.filter((p) => p.dischargeStatus === "ready")
        .length;

    const avgLengthOfStay =
        patients.length > 0
            ? Math.round(
                patients.reduce((sum, p) => {
                    if (p.admissionDate) {
                        const admission = new Date(p.admissionDate);
                        const discharge = new Date();
                        return (
                            sum +
                            Math.abs(discharge.getTime() - admission.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                    }
                    return sum;
                }, 0) / patients.length
            )
            : 0;

    const metrics: Metric[] = [
        {
            title: "Total Patients",
            value: patients.length,
            change: "+12%",
            icon: Users,
            color: "blue",
        },
        {
            title: "Ready for Discharge",
            value: totalDischarges,
            change: "+8%",
            icon: Calendar,
            color: "green",
        },
        {
            title: "Avg Length of Stay",
            value: `${avgLengthOfStay} days`,
            change: "-2%",
            icon: Activity,
            color: "purple",
        },
        {
            title: "Ready Rate",
            value: `${patients.length > 0
                ? Math.round((totalDischarges / patients.length) * 100)
                : 0
                } %`,
            change: "+5%",
            icon: TrendingUp,
            color: "emerald",
        },
    ];

    return (
        <div className="p-6 space-y-8 bg-black min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                        Analytics Dashboard
                    </h1>
                    <p className="text-blue-300">
                        Comprehensive insights into patient discharge patterns
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <MetricCard key={index} metric={metric} loading={loading} />
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-800 relative">
                        <ConditionChart data={conditionData} loading={loading} />
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-800 relative">
                        <DischargeChart data={dischargeStatusData} loading={loading} />
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-gray-900 rounded-lg p-6 shadow-2xl border border-gray-800 relative">
                    <TrendChart data={trendData} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;

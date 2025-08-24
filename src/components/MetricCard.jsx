import React from "react";
import { Card, CardContent } from "./ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ metric, loading }) {
    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        double Skeleton
                    </div>
                    Double Skeleton
                </CardContent>
            </Card>
        );
    }

    const getColorClasses = (color) => {
        const colors = {
            blue: "from-blue-500 to-blue-600 text-blue-600",
            green: "from-green-500 to-green-600 text-green-600",
            purple: "from-purple-500 to-purple-600 text-purple-600",
            emerald: "from-emerald-500 to-emerald-600 text-emerald-600"
        };
        return colors[color] || colors.blue;
    };

    const colorClasses = getColorClasses(metric.color);
    const IconComponent = metric.icon;

    return (
        <Card className="relative overflow-hidden bg-black border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} rounded-full opacity-10`} />
            <CardContent className="p-6 relative bg-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                        <p className="text-3xl font-bold text-white">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} bg-opacity-20`}>
                        <IconComponent className={`text-gray-900 w-6 h-6 ${colorClasses.split(' ')[2]}`} />
                    </div>
                </div>
                {metric.change && (
                    <div className="flex items-center gap-1">
                        {metric.change.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {metric.change} from last period
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Brain,
  Target,
} from "lucide-react";
import { mockPatients } from "../data/mockData";

type Patient = (typeof mockPatients)[number];
interface AnalysisSectionProps {
  patients?: Patient[];
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ patients }) => {
  const data: Patient[] = patients ?? mockPatients;
  const total = data.length;
  const ready = data.filter((p) => p.dischargeStatus === "ready").length;
  const pending = data.filter((p) => p.dischargeStatus === "pending").length;
  const delayed = data.filter((p) => p.dischargeStatus === "delayed").length;
  // Calculate average stay in days
  const avgStay =
    total > 0
      ? data.reduce(
          (acc, p) =>
            acc +
            Math.ceil(
              (Date.now() - new Date(p.admissionDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          0
        ) / total
      : 0;

  // AI Insights
  const aiInsights = [];
  if (delayed > 0) {
    aiInsights.push({
      type: "alert",
      title: "Delayed Discharges",
      message: `${delayed} patient${
        delayed > 1 ? "s are" : " is"
      } experiencing discharge delays.`,
      priority: "high",
    });
  }
  if (ready > 0) {
    aiInsights.push({
      type: "success",
      title: "Ready for Discharge",
      message: `${ready} patient${
        ready > 1 ? "s are" : " is"
      } ready for discharge.`,
      priority: "medium",
    });
  }
  if (avgStay > 7) {
    aiInsights.push({
      type: "warning",
      title: "Extended Stay Alert",
      message: `Average length of stay (${
        Math.round(avgStay * 10) / 10
      } days) is above optimal range.`,
      priority: "medium",
    });
  }
  if (pending > 0) {
    aiInsights.push({
      type: "info",
      title: "Pending Discharges",
      message: `${pending} patient${
        pending > 1 ? "s are" : " is"
      } pending discharge actions.`,
      priority: "low",
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-8 mx-6 my-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-700/10 pointer-events-none rounded-lg" />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-700/80 p-3 rounded-lg shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Analysis Dashboard
            </h2>
            <p className="text-sm text-blue-200">Real-time insights</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key Metrics */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <h3 className="text-md font-semibold text-white flex items-center space-x-2 mb-2">
              <BarChart3 className="h-4 w-4" />
              <span>Key Metrics</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/60 p-4 rounded-lg border border-blue-700 flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-300 font-medium">
                    Total
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{total}</p>
              </div>
              <div className="bg-green-900/60 p-4 rounded-lg border border-green-700 flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-300 font-medium">
                    Ready
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{ready}</p>
              </div>
              <div className="bg-yellow-900/60 p-4 rounded-lg border border-yellow-700 flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm text-yellow-200 font-medium">
                    Pending
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{pending}</p>
              </div>
              <div className="bg-red-900/60 p-4 rounded-lg border border-red-700 flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-300 font-medium">
                    Delayed
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mt-1">{delayed}</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="lg:col-span-5 flex flex-col">
            <h3 className="text-md font-semibold text-white flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4" />
              <span>AI Insights</span>
            </h3>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border text-sm shadow-lg flex items-center space-x-3 ${
                    insight.type === "alert"
                      ? "bg-red-900/60 border-red-700 text-red-200"
                      : insight.type === "success"
                      ? "bg-green-900/60 border-green-700 text-green-200"
                      : insight.type === "warning"
                      ? "bg-yellow-900/60 border-yellow-700 text-yellow-200"
                      : "bg-blue-900/60 border-blue-700 text-blue-200"
                  }`}
                >
                  {insight.type === "alert" && (
                    <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
                  )}
                  {insight.type === "success" && (
                    <Target className="h-6 w-6 text-green-400 flex-shrink-0" />
                  )}
                  {insight.type === "warning" && (
                    <Clock className="h-6 w-6 text-yellow-300 flex-shrink-0" />
                  )}
                  {insight.type === "info" && (
                    <Brain className="h-6 w-6 text-blue-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="text-xs opacity-90">{insight.message}</p>
                  </div>
                </div>
              ))}
              {aiInsights.length === 0 && (
                <div className="bg-green-900/60 border border-green-700 p-4 rounded-lg">
                  <p className="text-xs text-green-200 font-medium">
                    All Systems Normal
                  </p>
                  <p className="text-xs text-green-100 opacity-90">
                    No critical issues detected
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Discharge Analysis */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="text-md font-semibold text-white flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>Discharge Analysis</span>
            </h3>
            <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 p-4 rounded-lg border border-purple-700 mb-4 flex-1 flex flex-col justify-around">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-200">
                  Avg. Length of Stay
                </span>
                <span className="text-lg font-bold text-white">
                  {Math.round(avgStay * 10) / 10} days
                </span>
              </div>
              <div className="w-full bg-purple-700/40 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((avgStay / 14) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="bg-indigo-900/60 border border-indigo-700 p-4 rounded-lg flex-1 flex flex-col justify-center">
              <p className="text-sm font-medium text-indigo-200 mb-2">
                Discharge Status
              </p>
              <p className="text-sm text-indigo-100">Ready: {ready}</p>
              <p className="text-sm text-indigo-100">Pending: {pending}</p>
              <p className="text-sm text-indigo-100">Delayed: {delayed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSection;

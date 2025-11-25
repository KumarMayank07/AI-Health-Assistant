import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingDown,
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Report {
  _id: string;
  stage: number;
  stageLabel: string;
  createdAt: string;
}

export default function UserDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = reports
    .slice()
    .reverse()
    .slice(-6) // Last 6 reports
    .map((report, idx) => {
      const date = new Date(report.createdAt);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        severity: report.stage,
        label: report.stageLabel,
      };
    });

  const getLastReport = () => {
    if (reports.length === 0) return null;
    return reports[0];
  };

  const getAverageSeverity = () => {
    if (reports.length === 0) return 0;
    const sum = reports.reduce((acc, r) => acc + r.stage, 0);
    return (sum / reports.length).toFixed(1);
  };

  const getSeverityTrend = () => {
    if (reports.length < 2) return "stable";
    const recent = reports.slice(0, 3);
    const older = reports.slice(3, 6);

    if (older.length === 0) return "stable";

    const recentAvg =
      recent.reduce((acc, r) => acc + r.stage, 0) / recent.length;
    const olderAvg = older.reduce((acc, r) => acc + r.stage, 0) / older.length;

    if (recentAvg < olderAvg - 0.3) return "improving";
    if (recentAvg > olderAvg + 0.3) return "worsening";
    return "stable";
  };

  const lastReport = getLastReport();
  const trend = getSeverityTrend();

  return (
    <div className="container py-10 space-y-8">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Your Health Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your retina health and screening history
          </p>
        </div>
        <div className="flex gap-2 -mt-1">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <a href="/reports">
              <Eye className="h-4 w-4 mr-2" />
              New Screening
            </a>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="shadow-md hover:shadow-lg transition-all duration-200"
          >
            <a href="/reminders">
              <Calendar className="h-4 w-4 mr-2" />
              Set Reminder
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {reports.length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Total Reports</h3>
          <p className="text-sm text-gray-600">
            {lastReport
              ? `Last: ${new Date(lastReport.createdAt).toLocaleDateString()}`
              : "No reports yet. Upload to get started."}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">0</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Upcoming Reminders
          </h3>
          <p className="text-sm text-gray-600">No reminders configured.</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">24/7</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
          <p className="text-sm text-gray-600">
            Chat with our assistant any time.
          </p>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="p-6 shadow-lg border-t-4 border-t-blue-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              Severity Progress
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Lower values indicate better retina health
            </p>
          </div>
          {reports.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Average Severity</div>
              <div className="text-2xl font-bold text-gray-900">
                {getAverageSeverity()}
              </div>
              <div className="text-xs text-gray-500">
                Trend:{" "}
                <span
                  className={`font-semibold ${
                    trend === "improving"
                      ? "text-green-600"
                      : trend === "worsening"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {trend === "improving"
                    ? "↓ Improving"
                    : trend === "worsening"
                    ? "↑ Worsening"
                    : "→ Stable"}
                </span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : reports.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Data Yet
            </h4>
            <p className="text-sm text-gray-600 max-w-md">
              Upload your first retina image in the Reports section to start
              tracking your progress
            </p>
            <Button asChild className="mt-4">
              <a href="/reports">Upload First Image</a>
            </Button>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  label={{
                    value: "Severity Stage",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#6b7280", fontSize: 12 },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#111827", fontWeight: 600 }}
                  formatter={(value: any, name: any, props: any) => [
                    `Stage ${value} - ${props.payload.label}`,
                    "Severity",
                  ]}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  formatter={() => "Retinopathy Stage"}
                />
                <Bar
                  dataKey="severity"
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Recent Report Summary */}
      {lastReport && (
        <Card className="p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Most Recent Analysis
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Date</div>
              <div className="font-semibold text-gray-900">
                {new Date(lastReport.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Stage</div>
              <div className="font-semibold text-gray-900">
                Stage {lastReport.stage}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Classification</div>
              <div className="font-semibold text-gray-900">
                {lastReport.stageLabel}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ProgressChartProps {
  data: { date: string; scores: { [roomId: string]: number } }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zen-500">
        <div className="text-center">
          <div className="text-4xl mb-3">📈</div>
          <p>No progress data yet</p>
          <p className="text-sm">Data will appear as you assess and improve rooms</p>
        </div>
      </div>
    );
  }

  // Transform data for chart
  const chartData = data.map(entry => {
    const scores = Object.values(entry.scores);
    const avgScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;

    return {
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageScore: Math.round(avgScore * 10) / 10,
      roomCount: scores.length,
      ...entry.scores,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-zen-200">
          <p className="font-medium text-zen-800">{label}</p>
          <p className="text-mindful-600">
            Average Score: {payload[0].value}/10
          </p>
          <p className="text-zen-600 text-sm">
            {payload[0].payload.roomCount} rooms tracked
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="averageScore"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
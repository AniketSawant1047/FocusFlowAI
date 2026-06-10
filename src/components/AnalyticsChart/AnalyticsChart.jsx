import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

/**
 * Recharts component for data analytics visualization.
 * @param {string} type - 'weekly' | 'category' | 'status' | 'monthly'
 * @param {Array} data - Data payload array.
 */
export default function AnalyticsChart({ type = 'weekly', data = [] }) {
  
  // Custom tooltips styling matching dark mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700/50 dark:border-slate-200/50">
          <p className="mb-0.5">{label || payload[0].name}</p>
          <p className="text-primary-400 dark:text-primary-600">
            {payload[0].name ? `${payload[0].name}: ` : ''}
            {payload[0].value} {type === 'weekly' ? 'mins' : type === 'category' ? 'tasks' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  // COLOR PALETTES
  const COLORS = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

  if (type === 'weekly') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:hidden" opacity={0.3} />
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" opacity={0.15} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              name="Focus Duration"
              stroke="#7c3aed" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMinutes)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'category') {
    return (
      <div className="h-72 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'status') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }} />
            <Bar dataKey="value" name="Task Count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Completed' ? '#10b981' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'monthly') {
    return (
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:hidden" opacity={0.3} />
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" opacity={0.15} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="completed" 
              name="Completed Tasks"
              stroke="#10b981" 
              strokeWidth={3} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              name="Focus Sessions"
              stroke="#8b5cf6" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}

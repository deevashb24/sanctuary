'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Users, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

// ──────────────────────────────────────────────
// Mock Data Generation
// ──────────────────────────────────────────────

interface DailyAggregate {
  date: string;
  averageStress: number;
}

interface CapacityData {
  dayOfWeek: string;
  timeOfDay: string;
  timeIndex: number;
  dayIndex: number;
  stressIntensity: number; // 1 to 10
}

const generateMockData = () => {
  const dailyData: DailyAggregate[] = [];
  const now = new Date();
  
  // Last 30 days
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    // Smooth random walk for the area chart
    const baseStress = 4 + Math.sin(i * 0.5) * 2;
    const noise = (Math.random() - 0.5) * 1.5;
    dailyData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      averageStress: Number((baseStress + noise).toFixed(1))
    });
  }

  // Capacity Heatmap (Days x Times)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['Morning', 'Midday', 'Afternoon', 'Evening'];
  const capacityData: CapacityData[] = [];

  days.forEach((day, dayIndex) => {
    times.forEach((time, timeIndex) => {
      // Mondays and Afternoons generally higher stress
      let base = 3;
      if (day === 'Mon' || day === 'Tue') base += 2;
      if (time === 'Afternoon') base += 2;
      if (day === 'Sat' || day === 'Sun') base -= 2;
      
      const intensity = Math.max(1, Math.min(10, base + Math.floor(Math.random() * 3)));
      
      capacityData.push({
        dayOfWeek: day,
        timeOfDay: time,
        dayIndex,
        timeIndex,
        stressIntensity: intensity
      });
    });
  });

  return { dailyData, capacityData };
};

// ──────────────────────────────────────────────
// Custom Tooltips
// ──────────────────────────────────────────────

const AreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
        <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-light text-teal-400">{payload[0].value}</p>
          <p className="text-white/40 text-sm mb-1">/ 10 avg stress</p>
        </div>
      </div>
    );
  }
  return null;
};

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CapacityData;
    return (
      <div className="bg-black/80 border border-white/10 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
        <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2">
          {data.dayOfWeek} • {data.timeOfDay}
        </p>
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.stressIntensity >= 7 ? '#f97316' : data.stressIntensity >= 4 ? '#6366f1' : '#2dd4bf' }} 
          />
          <p className="text-lg font-light text-white">Intensity: {data.stressIntensity}</p>
        </div>
      </div>
    );
  }
  return null;
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

export function VibeDashboard() {
  const { dailyData, capacityData } = useMemo(() => generateMockData(), []);

  // Format Y-axis for scatter chart
  const formatYAxis = (tickItem: number) => {
    const times = ['Morning', 'Midday', 'Afternoon', 'Evening'];
    return times[tickItem] || '';
  };

  // Format X-axis for scatter chart
  const formatXAxis = (tickItem: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[tickItem] || '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-teal-400 mb-3">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Org ID: ORG-9942</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">Collective Vibe</h1>
          <p className="text-white/40 mt-2 max-w-xl">
            Anonymized aggregate wellbeing data. Track the pulse of your community and identify when support is needed most.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Privacy Preserving</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: 30-Day Trend (Spans 2 columns) */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl text-white font-medium">30-Day Stress Index</h2>
              <p className="text-white/40 text-sm">Average daily aggregate</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-mono">-12% vs last month</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                />
                <RechartsTooltip content={<AreaTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="averageStress" 
                  stroke="#2dd4bf" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorStress)" 
                  activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#000', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Capacity Curve / Heatmap */}
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md relative overflow-hidden">
          <div className="mb-8">
            <h2 className="text-xl text-white font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Capacity Curve
            </h2>
            <p className="text-white/40 text-sm">Peak friction times</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  dataKey="dayIndex" 
                  domain={[0, 6]} 
                  tickFormatter={formatXAxis} 
                  tickCount={7}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  type="number" 
                  dataKey="timeIndex" 
                  domain={[0, 3]} 
                  tickFormatter={formatYAxis} 
                  tickCount={4}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  dx={-10}
                />
                <ZAxis type="number" dataKey="stressIntensity" range={[20, 250]} />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
                <Scatter 
                  data={capacityData} 
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    // Color based on intensity
                    const color = payload.stressIntensity >= 7 ? '#f97316' : payload.stressIntensity >= 4 ? '#6366f1' : '#2dd4bf';
                    // Size based on intensity (ZAxis already scales the payload slightly, we'll use ZAxis radius)
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={Math.max(4, payload.stressIntensity * 1.5)} 
                        fill={color} 
                        fillOpacity={0.6}
                        stroke={color}
                        strokeWidth={1}
                        style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                      />
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-white/40 uppercase">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-400" /> Low</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Med</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> High</div>
          </div>
        </div>

      </div>
    </div>
  );
}

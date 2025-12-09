import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { DataPoint } from '../utils/statistics';

interface ScatterChartProps {
  data: DataPoint[];
  labelX?: string;
  labelY?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 shadow-lg rounded-md text-sm">
        <p className="font-semibold text-gray-700">Data Point</p>
        <p className="text-indigo-600">X: {payload[0].value}</p>
        <p className="text-pink-600">Y: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const ScatterPlot: React.FC<ScatterChartProps> = ({ data, labelX = 'Variable X', labelY = 'Variable Y' }) => {
  if (data.length === 0) return null;

  // Determine domain padding for better visuals
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));

  const paddingX = (maxX - minX) * 0.1 || 1;
  const paddingY = (maxY - minY) * 0.1 || 1;

  const domainX = [minX - paddingX, maxX + paddingX];
  const domainY = [minY - paddingY, maxY + paddingY];

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={labelX} 
            domain={domainX as [number, number]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
             <Label value={labelX} offset={0} position="insideBottom" style={{ fill: '#374151', fontSize: '14px', fontWeight: 500 }} />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="y" 
            name={labelY} 
            domain={domainY as [number, number]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          >
            <Label value={labelY} angle={-90} position="insideLeft" style={{ fill: '#374151', fontSize: '14px', fontWeight: 500 }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Data Points" data={data} fill="#6366f1" line={{ stroke: '#e0e7ff', strokeWidth: 1 }} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
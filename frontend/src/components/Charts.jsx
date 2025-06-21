import React from "react";
import { 
  PieChart, 
  BarChart, 
  LineChart, 
  Pie, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell
} from "recharts";

const graphColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const formatValue = (value) => value ? parseFloat(value).toFixed(2) : "0.00";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="font-bold text-slate-100">{label || payload[0].name}</p>
        <p className="text-indigo-400">Total: R$ {formatValue(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const tickStyle = { fill: '#a0aec0', fontSize: '12px' };
const legendStyle = { color: '#a0aec0', fontSize: '14px', paddingTop: '20px' };
const gridStyle = { stroke: '#4a5568', strokeDasharray: "3 3" };

const Charts = ({ type, data }) => {
  const chartWidth = 600;
  const chartHeight = 350;

  console.log("Charts component - type:", type, "data:", data);

  // Verificar se os dados existem e são válidos
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p className="text-slate-400">Nenhum dado disponível para exibir no gráfico.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        {type === "pie" && (
          <PieChart width={chartWidth} height={chartHeight}>
            <Pie 
              data={data} 
              dataKey="totalSpent" 
              nameKey="_id" 
              cx="50%" 
              cy="50%" 
              outerRadius={120} 
              fill="#8884d8" 
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="bold">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={graphColors[index % graphColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
            <Legend iconSize={10} wrapperStyle={legendStyle} />
          </PieChart>
        )}

        {type === "bar" && (
          <BarChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="_id" tickLine={false} tick={tickStyle} />
            <YAxis tickLine={false} tick={tickStyle} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
            <Legend iconSize={10} wrapperStyle={legendStyle} />
            <Bar dataKey="totalSpent">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={graphColors[index % graphColors.length]} />
              ))}
            </Bar>
          </BarChart>
        )}

        {type === "line" && (
          <LineChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="_id" tickLine={false} tick={tickStyle} />
            <YAxis tickLine={false} tick={tickStyle}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
            <Legend iconSize={10} wrapperStyle={legendStyle} />
            <Line type="monotone" dataKey="totalSpent" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8 }} dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }} />
          </LineChart>
        )}
    </div>
  );
};

export default Charts;
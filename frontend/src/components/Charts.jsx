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

const graphColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const formatValue = (value) => value ? parseFloat(value).toFixed(2) : "0.00";

const Charts = ({ type, data }) => {
  return (
    <div className="chart">
      {type === "pie" && (
        <PieChart width={400} height={400}>
          <Pie 
            data={data} 
            dataKey="totalSpent" 
            nameKey="_id" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
            fill="#8884d8" 
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={graphColors[index % graphColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${formatValue(value)}`} />
        </PieChart>
      )}

      {type === "bar" && (
        <BarChart width={400} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${formatValue(value)}`} />
          <Bar dataKey="totalSpent">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={graphColors[index % graphColors.length]} />
            ))}
          </Bar>
        </BarChart>
      )}

      {type === "line" && (
        <LineChart width={400} height={300} data={data}>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${formatValue(value)}`} />
          <Line type="monotone" dataKey="totalSpent" stroke="#8884d8" />

        </LineChart>
      )}

      <div className="legend">
        {data.map((entry, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: graphColors[index % graphColors.length] }}></span>
            <span className="legend-label">{entry._id}</span>
            <span className="legend-value">R$ {entry.totalSpent.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Charts;
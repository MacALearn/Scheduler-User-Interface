import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter,
} from 'recharts';

// TaskGraph component receives chartData and renders the LineChart
const TaskGraph = ({ data }) => {
  // Custom tooltip to show task details on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const taskDetails = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`Time: ${taskDetails.time}`}</p>
          <p>{`Task ID: ${taskDetails.taskId}`}</p>
          <p>{`Priority: ${taskDetails.priority}`}</p>
          <p>{`Action: ${taskDetails.action}`}</p>
          {taskDetails.ijack && <p style={{ color: 'red' }}>Task was suspended (Ijacking detected)</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis
          label={{ value: 'Priority', angle: -90, position: 'insideLeft' }}
          domain={[0, 4]}
          ticks={[0, 1, 2, 3, 4]}
          tickFormatter={(tick) => {
            switch (tick) {
              case 4: return 'Critical';
              case 3: return 'Higher';
              case 2: return 'Middle';
              case 1: return 'Lower';
              case 0: return 'Non';
              default: return '';
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="priority" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Scatter
          dataKey="priority"
          fill="red"
          shape={data.map((entry) => (entry.ijack ? 'star' : 'circle'))}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TaskGraph;

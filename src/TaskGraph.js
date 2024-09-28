  import React from 'react';
  import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  } from 'recharts';

  const priorities = ["Non", "Lower", "Middle", "Higher", "Critical"];

  const TaskGraph = ({ data }) => {
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const taskDetails = payload[0].payload;
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
            <p>{`Time: ${taskDetails.time}`}</p>
            <p>{`Task ID: ${taskDetails.taskId}`}</p>
            <p>{`Priority: ${priorities[taskDetails.priority]}`}</p>
            <p>{`Action: ${taskDetails.action}`}</p>
            {taskDetails.ijack && <p style={{ color: 'red' }}>Task was preempted (Ijacking detected)</p>}
            {taskDetails.suspended && !taskDetails.longSuspended && <p style={{ color: 'gray' }}> (Suspended)</p>}
            {taskDetails.longSuspended && <p style={{ color: 'purple' }}> (Long Task Suspended)</p>}
          </div>
        );
      }
      return null;
    };

    const renderCustomizedDot = (props) => {
      const { cx, cy, payload } = props;

      if (payload.ijack) {
        return (
          <path d="M12 0L15.708 7.272L23.708 8.433L17.854 14.102L19.236 22.067L12 18.272L4.764 22.067L6.146 14.102L0.292 8.433L8.292 7.272L12 0Z"
            fill="red" stroke="red" transform={`translate(${cx - 12}, ${cy - 12}) scale(0.5)`} />
        );
      }

      if (payload.suspended && !payload.longSuspended) {
        return (
          <circle cx={cx} cy={cy} r="4" fill="gray" />
        );
      }

      if (payload.longSuspended) {
        return (
          <circle cx={cx} cy={cy} r="4" fill="purple" />
        );
      }

      if (payload.action === "Executing task") {
        return (
          <circle cx={cx} cy={cy} r="4" fill="orange" />
        );
      }

      if (payload.action === "Task completed") {
        return (
          <circle cx={cx} cy={cy} r="4" fill="green" />
        );
      }

      return (
        <circle cx={cx} cy={cy} r="4" fill="#8884d8" />
      );
    };
    const CustomLegend = () => (
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'orange', marginRight: '5px' }}></div>
          <span>Executing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'green', marginRight: '5px' }}></div>
          <span>Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'gray', marginRight: '5px' }}></div>
          <span>Suspended</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'purple', marginRight: '5px' }}></div>
          <span>Long Suspended</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <svg width="10" height="10" style={{ marginRight: '5px' }}>
            <path d="M5 0L6.545 3.028L9.87 3.514L7.435 5.876L8.01 9.186L5 7.614L1.99 9.186L2.565 5.876L0.13 3.514L3.455 3.028L5 0Z" fill="red" />
          </svg>
          <span>Preempted (Ijacking)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#8884d8', marginRight: '5px' }}></div>
          <span>Other</span>
        </div>
      </div>
    );
  
    return (
      <ResponsiveContainer width="100%" height={250} overflow="auto">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }} // Increased bottom margin
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time', position: 'bottom', offset: 0 }} 
            tick={{ dy: 5 }} // Adjusts the Y position of the X-axis ticks
          />
          <YAxis
            label={{ value: 'Priority', angle: -90, position: 'insideLeft', offset: -5 }} // Adjusts the X position of the Y-axis label
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
          <Line type="monotone" dataKey="priority" stroke="#8884d8" dot={renderCustomizedDot} />
        </LineChart>
        <CustomLegend />
      </ResponsiveContainer>

    );
  };

  export default TaskGraph;
  
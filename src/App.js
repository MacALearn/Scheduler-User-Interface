import React, { useState, useEffect, useRef } from 'react';
import InputDashboard from './InputDashboard';
import OutputDashboard from './OutputDashboard';
import TaskGraph from './TaskGraph';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const priorityMap = {
    Critical: 4,
    Higher: 3,
    Middle: 2,
    Lower: 1,
    Non: 0,
  };

  const parseMessage = (message) => {
    const regexes = [
      /\[(.*?)\] \[info\] Executing task with ID: (\d+), with priority: (\w+)\./,
      /\[(.*?)\] \[info\] New task created with priority: (\w+) and running time: (.*?)\./,
      /\[(.*?)\] \[info\] Task with ID: (\d+) and priority: (\w+) is completed\./,
      /\[(.*?)\] \[info\] Preempting task with ID: (\d+) and priority: (\w+) for real-time task\./,
      /\[(.*?)\] \[info\] Task with ID: (\d+) and priority: (\w+) suspended and added back to WRR queue\./,
      /\[(.*?)\] \[info\] The long task with ID: (\d+) and priority: (\w+) is suspended and will continue later\./
    ];

    for (const regex of regexes) {
      const match = message.match(regex);
      if (match) {
        const timestamp = match[1];
        const taskId = match[2];
        const priority = match[3] || 'Non';

        let action;
        let ijack = false;
        let suspended = false;
        let longSuspended = false;


        if (message.includes("Executing task")) {
          action = "Executing task";
        } else if (message.includes("New task created")) {
          action = "New task created";
        } else if (message.includes("is completed")) {
          action = "Task completed";
        } else if (message.includes("Preempting task")) {
          action = "Preempting task";
          ijack = true;
        } else if (message.includes("The long task")) {
          action = "Long Task suspended";
          suspended = true;
          longSuspended = true;  // מסמן שהשהיה היא עבור משימה ארוכה
        } else if (message.includes("suspended")) {
          action = "Task suspended";
          suspended = true;
        } else {
          action = "Unknown action";
        }

        return { timestamp, action, taskId, priority, ijack, suspended,longSuspended };
      }
    }

    return null;
  };
  const generateChartData = () => {
    const chartData = [];
    const taskStatus = {};  // Map to track task statuses by ID

    messages.forEach((msg) => {
      const parsed = parseMessage(msg);
      if (parsed) {
        const { timestamp, action, taskId, priority, ijack, suspended, longSuspended } = parsed;

        if (action === "Executing task") {
          taskStatus[taskId] = { priority, status: "Executing", suspended: false };
        } else if (action === "Task completed") {
          taskStatus[taskId] = { priority, status: "Completed", suspended: false };
        } else if (action === "Long Task suspended") {
          taskStatus[taskId] = { priority, status: "Long Task Suspended", suspended: true, longSuspended:true };
        } else if (action === "Task suspended") {
          taskStatus[taskId] = { priority, status: "Suspended", suspended: true };
        } else if (action === "Preempting task") {
          taskStatus[taskId] = { priority, status: "Preempted", suspended: true };
        }

        // Generate the chart data based on the updated taskStatus
        chartData.push({
          time: timestamp.split(' ')[1],
          priority: priorityMap[priority] || 0,
          action,
          taskId,
          ijack,
          suspended,
          longSuspended
        });
      }
    });

    // Mark all tasks completed at the end if no active tasks left
    if (Object.values(taskStatus).every(status => status.status === "Completed")) {
      const lastTimestamp = chartData.length > 0 ? chartData[chartData.length - 1].time : new Date().toLocaleTimeString();
      chartData.push({
        time: lastTimestamp,
        priority: priorityMap['Non'],
        action: 'All tasks completed',
        taskId: 'N/A',
        ijack: false,
        suspended: false,
      });
    }

    return chartData;
  };

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed.');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendTask = (task) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(task));
    } else {
      console.error('WebSocket is not open.');
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Schedule-Wizard</h1>
        <h2>Welcome, you may enter a new task for running</h2>
      </header>
      <div className="dashboard-container">
        <InputDashboard sendTask={sendTask} />
        <OutputDashboard messages={messages} />
      </div>

      <div className="chart-container">
        <h2>Task Flow</h2>
        <TaskGraph data={generateChartData()} />
      </div>
    </div>
  );
}

export default App;
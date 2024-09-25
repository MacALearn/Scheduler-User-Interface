// import React, { useState, useEffect, useRef } from 'react';
// import InputDashboard from './InputDashboard';
// import OutputDashboard from './OutputDashboard';
// import './App.css';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Setup WebSocket connection here
//     socketRef.current = new WebSocket('ws://localhost:8080');

//     socketRef.current.onmessage = (event) => {
//       setMessages((prevMessages) => [...prevMessages, event.data]);
//     };

//     socketRef.current.onclose = () => {
//       console.log('WebSocket closed.');
//     };

//     socketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     return () => {
//       socketRef.current.close();
//     };
//   }, []);

//   const sendTask = (task) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(task));
//     } else {
//       console.error('WebSocket is not open.');
//     }
//   };

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Schedule-Wizard</h1>
//         <h2>Welcome, you may enter a new task for running</h2>
//       </header>
//       <div className="dashboard-container">
//         <InputDashboard sendTask={sendTask} />
//         <OutputDashboard messages={messages} />
//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import InputDashboard from './InputDashboard';
// import OutputDashboard from './OutputDashboard';
// import './App.css';

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const socketRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   const connectWebSocket = useCallback(() => {
//     socketRef.current = new WebSocket('ws://localhost:8080');

//     socketRef.current.onopen = () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//       setMessages(prevMessages => [...prevMessages, 'Connected to server']);
//     };

//     socketRef.current.onmessage = (event) => {
//       setMessages((prevMessages) => [...prevMessages, event.data]);
//     };

//     socketRef.current.onclose = () => {
//       console.log('WebSocket closed. Attempting to reconnect...');
//       setIsConnected(false);
//       setMessages(prevMessages => [...prevMessages, 'Disconnected from server. Attempting to reconnect...']);
//       reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
//     };

//     socketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }, []);

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, [connectWebSocket]);

//   const sendTask = (task) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(task));
//     } else {
//       console.error('WebSocket is not open.');
//       setMessages(prevMessages => [...prevMessages, 'Failed to send task: WebSocket is not connected']);
//     }
//   };

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Schedule-Wizard</h1>
//         <h2>Welcome, you may enter a new task for running</h2>
//         <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       </header>
//       <div className="dashboard-container">
//         <InputDashboard sendTask={sendTask} isConnected={isConnected} />
//         <OutputDashboard messages={messages} />
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import InputDashboard from './InputDashboard';
// import OutputDashboard from './OutputDashboard';
// import ClientStatusPanel from './ClientStatusPanel'; // Import the client status panel component
// import './App.css';

// function App() {
//   const [taskMessages, setTaskMessages] = useState([]); // For task-related messages
//   const [statusMessages, setStatusMessages] = useState([]); // For connection status messages
//   const [isConnected, setIsConnected] = useState(false);
//   const [isPanelOpen, setIsPanelOpen] = useState(false); // State to manage the visibility of the client status panel
//   const socketRef = useRef(null);
//   const reconnectTimeoutRef = useRef(null);

//   const connectWebSocket = useCallback(() => {
//     socketRef.current = new WebSocket('ws://localhost:8080');

//     socketRef.current.onopen = () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//       setStatusMessages(prevMessages => [...prevMessages, 'Connected to server']); // Add to client status
//     };

//     socketRef.current.onmessage = (event) => {
//       setTaskMessages((prevMessages) => [...prevMessages, event.data]); // Only task-related messages
//     };

//     socketRef.current.onclose = () => {
//       console.log('WebSocket closed. Attempting to reconnect...');
//       setIsConnected(false);
//       setStatusMessages(prevMessages => [...prevMessages, 'Disconnected from server. Attempting to reconnect...']); // Add to client status
//       reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
//     };

//     socketRef.current.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }, []);

//   useEffect(() => {
//     connectWebSocket();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//     };
//   }, [connectWebSocket]);

//   const sendTask = (task) => {
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(task));
//     } else {
//       console.error('WebSocket is not open.');
//       setStatusMessages(prevMessages => [...prevMessages, 'Failed to send task: WebSocket is not connected']); // Add to client status
//     }
//   };

//   const togglePanel = () => {
//     setIsPanelOpen(prevState => !prevState);
//   };

//   return (
//     <div className="app-container">
//       <header>
//         <h1>Schedule-Wizard</h1>
//         <h2>Welcome, you may enter a new task for running</h2>
//         <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </div>
//       </header>
//       <div className="dashboard-container">
//         <InputDashboard sendTask={sendTask} isConnected={isConnected} />
//         <OutputDashboard messages={taskMessages} /> {/* Only show task-related messages */}
//       </div>
//       {/* Add the ClientStatusPanel here for connection status messages */}
//       <ClientStatusPanel
//         messages={statusMessages}
//         isOpen={isPanelOpen}
//         togglePanel={togglePanel}
//       />
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect, useRef } from 'react';
import InputDashboard from './InputDashboard';
import OutputDashboard from './OutputDashboard';
import TaskGraph from './TaskGraph';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // Task priority mapping to Y-axis values, including "Non"
  const priorityMap = {
    Critical: 4,
    Higher: 3,
    Middle: 2,
    Lower: 1,
    Non: 0,
  };

  // Parse WebSocket message
  const parseMessage = (message) => {
    const regex = /\[(.*?)\] \[info\] (.*?) with ID: (\d+)(?:, with priority: (\w+))?/;
    const match = message.match(regex);

    if (match) {
      const timestamp = match[1]; // Extract the timestamp
      const action = match[2]; // Action like "Executing Task", "Task completed", "suspended"
      const taskId = match[3]; // Task ID
      const priority = match[4] || 'Non'; // Priority level if available

      let ijack = false;
      if (action.includes("suspended")) {
        ijack = true; // Mark the task as suspended (ijacking detected)
      }

      return { timestamp, action, taskId, priority, ijack };
    }

    return null;
  };

  // Generate data for the chart
  const generateChartData = () => {
    const chartData = [];
    let currentTaskPriority = 'Non'; // Start with no task running (Non)
    let allTasksCompleted = true; // Flag to check if all tasks are completed
  
    messages.forEach((msg) => {
      const parsed = parseMessage(msg);
      if (parsed) {
        const { timestamp, action, taskId, priority, ijack } = parsed;
  
        // Handle task execution
        if (priority) {
          if (action.includes('Executing Task')) {
            currentTaskPriority = priority; // Update running task priority
            allTasksCompleted = false; // Mark that tasks are still running
          }
          if (action.includes('completed')) {
            // Check if there are any other executing tasks
            const activeTasks = messages.filter(m => m.includes('Executing Task')).length;
            if (activeTasks === 1) {
              currentTaskPriority = 'Non'; // Set to Non if no tasks are left running
              allTasksCompleted = true; // All tasks are completed
            }
          }
        }
  
        // Push the current task status to chart data
        chartData.push({
          time: timestamp.split(' ')[1], // Only take the time part
          priority: priorityMap[currentTaskPriority] || 0,
          action: action,
          taskId,
          ijack, // Include suspension status for visual feedback
        });
      }
    });
  
    // If all tasks are completed, ensure the last entry is set to "Non"
    if (allTasksCompleted) {
      const lastTimestamp = chartData.length > 0 ? chartData[chartData.length - 1].time : new Date().toLocaleTimeString();
      chartData.push({
        time: lastTimestamp,
        priority: priorityMap['Non'], // Set to Non
        action: 'All tasks completed',
        taskId: 'N/A',
        ijack: false,
      });
    }
  
    return chartData;
  };
  
  const chartData = generateChartData();

  // Setup WebSocket connection on component mount
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

      {/* Chart for Task Flow */}
      <div className="chart-container">
        <h2>Task Flow</h2>
        <TaskGraph data={chartData} />
      </div>
    </div>
  );
}

export default App;

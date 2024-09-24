import React, { useState, useEffect, useRef } from 'react';
import InputDashboard from './InputDashboard';
import OutputDashboard from './OutputDashboard';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Setup WebSocket connection here
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
    </div>
  );
}

export default App;
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

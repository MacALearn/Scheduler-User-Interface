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

import React from 'react';
import './OutputDashboard.css'; // Move styles for statuses into a separate file

const OutputDashboard = ({ messages = [] }) => {
  const parseTask = (msg) => {
    console.log('Received message:', msg); // Inspect the raw message
    try {
      return JSON.parse(msg); // Assuming task is received as a JSON string
    } catch (e) {
      console.error('Invalid message format', e);
      return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Terminate':
        return 'status-terminate';
      case 'Suspended':
        return 'status-suspended';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div className="output-dashboard">

      <h2>Output Dashboard</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map((msg, index) => {
            const task = parseTask(msg);
            console.log('Parsed task:', task); // Inspect the parsed task object
            if (!task) return null; // Skip invalid messages

            return (
              <li key={index} className={getStatusClass(task.status)}>
                <strong>ID:</strong> {task.taskId}, <strong>Priority:</strong> {task.priority},
                <strong>Status:</strong> {task.status}, <strong>Running Time:</strong> {task.runningTime}
              </li>
            );
          })}

        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default OutputDashboard;

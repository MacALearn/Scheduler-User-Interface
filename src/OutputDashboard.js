import React from 'react';
import './OutputDashboard.css'; // Assuming the CSS styles are in this file

const OutputDashboard = ({ messages = [] }) => {

  const getMessageClass = (message) => {
    if (message.includes('Executing')) {
      return 'task-executing';
    } else if (message.includes('completed')) {
      return 'task-completed';
    } else if (message.includes('suspended')) {
      return 'task-suspended';
    }
    return ''; // Default for other messages
  };

  return (
    <div className="output-dashboard">
      <h2>Output Dashboard</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className={getMessageClass(msg)}>
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default OutputDashboard;

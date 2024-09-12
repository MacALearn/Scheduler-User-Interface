import React from 'react';

const OutputDashboard = ({ messages = [] }) => {
  return (
    <div className="output-dashboard">
      <h2>Output Dashboard</h2>
      {messages.length > 0 ? (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
  );
};

export default OutputDashboard;

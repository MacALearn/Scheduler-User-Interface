import React from 'react';
import './ClientStatusPanel.css'; // Custom styles for the side panel

function ClientStatusPanel({ messages, isOpen, togglePanel }) {
  return (
    <div className={`client-status-panel ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={togglePanel}>
        {isOpen ? 'Close Client Status' : 'Open Client Status'}
      </button>
      {isOpen && (
        <div className="messages-container">
          {messages.map((msg, index) => (
            <p key={index} className="status-message">{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientStatusPanel;

import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import './OutputDashboard.css';

const OutputDashboard = ({ messages: initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [deletedTaskIds, setDeletedTaskIds] = useState(new Set());
  const [displayedWarnings, setDisplayedWarnings] = useState(new Set());
  const isMessageRelatedToTask = useCallback((msg, taskId) => {
    return (
      msg.includes(`Task with ID: ${taskId}`) ||
      msg.includes(`task with ID: ${taskId}`) ||
      msg.includes(`Executing task with ID: ${taskId}`)
    );
  }, []);
  

  useEffect(() => {
    const filteredMessages = initialMessages.filter(msg => {
      for (let taskId of deletedTaskIds) {
        if (isMessageRelatedToTask(msg, taskId)) {
          return false;
        }
      }
      return true;
    });
    setMessages(filteredMessages);
  }, [initialMessages, deletedTaskIds, isMessageRelatedToTask]);

  const removeTaskMessages = useCallback((taskId) => {
    setDeletedTaskIds(prevDeletedTaskIds => new Set(prevDeletedTaskIds).add(taskId));
  }, []);

  useEffect(() => {
    const completedTasks = messages.filter(msg =>
      msg.includes('[info]') && msg.includes('completed')
    );

    completedTasks.forEach(completedMsg => {
      const match = completedMsg.match(/Task with ID: (\d+)/);
      if (match) {
        const taskId = match[1];
        setTimeout(() => {
          removeTaskMessages(taskId);
        }, 3000);
      }
    });
  }, [messages, removeTaskMessages]);

  // Show SweetAlert for warnings
  useEffect(() => {
    const warnings = messages.filter(msg => msg.includes('[warning]'));
    const uniqueWarnings = [...new Set(warnings)]; // Remove duplicate warnings

    uniqueWarnings.forEach(warning => {
      if (!displayedWarnings.has(warning)) {
        Swal.fire({
          title: '⚠️ Warning!',
          text: warning,
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            title: 'swal2-title',
            popup: 'swal2-popup',
            icon: 'swal2-icon',
          },
          backdrop: true,
          timer: 5000, // Auto close after 5 seconds
        });

        // After showing the alert, add it to the displayedWarnings
        setDisplayedWarnings(prev => {
          const newSet = new Set(prev);
          newSet.add(warning);
          return newSet;
        });
      }
    });
  }, [messages, displayedWarnings]);

  const infoMessages = messages.filter(msg => msg.includes('[info]'));

  const getMessageClass = (message) => {
    if (message.includes('Executing Task') && message.includes('priority')) {
      return 'task-executing';
    } else if (message.includes('completed') && message.includes('priority')) {
      return 'task-completed';
    } else if (message.includes('suspended')  && message.includes('priority')) {
      return 'task-suspended';
    }
    return '';
  };
  

  return (
    <div className="output-dashboard">
      <h2>Output Dashboard</h2>
      {infoMessages.length > 0 ? (
        <ul>
          {infoMessages.map((msg, index) => (
            <li key={index} className={getMessageClass(msg)}>
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <p>No INFO messages yet.</p>
      )}
    </div>
  );
};

export default OutputDashboard;

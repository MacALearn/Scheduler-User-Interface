import React from 'react';
import './TimelineDashboard.css'; // Import CSS for styling

const TimelineDashboard = ({ tasks = [] }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ENTERED':
        return 'status-entered';
      case 'RUNNING':
        return 'status-running';
      case 'SUSPENDED':
        return 'status-suspended';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div className="timeline-dashboard">
      <h2>Task Timeline</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="task-timeline-item">
              <div className={`task-status ${getStatusStyle('ENTERED')}`}>
                Entered
              </div>
              <div className={`task-status ${getStatusStyle(task.status)}`}>
                {task.status}
              </div>
              <div className={`task-status ${getStatusStyle('COMPLETED')}`}>
                Completed
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available for timeline.</p>
      )}
    </div>
  );
};

export default TimelineDashboard;

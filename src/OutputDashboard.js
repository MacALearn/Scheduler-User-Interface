// import React from 'react';
// import './OutputDashboard.css'; // Assuming the CSS styles are in this file

// const OutputDashboard = ({ messages = [] }) => {

//   const getMessageClass = (message) => {
//     if (message.includes('Executing')) {
//       return 'task-executing';
//     } else if (message.includes('completed')) {
//       return 'task-completed';
//     } else if (message.includes('suspended')) {
//       return 'task-suspended';
//     }
//     return ''; // Default for other messages
//   };

//   return (
//     <div className="output-dashboard">

//       <h2>Output Dashboard</h2>
//       {messages.length > 0 ? (
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index} className={getMessageClass(msg)}>
//               {msg}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No messages yet.</p>
//       )}
//     </div>
//   );
// };

// export default OutputDashboard;
// // import React, { useState, useEffect } from 'react';
// // import './OutputDashboard.css';

// // const OutputDashboard = ({ messages: initialMessages = [] }) => {
// //   const [messages, setMessages] = useState(initialMessages);

// //   useEffect(() => {
// //     setMessages(initialMessages);
// //   }, [initialMessages]);

// //   useEffect(() => {
// //     const completedTasks = messages.filter(msg => 
// //       msg.includes('[info]') && msg.includes('completed')
// //     );
    
// //     completedTasks.forEach(completedMsg => {
// //       const match = completedMsg.match(/Task with ID: (\d+) completed/);
// //       if (match) {
// //         const taskId = match[1];
        
// //         setTimeout(() => {
// //           setMessages(prevMessages => 
// //             prevMessages.filter(msg => {
// //               // Keep messages not related to this task
// //               return !(
// //                 msg.includes(`Task with ID: ${taskId}`) ||
// //                 msg.includes(`Executing task with ID: ${taskId}`) ||
// //                 (msg.includes('Task with priority') && msg.includes(`ID: ${taskId}`))
// //               );
// //             })
// //           );
// //         }, 3000); // 3 seconds delay
// //       }
// //     });
// //   }, [messages]);

// //   const getMessageClass = (message) => {
// //     if (message.includes('Executing')) {
// //       return 'task-executing';
// //     } else if (message.includes('completed')) {
// //       return 'task-completed';
// //     } else if (message.includes('suspended')) {
// //       return 'task-suspended';
// //     }
// //     return '';
// //   };

// //   return (
// //     <div className="output-dashboard">
// //       <h2>Output Dashboard</h2>
// //       {messages.length > 0 ? (
// //         <ul>
// //           {messages.map((msg, index) => (
// //             <li key={index} className={getMessageClass(msg)}>
// //               {msg}
// //             </li>
// //           ))}
// //         </ul>
// //       ) : (
// //         <p>No messages yet.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default OutputDashboard;

// import React, { useState, useEffect, useCallback } from 'react';
// import './OutputDashboard.css';

// const OutputDashboard = ({ messages: initialMessages = [] }) => {
//   const [messages, setMessages] = useState(initialMessages);
//   const [deletedTaskIds, setDeletedTaskIds] = useState(new Set());

//   const isMessageRelatedToTask = useCallback((msg, taskId) => {
//     return (
//       msg.includes(`Task with ID: ${taskId}`) ||
//       msg.includes(`Executing task with ID: ${taskId}`) 
//       // ||
//       // (msg.includes('Task with ID:') && msg.includes(`ID: ${taskId}`))
//     );
//   }, []);

//   useEffect(() => {
//     // Filter out messages for tasks that have been marked as deleted
//     const filteredMessages = initialMessages.filter(msg => {
//       for (let taskId of deletedTaskIds) {
//         if (isMessageRelatedToTask(msg, taskId)) {
//           return false;
//         }
//       }
//       return true;
//     });
//     setMessages(filteredMessages);
//   }, [initialMessages, deletedTaskIds, isMessageRelatedToTask]);

//   const removeTaskMessages = useCallback((taskId) => {
//     setDeletedTaskIds(prevDeletedTaskIds => new Set(prevDeletedTaskIds).add(taskId));
//   }, []);

//   useEffect(() => {
//     const completedTasks = messages.filter(msg => 
//       msg.includes('[info]') && msg.includes('completed')
//     );
    
//     completedTasks.forEach(completedMsg => {
//       const match = completedMsg.match(/Task with ID: (\d+) completed/);
//       if (match) {
//         const taskId = match[1];
        
//         setTimeout(() => {
//           removeTaskMessages(taskId);
//         }, 3000); // 3 seconds delay
//       }
//     });
//   }, [messages, removeTaskMessages]);

//   const getMessageClass = (message) => {
//     if (message.includes('Executing')) {
//       return 'task-executing';
//     } else if (message.includes('completed')) {
//       return 'task-completed';
//     } else if (message.includes('suspended')) {
//       return 'task-suspended';
//     }
//     return '';
//   };

//   return (
//     <div className="output-dashboard">
//       <h2>Output Dashboard</h2>
//       {messages.length > 0 ? (
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index} className={getMessageClass(msg)}>
//               {msg}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No messages yet.</p>
//       )}
//     </div>
//   );
// };

// export default OutputDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import './OutputDashboard.css';

const OutputDashboard = ({ messages: initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [deletedTaskIds, setDeletedTaskIds] = useState(new Set());

  const isMessageRelatedToTask = useCallback((msg, taskId) => {
    return (
      msg.includes(`Task with ID: ${taskId}`) ||
      msg.includes(`Executing task with ID: ${taskId}`)
    );
  }, []);

  // Handle message updates based on task completion and deletion
  useEffect(() => {
    const filteredMessages = initialMessages.filter(msg => {
      // Exclude messages related to deleted task IDs
      for (let taskId of deletedTaskIds) {
        if (isMessageRelatedToTask(msg, taskId)) {
          return false;
        }
      }
      return true;
    });
    setMessages(filteredMessages);
  }, [initialMessages, deletedTaskIds, isMessageRelatedToTask]);

  // Function to remove messages related to a completed task
  const removeTaskMessages = useCallback((taskId) => {
    setDeletedTaskIds(prevDeletedTaskIds => new Set(prevDeletedTaskIds).add(taskId));
  }, []);

  // Detect completed tasks and schedule their removal
  useEffect(() => {
    const completedTasks = messages.filter(msg =>
      msg.includes('[info]') && msg.includes('completed')
    );

    completedTasks.forEach(completedMsg => {
      const match = completedMsg.match(/Task with ID: (\d+) completed/);
      if (match) {
        const taskId = match[1];
        // Delay the removal of task messages by 3 seconds
        setTimeout(() => {
          removeTaskMessages(taskId);
        }, 3000); // 3-second delay before deletion
      }
    });
  }, [messages, removeTaskMessages]);

  // Assign classes based on the message type (executing, completed, suspended)
  const getMessageClass = (message) => {
    if (message.includes('Executing')) {
      return 'task-executing';
    } else if (message.includes('completed')) {
      return 'task-completed';
    } else if (message.includes('suspended')) {
      return 'task-suspended';
    }
    return '';
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

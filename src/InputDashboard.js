import React, { useState } from 'react';

const InputDashboard = ({ sendTask }) => {
  const [taskType, setTaskType] = useState('basic');
  const [priority, setPriority] = useState('Critical');
  const [runningTime, setRunningTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [iterationsRemaining, setIterationsRemaining] = useState('');  
  const [executionInterval, setExecutionInterval] = useState('');      

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that the values are positive
    if (parseInt(runningTime) < 0 || (taskType === 'deadline' && parseInt(deadline) < 0) ||
        (taskType === 'iterative' && (parseInt(iterationsRemaining) < 0 || parseInt(executionInterval) < 0))) {
      alert("Please enter positive values for all fields.");
      return;
    }

    let task = {
      type: taskType,
      priority,
      runningTime: parseInt(runningTime),
    };

    if (taskType === 'deadline') {
      task.deadline = parseInt(deadline);
    } else if (taskType === 'iterative') {
      task.iterationsRemaining = parseInt(iterationsRemaining);  
      task.executionInterval = parseInt(executionInterval);      
    }else if(taskType === 'ordered'){
      task.isOrdered = true;
    }

    sendTask(task);
    clearForm();
  };

  const clearForm = () => {
    setRunningTime('');
    setDeadline('');
    setIterationsRemaining('');  
    setExecutionInterval('');    
  };

  return (
    <div className="input-dashboard">
      <h2>Input Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Type:
          <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
            <option value="basic">Basic Task</option>
            <option value="deadline">Deadline Task</option>
            <option value="iterative">Iterative Task</option>
            <option value="ordered">ordered Task</option>
          </select>
        </label>
        
        <label>
          Priority:
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Critical">CRITICAL</option>
            <option value="Higher">HIGHER</option>
            <option value="Middle">MIDDLE</option>
            <option value="Lower">LOWER</option>
          </select>
        </label>

        <label>
          Running Time:
          <input 
            type="number" 
            min="0" 
            value={runningTime} 
            onChange={(e) => setRunningTime(e.target.value)} 
            required 
          />
        </label>

        {taskType === 'deadline' && (
          <label>
            Deadline:
            <input 
              type="number" 
              min="0" 
              value={deadline} 
              onChange={(e) => setDeadline(e.target.value)} 
              required 
            />
          </label>
        )}

        {taskType === 'iterative' && (
          <>
            <label>
              Iterations Remaining:  
              <input 
                type="number" 
                min="0" 
                value={iterationsRemaining}  
                onChange={(e) => setIterationsRemaining(e.target.value)}  
                required 
              />
            </label>
            <label>
              Execution Interval:  
              <input 
                type="number" 
                min="0" 
                value={executionInterval}  
                onChange={(e) => setExecutionInterval(e.target.value)}  
                required 
              />
            </label>
          </>
        )}

        <button type="submit">Send Task</button>
      </form>
    </div>
  );
};

export default InputDashboard;

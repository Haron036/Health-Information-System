import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css'   
import './styles.css'; // Or a specific CSS for this form
import { showSuccessToast, showErrorToast } from '../utils/toast';

function CreateProgramForm() {
    const [programName, setProgramName] = useState('');
    const [message, setMessage] = useState('')
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!programName.trim()) {
          showErrorToast('Program name cannot be empty.');
          return;
        }
        
        try {
          const response = await fetch('https://backend-rqk9.onrender.com/api/programs', { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: programName }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            showSuccessToast('Health program created successfully!');
            setMessage('');
            setProgramName('');
          } else {
            showErrorToast(data.error || 'Failed to create program');
          }
        } catch (error) {
          showErrorToast('An error occurred while creating the program');
          console.error('Error creating program:', error);
        }
      };
    return (
        <div className="create-program-form">
            <h2>Create New Health Program</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="programName">Program Name:</label>
                    <input
                        type="text"
                        id="programName"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        required
                        placeholder=""
                    />
                </div>
                <button type="submit">Create Program</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateProgramForm;

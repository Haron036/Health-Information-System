







































































































































import React, { useState } from 'react';
import './styles.css';
import { showSuccessToast, showErrorToast } from '../utils/toast';

function EnrollmentForm({ clients, programs, onClientEnrolled }) {
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedProgramIds, setSelectedProgramIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClientChange = (e) => {
        setSelectedClientId(e.target.value);
    };

    const handleProgramChange = (e) => {
        const programId = e.target.value;
        const isChecked = e.target.checked;

        setSelectedProgramIds(prev => 
            isChecked 
                ? [...prev, programId] 
                : prev.filter(id => id !== programId))
    };
    const handleEnrollClient = async (event) => {
        event.preventDefault();
      
        if (!selectedClientId) {
          showErrorToast('Please select a client.');
          return;
        }
        if (selectedProgramIds.length === 0) {
          showErrorToast('Please select at least one program.');
          return;
        }
      
        try {
          const response = await fetch('https://backend-rqk9.onrender.com/api/enrollments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clientId: selectedClientId,
              programIds: selectedProgramIds,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            showSuccessToast('Client enrolled successfully!');
            setSelectedClientId('');
            setSelectedProgramIds([]);
          } else {
            showErrorToast(data.error || 'Failed to enroll client');
          }
        } catch (error) {
          showErrorToast('Error enrolling client');
          console.error('Error enrolling client:', error);
        }
      };
    return (
        <div className="enrollment-form">
            <h2>Enroll Client in Programs</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleEnrollClient}>
                <div className="form-group">
                    <label>Select Client:</label>
                    <select 
                        value={selectedClientId} 
                        onChange={handleClientChange}
                        disabled={loading}
                    >
                        <option value="">-- Select Client --</option>
                        {clients.map(client => (
                            <option key={client._id} value={client._id}>
                                {client.firstName} {client.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Select Program(s):</label>
                    <div className="programs-list">
                        {programs.map(program => (
                            <div key={program._id} className="program-option">
                                <input
                                    type="checkbox"
                                    id={`program-${program._id}`}
                                    value={program._id}
                                    checked={selectedProgramIds.includes(program._id)}
                                    onChange={handleProgramChange}
                                    disabled={loading}
                                />
                                <label htmlFor={`program-${program._id}`}>
                                    {program.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Enrolling...' : 'Enroll Client'}
                </button>
            </form>
        </div>
    );
}

export default EnrollmentForm;


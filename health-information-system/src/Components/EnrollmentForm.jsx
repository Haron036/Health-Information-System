// import React, { useState, useEffect } from 'react';
// import './styles.css'; // You might have a separate CSS file

// function EnrollmentForm({ onClientEnrolled }) {
//     const [clients, setClients] = useState([]);
//     const [programs, setPrograms] = useState([]);
//     const [selectedClientId, setSelectedClientId] = useState('');
//     const [selectedProgramIds, setSelectedProgramIds] = useState([]);
//     const { showSuccessToast, showErrorToast } = useToast(); // Use the custom hook
//       const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchClientsAndPrograms = async () => {
//              setLoading(true);
//       setError(null);
//             try {
//                 // Fetch clients
//                 const clientsResponse = await fetch('http://localhost:4000/api/clients');
//                  if (!clientsResponse.ok) {
//             throw new Error(`Failed to fetch clients: ${clientsResponse.status}`);
//         }
//                 const clientsData = await clientsResponse.json();
//                 setClients(clientsData);

//                 // Fetch programs
//                 const programsResponse = await fetch('http://localhost:4000/api/programs');
//                  if (!programsResponse.ok) {
//           throw new Error(`Failed to fetch programs: ${programsResponse.status}`);
//         }
//                 const programsData = await programsResponse.json();
//                 setPrograms(programsData);
//             } catch (error) {
//                  setError(error.message);
//           showErrorToast(`Error loading data: ${error.message}`);
//             } finally {
//                   setLoading(false);
//             }
//         };

//         fetchClientsAndPrograms();
//     }, []);

//     const handleClientChange = (e) => {
//         setSelectedClientId(e.target.value);
//     };

//     const handleProgramChange = (e) => {
//         const programId = e.target.value;
//         const isChecked = e.target.checked;

//         if (isChecked) {
//             setSelectedProgramIds([...selectedProgramIds, programId]);
//         } else {
//             setSelectedProgramIds(selectedProgramIds.filter(id => id !== programId));
//         }
//     };

//   const handleEnrollClient = async (event) => {
//     event.preventDefault();

//     if (!selectedClientId) {
//       showErrorToast('Please select a client.');
//       return;
//     }
//     if (selectedProgramIds.length === 0) {
//       showErrorToast('Please select at least one program.');
//       return;
//     }
//     if (response.ok) {
//       const enrolledData = await response.json();
//       showSuccessToast('Client enrolled successfully!');
//       setSelectedClientId('');
//       setSelectedProgramIds([]);
//       onClientEnrolled(enrolledData); // <-- Call App.jsx function
//     }
  

//     try {
//       const response = await fetch('http://localhost:4000/api/enrollments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           clientId: selectedClientId,
//           programIds: selectedProgramIds,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         showSuccessToast('Client enrolled successfully!');
//         setSelectedClientId('');
//         setSelectedProgramIds([]);
//       } else {
//         showErrorToast(`Failed to enroll client: ${data.error || 'Unknown error'}`);
//       }
//     } catch (error) {
//       showErrorToast(`Error enrolling client: ${error.message}`);
//       console.error('Error enrolling client:', error);
//     }
//   };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//       if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <form className="enrollment-form" onSubmit={handleEnrollClient}>
//             <h2>Enroll Client in Programs</h2>

//             <div className="form-group">
//                 <label htmlFor="client">Select Client:</label>
//                 <select id="client" value={selectedClientId} onChange={handleClientChange}>
//                     <option value="">-- Select a Client --</option>
//                     {clients.map((client) => (
//                         <option key={client._id} value={client._id}>
//                             {client.firstName} {client.lastName}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div className="form-group">
//                 <label>Select Program(s):</label>
//                 <div>
//                     {programs.map((program) => (
//                         <div key={program._id}>
//                             <input
//                                 type="checkbox"
//                                 id={`program-${program._id}`}
//                                 name="programs"
//                                 value={program._id}
//                                 checked={selectedProgramIds.includes(program._id)}
//                                 onChange={handleProgramChange}
//                             />
//                             <label htmlFor={`program-${program._id}`}>{program.name}</label>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <button type="submit" >Enroll Client</button>
//         </form>
//     );
// }

// export default EnrollmentForm;


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


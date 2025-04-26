import React, { useState, useEffect } from 'react';
import RegistrationForm from './Components/RegistrationForm'; 
import './App.css';
import CreateProgramForm from './Components/CreateProgramForm'; 
import EnrollmentForm from './Components/EnrollmentForm'; 
import ClientSearch from './Components/ClientSearch';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from "./utils/toast";



function App() {
    const [healthPrograms, setHealthPrograms] = useState([]);
    const [registeredClients, setRegisteredClients] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [selectedClientProfile, setSelectedClientProfile] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load data from localStorage on initial render (if needed)
    useEffect(() => {
        const savedPrograms = localStorage.getItem('healthPrograms');
        const savedClients = localStorage.getItem('registeredClients');
        const savedEnrollments = localStorage.getItem('enrollments');

        if (savedPrograms) {
            setHealthPrograms(JSON.parse(savedPrograms));
        }
        if (savedClients) {
            setRegisteredClients(JSON.parse(savedClients));
        }
        if (savedEnrollments) {
            setEnrollments(JSON.parse(savedEnrollments));
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('healthPrograms', JSON.stringify(healthPrograms));
        localStorage.setItem('registeredClients', JSON.stringify(registeredClients));
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
    }, [healthPrograms, registeredClients, enrollments]);

    const handleProgramCreated = async (newProgramName) => { // Make handleProgramCreated async
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/programs', { //send to backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProgramName }), // Send the program name
            });
            if (!response.ok) {
                throw new Error('Failed to create program');
            }
            const data = await response.json();
            setHealthPrograms([...healthPrograms, data.programName]); // backend returns programName
            showSuccessToast('Program created successfully!'); 
        } catch (error) {
            setError(error.message);
            showErrorToast('Failed to create program!');  
            console.error(error)
        } finally {
            setLoading(false);
        }

    };

    const handleClientRegistered = async (clientData) => { // Make handleClientRegistered async
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/clients', {  //send to backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            });
            const data = await response.json(); // Assuming server returns the created client
            console.log('Backend response:', data);
            setRegisteredClients([...registeredClients, data]); // Add the new client
            showSuccessToast(`${data.firstName} ${data.lastName} registered!`); 
        } catch (error) {
            setError(error.message);
             showErrorToast('Failed to register client');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleClientEnrolled = async (clientId, programIds) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, programIds })
            });
    
            if (!response.ok) throw new Error('Enrollment failed');
            
            const newEnrollment = await response.json();
            
            // Update state to include new enrollment
            setEnrollments(prev => [...prev, newEnrollment]);
            
            // Force refresh of client data
            if (selectedClientProfile?._id === clientId) {
                const clientRes = await fetch(`http://localhost:4000/api/clients/${clientId}`);
                const clientData = await clientRes.json();
                setSelectedClientProfile(clientData.client);
            }
        } catch (error) {
            console.error("Enrollment error:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleClientSelect = (client) => {
        setSelectedClientProfile(client);
    };
    // Add function to fetch enrollments
const fetchEnrollments = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/enrollments');
        const data = await response.json();
        setEnrollments(data); // Replace local enrollments
    } catch (error) {
        console.error('Failed to fetch enrollments', error);
    }
};


    const clientEnrollments = selectedClientProfile
        ? enrollments.filter(enrollment => enrollment.clientId === `${selectedClientProfile.firstName} $
{selectedClientProfile.lastName}`)
        : [];

    const enrolledPrograms = clientEnrollments.length > 0 ? clientEnrollments[0].programs : [];
    


    return (
        <div className="App">
           <ToastContainer />
            <h1>Health Information System</h1>

            <CreateProgramForm onProgramCreated={handleProgramCreated} />


            <h2>Client Registration</h2>
            <RegistrationForm onClientRegistered={handleClientRegistered} />


            <h2>Enroll Client in Program(s)</h2>
            {registeredClients.length > 0 && healthPrograms.length > 0 ? (
                <EnrollmentForm
                    clients={registeredClients}
                    programs={healthPrograms}
                    onClientEnrolled={handleClientEnrolled}
                />
            ) : (
                <p>Please register clients and create programs to enable enrollment.</p>
            )}

            <h2>Search for Client</h2>
            <ClientSearch clients={registeredClients} onClientSelect={handleClientSelect} />
            {selectedClientProfile && (
                <div className="client-profile">
                    <h2>Client Profile</h2>
                    <p><strong>Name:</strong> {selectedClientProfile.firstName} {selectedClientProfile.lastName}</p>
                    {enrolledPrograms.length > 0 ? (
                        <div>
                            <h3>Enrolled Programs:</h3>
                            <ul>
                                {enrolledPrograms.map((program, index) => (
                                    <li key={index}>{program}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No programs enrolled for this client.</p>
                    )}
                </div>
            )}



            {/* Other components and content */}
        </div>
    );
}

export default App;



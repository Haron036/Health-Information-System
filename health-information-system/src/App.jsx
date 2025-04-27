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

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const programsResponse = await fetch('http://localhost:4000/api/programs');
                if (programsResponse.ok) {
                    const programsData = await programsResponse.json();
                    setHealthPrograms(programsData);
                } else {
                    showErrorToast('Failed to load programs.');
                }

                const clientsResponse = await fetch('http://localhost:4000/api/clients');
                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    setRegisteredClients(clientsData);
                } else {
                    showErrorToast('Failed to load clients.');
                }

                await fetchEnrollments(); // Fetch enrollments on initial load

            } catch (error) {
                console.error('Error loading initial data:', error);
                showErrorToast('Failed to load initial data.');
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/enrollments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setEnrollments(data);
        } catch (error) {
            console.error('Failed to fetch enrollments', error);
            showErrorToast('Failed to fetch enrollments.');
            setError(error.message);
        }
    };

    const handleProgramCreated = async (newProgramName) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/programs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProgramName }),
            });
            if (!response.ok) {
                throw new Error('Failed to create program');
            }
            const data = await response.json();
            setHealthPrograms([...healthPrograms, data]); // Backend now returns the full program object
            showSuccessToast('Program created successfully!');
        } catch (error) {
            setError(error.message);
            showErrorToast('Failed to create program!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClientRegistered = async (clientData) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clientData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register client');
            }
            const data = await response.json();
            setRegisteredClients([...registeredClients, data]);
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Enrollment failed');
            }

            await response.json(); // Enrollment successful, no need to update local enrollments immediately
            showSuccessToast('Client enrolled in program(s) successfully!');
            await fetchEnrollments(); // Refetch enrollments to update the global state
            // Optionally refetch client profile to show updated enrollments immediately
            if (selectedClientProfile?._id === clientId) {
                const clientRes = await fetch(`http://localhost:4000/api/clients/${clientId}`);
                if (clientRes.ok) {
                    const clientData = await clientRes.json();
                    setSelectedClientProfile(clientData.client);
                }
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            showErrorToast('Failed to enroll client');
        } finally {
            setLoading(false);
        }
    };

    const handleClientSelect = async (client) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/clients/${client._id}`);
            if (!response.ok) {
                showErrorToast('Failed to load client profile.');
                return;
            }
            const data = await response.json();
            setSelectedClientProfile(data.client); // Backend now returns { client, enrolledPrograms }
        } catch (error) {
            console.error('Error fetching client profile:', error);
            showErrorToast('Failed to load client profile.');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                    {selectedClientProfile.enrolledPrograms && selectedClientProfile.enrolledPrograms.length > 0 ? (
                        <div>
                            <h3>Enrolled Programs:</h3>
                            <ul>
                                {selectedClientProfile.enrolledPrograms.map((program) => (
                                    <li key={program.id}>{program.name}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No programs enrolled for this client.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
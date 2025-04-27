import React, { useState } from 'react';
import './styles.css';

function ClientSearch({ clients, onClientSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [enrolledPrograms, setEnrolledPrograms] = useState([]);

    const handleSearchChange = (e) => {
        const term = e.target.value; 
        setSearchTerm(term);
        const results = clients.filter(client =>
            `${client.firstName} ${client.lastName}`.includes(term) 
        );
        setSearchResults(results);
    };

    const handleClientSelect = async (client) => {
        setSelectedClient(client);

        try {
            const response = await fetch(`https://backend-rqk9.onrender.com/api/clients/${client._id}`);
            if (!response.ok) throw new Error('Failed to fetch client');

            const data = await response.json();
            setEnrolledPrograms(data.enrolledPrograms || []);

            // Update parent component if needed
            if (onClientSelect) onClientSelect(data.client);
        } catch (error) {
            console.error("Fetch error:", error);
            setEnrolledPrograms([]);
        }
    };

    return (
        <div className="client-search">
            <h2>Search for Client</h2>
            <div className="form-group">
                <label htmlFor="search">Search by Name:</label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter client name"
                />
            </div>

            {searchTerm && searchResults.length > 0 ? (
                <div>
                    <h3>Search Results:</h3>
                    <ul>
                        {searchResults.map((client, index) => (
                            <li key={index}>
                                {client.firstName} {client.lastName}
                                <button onClick={() => handleClientSelect(client)}>Select</button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                searchTerm && <p>No clients found matching "{searchTerm}".</p>
            )}

            {selectedClient && (
                <div className="client-profile">
                    <h3>Client Profile: {selectedClient.firstName} {selectedClient.lastName}</h3>
                    {enrolledPrograms.length > 0 ? (
                        <div>
                            <h4>Enrolled Programs:</h4>
                            <ul>
                                {enrolledPrograms.map((program, index) => (
                                    <li key={index}>{program.name}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>This client is not enrolled in any programs.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ClientSearch;
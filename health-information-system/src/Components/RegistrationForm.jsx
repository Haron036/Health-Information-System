import React, { useState } from 'react';
import './styles.css';
import { showSuccessToast, showErrorToast } from '../utils/toast';


function RegistrationForm({ onClientRegistered }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        address: ''
    });
     const [loading, setLoading] = useState(false); // Add loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Date of Birth being sent:', formData.dateOfBirth);
        
        try {
          const response = await fetch('https://health-information-system-d60z.onrender.com/api/clients', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          if (response.ok) {
            const data = await response.json();
            onClientRegistered(data);
            setFormData({
              firstName: '',
              lastName: '',
              dateOfBirth: '',
              gender: '',
              contactNumber: '',
              address: ''
            });
            showSuccessToast(`${data.firstName} ${data.lastName} registered successfully!`);
          } else {
            const errorData = await response.json();
            showErrorToast(errorData.error || 'Failed to register client');
          }
        } catch (error) {
          showErrorToast('Network error. Please try again.');
          console.error('Error registering client:', error);
        } finally {
          setLoading(false);
        }
      };
    return (
        <div className="registration-form">
            <h2>Register New Client</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <input
                        type="text"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input
                        type="number"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Client'}
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;

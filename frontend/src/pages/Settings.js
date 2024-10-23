import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/settings.css'
import LeftPane from '../components/LeftPane';
import { useAuth } from '../context/AuthContext';

import avatar from '../assets/user.png';

const UpdateUserDetails = ({ user }) => {
    
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userAddresses, setUserAddresses] = useState([]);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const { isAuthenticated } = useAuth();
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactNo: ''
    });
    
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        contactNo: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        profilePicture: null,
        addresses: [],
    });

    useEffect(() => {
        if (user) {
          setFormData({
            fname: user.fname || '',
            lname: user.lname || '',
            contactNo: user.contactNo || '',
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            profilePicture: user.profilePicture || null,
            addresses: user.addresses || [],
          });
          setIsLoading(false);
        } else {
          fetchUserData();
        }
    }, [user]);

      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setIsLoading(false);
            return;
          }
          const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          };
    
          const response = await axios.get('/api/users/me', { headers });
          const userData = response.data;
    
          setFormData({
            fname: userData.fname || '',
            lname: userData.lname || '',
            contactNo: userData.contactNo || '',
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            profilePicture: userData.profilePicture || null,
            addresses: userData.addresses || [],
          });
          setIsLoading(false);
    
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setIsLoading(false);
        }
      };

      const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

      const handleAddNewAddress = async () => {
        if (!isAuthenticated) {
            alert('Please log in to proceed with checkout.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                '/api/users/address',
                shippingDetails,
                {
                    headers: { 'x-auth-token': token }
                }
            );
    
            setUserAddresses(prevAddresses => [...prevAddresses, response.data]);
            setShowNewAddressForm(false);
            setShippingDetails({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                contactNo: ''
            });
        } catch (error) {
            console.error('Error adding new address:', error);
            alert('Failed to add address. Please try again.');
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prevDetails => ({ ...prevDetails, [name]: value }));
      };

      const updateField = async (field, value) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            return;
          }
          const body = { [field]: value };
          const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          };
    
          const response = await axios.put('/api/users/update', body, { headers });
          console.log(`Update successful for ${field}:`, response.data);
          fetchUserData();
        } catch (error) {
          if (error.response) {
            console.error(`Failed to update ${field}:`, error.response.data);
          } else {
            console.error(`Failed to update ${field}:`, error.message);
          }
        }
      };

      const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append('profilePicture', file);
    
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            return;
          }
    
          const headers = {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token,
          };
    
          const response = await axios.put('/api/users/update-profile-picture', formData, { headers });
          console.log('Profile picture updated successfully:', response.data);
          fetchUserData();
        } catch (error) {
          if (error.response) {
            console.error('Failed to update profile picture:', error.response.data);
          } else {
            console.error('Failed to update profile picture:', error.message);
          }
        }
      };

      const deleteAddress = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const headers = {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            };
    
            const response = await axios.delete(`/api/users/address/${addressId}`, { headers });
            console.log('Address deleted successfully:', response.data);
    
            setFormData((prevState) => ({
                ...prevState,
                addresses: prevState.addresses.filter(address => address.id !== addressId) 
            }));
        } catch (error) {
            if (error.response) {
                console.error('Failed to delete address:', error.response.data);
            } else {
                console.error('Failed to delete address:', error.message);
            }
        }
    };

    const isStrongPassword = (password) => {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasNoRepeats = !/(.)\1{2,}/.test(password); 

        return (
            password.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasNoRepeats
        );
    };
    

      const handleChangePassword = async (e) => {
        e.preventDefault();
        
    
        if (formData.newPassword !== formData.confirmNewPassword) {
          setFormData({
            ...formData,
            newPassword: '',
            confirmNewPassword: '',
          });
          alert('Passwords do not match');
          return;
        }
    
        if (formData.newPassword === '' && formData.password === '' && formData.confirmNewPassword === '') {
          setFormData({
            ...formData,
            password:'',
            newPassword: '',
            confirmNewPassword: '',
          });
          alert('Please enter passwords to all the fields');
          return;
        }
    
        if (formData.newPassword === formData.password) {
          setFormData({
            ...formData,
            newPassword: '',
            confirmNewPassword: '',
          });
          alert('The new password is the same as the current password');
          return;
        }

        if (!isStrongPassword(formData.newPassword)) {
          alert('New password does not meet the strength criteria:\n- Minimum 8 characters\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- No repeated characters more than once in a row.');
          return;
        }
    
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            return;
          }
    
          const body = {
            currentPassword: formData.password,
            newPassword: formData.newPassword,
          };
          const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          };
    
          const response = await axios.put('/api/users/update-password', body, { headers });
          console.log('Password update successful:', response.data);
          alert('Password updated successfully');
    
          setFormData({
            ...formData,
            password: '',
            newPassword: '',
            confirmNewPassword: '',
          });
        } catch (error) {
          if (error.response) {
            setFormData({
              ...formData,
              password: '',
            });
            alert('Current Password is incorrect');
        }
      }
    };

    const { fname, lname, contactNo, profilePicture } = formData;

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>; // Render a loading screen
    }

    return (
        <div className='settings-main'>
            <LeftPane/>
            <div className='settings-div'>
            <form className='settings-form' encType="multipart/form-data">
            <div>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                
                <div onClick={() => document.querySelector('input[name="profilePicture"]').click()}>
                    {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="user-profile-img" />
                    ) : (
                    <img src={avatar} alt="Default Avatar" className="user-profile-img" />
                    )}
                </div>
            </div>
            <div>
                <label className='label-291'>First Name: </label>
                {fname ? (
                <>
                    <span>{fname}</span>
                    <button className='edit-btn'  onClick={(e) => {
                        e.preventDefault();
                        const newFname = prompt('Enter new first name:', fname);
                        if (newFname) updateField('fname', newFname);
                    }}>
                        Edit First Name
                    </button>
                </>
                ) : (
                <input
                    type="text"
                    name="fname"
                    value={fname}
                    onChange={onChange}
                    placeholder="Insert new first name"
                />
                )}
            </div>
            <div>
                <label className='label-291'>Last Name: </label>
                {lname ? (
                <>
                    <span>{lname}</span>
                    <button className='edit-btn' onClick={(e) => {
                        e.preventDefault();
                        const newLname = prompt('Enter new last name:', lname);
                        if (newLname) updateField('lname', newLname);
                    }}>
                        Edit Last Name
                    </button>
                </>
                ) : (
                <input
                    type="text"
                    name="lname"
                    value={lname}
                    onChange={onChange}
                    placeholder="Insert new last name"
                />
                )}
            </div>
            <div>
                <label className='label-291'>Contact No. </label>
                {contactNo ? (
                <>
                    <span>{contactNo}</span>
                    <button className='edit-btn' onClick={(e) => {
                        e.preventDefault();
                        const newMobile = prompt('Enter new mobile number:', contactNo);
                        if (newMobile) updateField('contactNo', newMobile);
                    }}>
                        Edit Contact Number
                    </button>
                </>
                ) : (
                <input
                    type="text"
                    name="contactNo"
                    value={contactNo}
                    onChange={onChange}
                    placeholder="Insert new mobile number"
                />
                )}
            </div>
            <div className='pass'>
              <label className="edit-label" onClick={() => setShowPasswordFields(!showPasswordFields)}>
              {showPasswordFields ? 'Cancel' : 'Change Password'}
              </label>
              {showPasswordFields && (
              <form className='pw-form'>
                    <div className='acc-pw-change'>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={onChange}
                          placeholder="Current password"
                          className="pwwinput"
                        />
                    </div>
                    <div className='acc-pw-change'> 
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={onChange}
                          placeholder="New password"
                          className="pwwinput"
                        />
                    </div>
                    <div className='acc-pw-change'> 
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={onChange}
                          placeholder="Confirm new password"
                          className="pwwinput"
                        />
                    </div>
              <button type="submit" className="edit-btn" onClick={handleChangePassword}>Update Password</button>
          </form>
          )}
        </div>
        <div>
            <h3>Addresses</h3>
            {formData.addresses.length > 0 ? (
                formData.addresses.map((address, index) => (
                    <div key={index} className="address-item">
                        <p className='p125'><strong>Name:</strong> {address.name.length > 15 ? address.name.substring(0, 15) + '...' : address.name}</p>
                        <p className='p125'><strong>Address:</strong> {address.address.length > 20 ? address.address.substring(0, 20) + '...' : address.address}</p>
                        <p className='p125'><strong>City:</strong> {address.city}</p>
                        <p className='p125'><strong>State:</strong> {address.state}</p>
                        <p className='p125'><strong>Zip:</strong> {address.zip}</p>
                        <p className='p125'><strong>Contact No:</strong> {address.contactNo}</p>
                        <button className="delete-btn3211" onClick={() => deleteAddress(address._id)}><i className="fas fa-trash"></i></button>
                    </div>
                ))
            ) : (
                <p>No addresses available.</p>
            )}
        </div>
        <div>
        <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className='addressbtn'>
                    {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                </button>

                {showNewAddressForm && (
                    <div className="new-address-form">
                        <input type="text" name="name" placeholder="Name" value={shippingDetails.name} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Address" value={shippingDetails.address} onChange={handleChange} required/>
                        <input type="text" name="city" placeholder="City" value={shippingDetails.city} onChange={handleChange} required/>
                        <input type="text" name="state" placeholder="State" value={shippingDetails.state} onChange={handleChange} required/>
                        <input type="text" name="zip" placeholder="Zip Code" value={shippingDetails.zip} onChange={handleChange} required/>
                        <input type="text" name="contactNo" placeholder="Contact Number" value={shippingDetails.contactNo} onChange={handleChange} required/>
                        <button onClick={handleAddNewAddress} className='addressbtnn'>Save Address</button>
                    </div>
                )}
        </div>
        </form>    
        </div>
        </div>
    );
};

export default UpdateUserDetails;
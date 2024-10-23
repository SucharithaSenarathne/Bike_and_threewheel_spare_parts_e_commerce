import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/usermanagement.css';
import LeftPane from '../components/LeftPane';

import avatar from '../assets/user.png';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdminFilter, setIsAdminFilter] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            alert('Please log in to proceed with checkout.');
            return;
        }
        const token = localStorage.getItem('token');
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users/allusers', {
                    headers: { 'x-auth-token': token }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [isAuthenticated]);

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/users/delete/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            setUsers(users.filter(user => user._id !== userId));
            alert('User deleted successfully');
        } catch (error) {
            alert('Error deleting user');
        }
    };

    // Toggle admin status handler with confirmation
    const handleToggleAdmin = async (userId, isAdmin) => {
        const confirmToggle = window.confirm(
            `Are you sure you want to ${isAdmin ? 'revoke' : 'grant'} admin rights to this user?`
        );
        if (!confirmToggle) return;

        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/users/update-admin-status/${userId}`, {
                isAdmin: !isAdmin
            }, {
                headers: { 'x-auth-token': token }
            });
            setUsers(users.map(user => user._id === userId ? { ...user, isAdmin: !isAdmin } : user));
        } catch (error) {
            alert('Error updating admin status');
        }
    };


    // Search and filter logic
    const filteredUsers = users.filter(user => {
        const fullName = `${user.fname} ${user.lname}`.toLowerCase();
        const email = user.email.toLowerCase();
        const contactNo = user.contactNo.toString().toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        const matchesSearchTerm = fullName.includes(searchLower) || email.includes(searchLower) || contactNo.includes(searchLower);
        return matchesSearchTerm && (!isAdminFilter || user.isAdmin);
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-list-main">
            <LeftPane />
            <div className="user-list-container">
                <div className="search-barr-filter">
                    <div className='search-barr'>
                        <input
                            type="text"
                            placeholder="Search by name, email, or contact number"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <input 
                            type="checkbox" 
                            checked={isAdminFilter}
                            onChange={e => setIsAdminFilter(e.target.checked)}
                        />
                        <label>
                            Show Admins Only
                        </label>
                    </div>
                </div>
                
                <div className="user-list">
                    {filteredUsers.map(user => (
                        <div key={user._id} className="user-card">
                            <div className='imgdivvvv'>
                                <img
                                    src={user.profilePicture ? user.profilePicture : avatar }
                                    alt={`${user.fname} ${user.lname}`}
                                    className="user-profile-image"
                                />
                            </div>
                            <div className="user-details">
                                <div className="aa54124">
                                    <p><strong>Name:</strong> {user.fname} {user.lname}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>
                                <div className="aa54124">
                                    <p><strong>Contact Number:</strong> {user.contactNo}</p>
                                    <p><strong>Date of Birth:</strong> {new Date(user.dateofbirth).toLocaleDateString()}</p>
                                </div>
                                <div className="user-actions1">
                                    <button className='butt41' onClick={() => handleDeleteUser(user._id)}>Delete User</button>
                                    <button className='butt41' onClick={() => handleToggleAdmin(user._id, user.isAdmin)}>
                                        {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserList;
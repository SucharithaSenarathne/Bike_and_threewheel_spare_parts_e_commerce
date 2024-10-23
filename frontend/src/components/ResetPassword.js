import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { id, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const handleVerifyToken = async () => {
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const response = await axios.get(`/api/users/reset-password/${id}/${token}`);
            setMessage(response.data.msg);
            setIsTokenValid(true);  // Token is valid, show the form
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`/api/users/reset-password/${id}`, { newPassword });
            setMessage(response.data.msg);
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password">
            <h2>Reset Your Password</h2>
            {!isTokenValid ? (
                <button onClick={handleVerifyToken} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Token'}
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ResetPassword;

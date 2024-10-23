import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../styles/loginregister.css';

const LoginRegister = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        isAdmin:'',
    });
    const [registerData, setRegisterData] = useState({
        fname: '',
        lname: '',
        address: '',
        contactNo: '',
        dateofbirth: '',
        email: '',
        password: ''
    });

    const onChangeLogin = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const onChangeRegister = (e) => {
        const { name, value } = e.target;

        if (name === "password") {
            isStrongPassword(value);
            setRegisterData({ ...registerData, [name]: value }); // Remove passwordValid from here as we won't store it
        } else if (name === "contactNo") {
            const numericValue = value.replace(/[^0-9]/g, '');
            setRegisterData({ ...registerData, [name]: numericValue });
        } else {
            setRegisterData({ ...registerData, [name]: value });
        }
    };
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/users/login', loginData);
            const { token, isAdmin } = response.data;
            login({ token, isAdmin });
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/items/all');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            if (errorMessage.includes('Credentials')) {
                setError('Credentials Do Not Match');
            } else if (errorMessage.includes('User')) {
                setError('User Unavailable');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
            console.error('Login failed:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!isStrongPassword(registerData.password)) {
            alert("Password must be at least 8 characters long, contain uppercase, lowercase letters, numbers, and have no repeating characters.");
            return;
        }
        try {
            setLoading(true);
            await axios.post('/api/users/register', registerData);
            setRegisterData({
                fname: '',
                lname: '',
                address: '',
                contactNo: '',
                dateofbirth: '',
                email: '',
                password: ''
            });
            setError2('Registration Successful! Signin Now!');
        } catch (err) {
            console.error(err);
            if (err.response?.data?.message === 'User already exists') {
                alert('This email is already registered. Please use a different email.');
            } else {
                alert('This email is already registered. Please use a different email.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (response) => {
        const { credential } = response;
        try {
            setLoading(true);
            const res = await axios.post('/api/users/google-login', { tokenId: credential });
            const { token, isAdmin } = res.data;
            login({ token, isAdmin });
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/items/all');
            }
        } catch (error) {
            console.error('Google login failed:', error);
            setError('Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google login failed:', error);
        setError('Google login failed. Please try again.');
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

    return (
        <div className={`loginregister-container ${!isLogin ? 'right-panel-active' : ''}`}>
            <div className="signin-container">
                <form onSubmit={handleLoginSubmit} className="signin-form">
                    <h1>Login</h1>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={loginData.email}
                        onChange={onChangeLogin}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={loginData.password}
                        onChange={onChangeLogin}
                        minLength="6"
                        required
                    />
                    {error && <div className="error-message">{error}</div>}
                    <button style={{marginBottom:'20px'}} className='bn5' type="submit" disabled={loading}>{loading ? 'Logging In...' : 'Login'}</button>
                    <p >or</p>
                    <GoogleOAuthProvider clientId="545271531209-or16che9bavf57oj7nsd6fa2dbudivgv.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onFailure={handleGoogleFailure}
                            render={(renderProps) => (
                                <button className="google-login-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    Login with Google
                                </button>
                            )}
                        />
                    </GoogleOAuthProvider>
                    <div className='forgotdiv'>
                        <Link to="/request-password-reset">Forgot Password?</Link>
                    </div>
                    <div>
                        <Link to="/items/all">Browse as a guest</Link>
                    </div>
                    
                </form>
            </div>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleRegisterSubmit}>
                    <h1>Create Account</h1>
                    <input
                        type="text"
                        placeholder="First Name"
                        name="fname"
                        value={registerData.fname}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lname"
                        value={registerData.lname}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={registerData.address}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Contact Number"
                        name="contactNo"
                        value={registerData.contactNo}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Date of Birth"
                        name="dateofbirth"
                        value={registerData.dateofbirth}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={registerData.email}
                        onChange={onChangeRegister}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={registerData.password}
                        onChange={onChangeRegister}
                        required
                    />
                    {error2 && <div className="error-message" style={{color:"blue", margin:'0'}}>{error2}</div>}
                    <button className='bn5' type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="bn5 ghost" onClick={() => setIsLogin(true)}>Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start your journey with us</p>
                        <button className="bn5 ghost" onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;

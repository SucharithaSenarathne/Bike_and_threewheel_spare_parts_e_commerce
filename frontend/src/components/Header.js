import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSignal } from '@vaadin/hilla-react-signals';
import { ConfirmDialog } from '@vaadin/react-components/ConfirmDialog.js';
import '../styles/header.css';
import bikerlogo from '../assets/bikerlogo.png';

const Header = () => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const dialogOpened = useSignal(false);
  const status = useSignal('');

  const handleLogout = () => {
    dialogOpened.value = true;
  };

  const handleLogoutConfirmed = async () => {
    try {
      await logout();
      dialogOpened.value = false;
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  console.log('isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin);

  const handleLogoutCancelled = () => {
    dialogOpened.value = false;
  };

  const renderAuthButton = () => {
    if (!isAuthenticated) {
      return (
        <div style={{display:'flex'}}>
          <Link to="/">
            <button className="btn1" style={{width:'8rem',marginRight:'10px'}}>
              <span class="button-content">Sign In </span>
            </button>
          </Link>
          <Link to="/">
            <button className="btn2" style={{width:'8rem'}}>
            <span class="button-content">Sign Up </span>
            </button>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="auth-container">
          <button className="logoutBtn" onClick={handleLogout} style={{width:'8rem'}}>
            <span className="button-content">Sign Out </span>
          </button>
          <ConfirmDialog
            header="Logout Confirmation"
            cancelButtonVisible
            confirmText="Logout"
            opened={dialogOpened.value}
            onOpenedChanged={(event) => (dialogOpened.value = event.detail.value)}
            onConfirm={handleLogoutConfirmed}
            onCancel={handleLogoutCancelled}
          >
            Are you sure you want to logout?
          </ConfirmDialog>
          <span className="status" hidden={status.value === ''}>
            Status: {status.value}
          </span>
        </div>
      );
    }
  };

  const renderDashboardLink = () => {
    if (isAuthenticated) {
      return (
        <ul>
          <li>
            <Link to={isAdmin ? "/admin/dashboard" : "/items/all"}>
              Dashboard
            </Link>
          </li>
        </ul>
      );
    }
    return null;
  };
  

  return (
    <header>
      <img src={bikerlogo} alt='logo' className='mainlogo'/>
      <nav>{renderDashboardLink()}</nav>
      {renderAuthButton()}
    </header>
  );
};

export default Header;

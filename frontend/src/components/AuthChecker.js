import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AuthChecker = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
};

export default AuthChecker;

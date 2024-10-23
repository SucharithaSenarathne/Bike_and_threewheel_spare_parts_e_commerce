
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PuTjT03x8t7VrltXcrDAkmHmkJzhXDyjX4WIbrGAPx9yYImTzldOdYZcF5987jiG9MdqKqV3qGyNNHvnFEkGd8T0012ZxoQZo');

const StripeProvider = ({ children }) => {
    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
};

export default StripeProvider;

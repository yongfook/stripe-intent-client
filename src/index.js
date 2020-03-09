import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import 'bulma/css/bulma.css'
import './index.css'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_gpoiYvcM1Yeh21Vaxt2CJeuK");

function App() {

  return (
    <Elements stripe={stripePromise}>
    	<CheckoutForm />    		
    </Elements>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
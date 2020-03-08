import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntent = async () => {
    return window
      .fetch("http://localhost:5000/api/v1/payment_intents", {
        method: 'POST'
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (!data || data.error) {
          console.log('API error:', {data});
          throw new Error('PaymentIntent API Error');
        } else {
          // console.log("PaymentIntent success")
          // console.log(data.client_secret)
          return data.client_secret
        }
      });
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    createPaymentIntent().then((secret) => {

      const result = stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Jenny Rosen',
          },
        }
      }).then((result) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            console.log("Payment success!")
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
          }
        }
      });
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  );
}
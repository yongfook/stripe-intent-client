import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntent = async (event) => {
    return window
      .fetch("https://yongfook-stripe-intent-server.herokuapp.com/api/v1/payment_intents", {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          'name': document.querySelector('#name').value, 
          'email': document.querySelector('#email').value, 
          'address': document.querySelector('#address').value
        })
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          if (res.status === 400) {
            console.log("API request error")
            return res.json().then((error) => {
              alert(error.message)
            });

          } else {
            return null;
          }
        }
      })
      .then((data) => {
        if (data) {
          return data.client_secret;
        }
      });
  };

  const handleSubmit = async (event) => {
    document.querySelector('.button').classList.add("is-loading");

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    createPaymentIntent(event).then((secret) => {
      if (!secret) {
        console.log("Stopping form submit");
        document.querySelector('.button').classList.remove("is-loading");
        return;
      }

      stripe.confirmCardPayment(secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: document.querySelector('#name').value,
          }
        }
      }).then((result) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert(result.error.message)
          console.log(result.error.message);
          document.querySelector('.button').classList.remove("is-loading");
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            console.log("Payment success!")
            console.log(result)
            document.querySelector('form').style.display = 'none';
            document.querySelector('h1').innerHTML = "Thank you - your order has been received!"
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
      <div className="field">
        <input className="input is-fullwidth"
          id="name"
          name="name"
          placeholder="Name"
          required
        />        
      </div>
      <div className="field">
        <input className="input is-fullwidth"
          id="email"
          name="email"
          placeholder="Email"
          required
        />        
      </div>
      <div className="field">
        <input className="input is-fullwidth"
          id="address"
          name="address"
          placeholder="Address"
          required
        />        
      </div>
      <div className="field">
        <CardSection />
      </div>
      <button className="button is-link" disabled={!stripe}>Buy Now for $12 USD</button>
    </form>
  );
}
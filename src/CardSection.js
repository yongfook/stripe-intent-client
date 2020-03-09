/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import './card.css';

function CardSection() {
  return (
    <label>
      <CardElement />
    </label>
  );
};

export default CardSection;
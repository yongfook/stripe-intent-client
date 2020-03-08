/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
// import './CardSectionStyles.css'

function CardSection() {
  return (
    <label>
      Card details
      <CardElement />
    </label>
  );
};

export default CardSection;
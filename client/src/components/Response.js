import React from 'react';
import { FaSadTear, FaSmile } from 'react-icons/fa';

const Response = ({ data }) => {
  const { sentiment, response, intent, faq } = data;

  const sentimentIcon =
    sentiment === 'negative' ? <FaSadTear color="red" /> : <FaSmile color="green" />;

  return (
    <div className="response">
      <div className="sentiment">
        {sentimentIcon}
        <span>{sentiment === 'negative' ? 'Oh no!' : 'Great!'}</span>
      </div>
      <div className="intent">
        <strong>Intent:</strong> {intent}
      </div>
      <div className="faq">
        <strong>FAQ Match:</strong> {faq}
      </div>
      <div className="response-text">
        <strong>Response:</strong> {response}
      </div>
    </div>
  );
};

export default Response;

import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const Feedback = ({ responseId }) => {
  const [rating, setRating] = useState(null);

  const handleFeedback = (feedback) => {
    setRating(feedback);
    // Send feedback to the backend (optional)
    console.log(`Feedback for ${responseId}: ${feedback}`);
  };

  return (
    <div className="feedback">
      <button onClick={() => handleFeedback('thumbs_up')}>
        <FaThumbsUp />
      </button>
      <button onClick={() => handleFeedback('thumbs_down')}>
        <FaThumbsDown />
      </button>
    </div>
  );
};

export default Feedback;

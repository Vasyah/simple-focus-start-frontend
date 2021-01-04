import React from "react";
import './error.scss';

const Error = ({ errors }) => {
  return (
    <>
      {errors.map((error, index) =>
        <div key={index} className="error-wrapper">
          <h4 className="error-text">{error}</h4>
        </div>
      )}
    </>
  )
}

export default Error;

import React from "react";
import './Alert.scss';
import classNames from 'classnames';

const Alert = ({ messages, type }) => {
  return (
    <>
      {messages.map((message, index) =>
        <div key={index} className={classNames('alert-wrapper', type)}>
          <h4 className="alert-text">{message}</h4>
        </div>
      )}
    </>
  )
}

export default Alert;

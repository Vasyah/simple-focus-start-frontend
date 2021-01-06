import { useState, useEffect } from 'react';

const useValidateEmail = (email, formSubmit) => {
  let [ emailErrors, setEmailErrors ] = useState([]);

  useEffect(() => {
    if (!formSubmit) return;
    setValidationErrors()
  }, [ formSubmit, email ]);

  const setValidationErrors = () => {
    setEmailErrors([]);
    const messages = [];
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRe.test(email)) messages.push('Почта указана не верно!');
    return setEmailErrors(messages);
  }

  return { emailErrors };
}

export default useValidateEmail;

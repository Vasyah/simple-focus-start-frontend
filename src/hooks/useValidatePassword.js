import { useState, useEffect } from 'react';

const useValidatePassword = (value, formSubmit) => {
  const [ passwordErrors, setPasswordErrors ] = useState([]);

  useEffect(() => {
    if (!formSubmit) return;
    setValidationErrors();
  }, [ formSubmit, value ]);

  const setValidationErrors = () => {
    setPasswordErrors([]);
    const messages = [];
    if (!value.password.length
      || value.password.length < 6) {
      if (!value.password.length) messages.push('Пароль указан не верно!');
      if (value.password.length < 6) messages.push('Минимальная длина пароля 6 символов!');
    }
    if (value.passwordConfirm) if (value.password !== value.passwordConfirm) messages.push('Пароли не совпадают!');
    return setPasswordErrors(messages);
  }

  return { passwordErrors };
}

export default useValidatePassword;

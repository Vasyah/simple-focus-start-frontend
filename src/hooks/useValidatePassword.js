import { useState, useEffect } from 'react';

const useValidatePassword = (values, formSubmit) => {
  const [ passwordErrors, setPasswordErrors ] = useState([]);

  useEffect(() => {
    if (!formSubmit) return;
    setValidationErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formSubmit, values ]);

  const setValidationErrors = () => {
    setPasswordErrors([]);
    const messages = [];
    if (!values.password.length
      || values.password.length < 6) {
      if (!values.password.length) messages.push('Пароль указан не верно!');
      if (values.password.length < 6) messages.push('Минимальная длина пароля 6 символов!');
    }
    if (values.passwordConfirm) if (values.password !== values.passwordConfirm) messages.push('Пароли не совпадают!');
    return setPasswordErrors(messages);
  }

  return { passwordErrors };
}

export default useValidatePassword;

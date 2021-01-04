import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useValidate = (value, formSubmit) => {
  // state
  const [ errors, setErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { signup, login } = useAuth();
  const history = useHistory();

  const setValidationErrors = () => {
    let message = [];
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value.passwordConfirm) if (value.password !== value.passwordConfirm) message.push('Пароли не совпадают!');
    if (value.password !== value.passwordConfirm
      || !emailRe.test(value.email)
      || !value.password.length
      || value.password.length < 6) {
      // email check
      if (!emailRe.test(value.email)) message.push('Почта указана не верно!');
      // password check
      if (!value.password.length) message.push('Пароль указан не верно!');
      if (value.password.length < 6) message.push('Минимальная длина пароля 6 символов!');
      // set state
      setLoading(false);
      setErrors(error => {
        error = message;
        return error;
      });
      if (errors.length) return errors;
    }
  }

  useEffect(() => {
    if (!formSubmit) return;
    const validate = async () => {
      setErrors([]);
      try {
        setLoading(true);
        setValidationErrors();
        // firebase
        value.passwordConfirm
          ? await signup(value.email, value.password)
          : await login(value.email, value.password);
        history.push('/');
        // set state
        setLoading(false);
      } catch {
        // set state
        setErrors(error => {
          value.passwordConfirm
            ? error = [ ...error, 'Не удалось создать аккаунт!' ]
            : error = [ ...error, 'Не удалось войти в аккаунт!' ];
          return error;
        });
        setLoading(false);
      }
    }


    if (value) validate().catch(error => console.error(error));
  }, [formSubmit, history, login, signup, value]);

  return { errors, loading };
}

export default useValidate;

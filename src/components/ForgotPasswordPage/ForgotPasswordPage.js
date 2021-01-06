import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './forgot-password-page.scss';
import Alert from "../Alert/Alert";
import useReset from "../../hooks/useReset";
import useValidateEmail from "../../hooks/useValidateEmail";

const ForgotPasswordPage = () => {
  // ref
  const emailRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ formSubmit, setFormSubmit ] = useState(false);
  const [ errors, setErrors ] = useState([]);
  // other
  const { resetErrors, messages, loading } = useReset(values.email, formSubmit);
  const { emailErrors } = useValidateEmail(values.email, formSubmit);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      email: emailRef.current.value,
    }
    setValues(values);
    setFormSubmit(true);
  }

  useEffect(() => {
    const messages = [...resetErrors, ...emailErrors];
    setErrors(messages);
  }, [resetErrors, emailErrors]);

  return (
    <div className={'authentication-wrapper'}>
      <div className={'authentication-form-wrapper'}>
        <h1 className={'authentication-title'}>Сброс пароля</h1>
        {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
        {messages.length !== 0 && <Alert messages={messages} type={'success'}/>}
        <form onSubmit={handleSubmit} className={'authentication-form'}>
          <div className="authentication-row email">
            <label htmlFor={'email'} className={'email-row__label'}>Почта</label>
            <input
              defaultValue={'yakikbutovski353@gmail.com'}
              type="email"
              ref={emailRef}
              className={'email-row__input'}
              id={'email'}/>
          </div>
          <div className={'authentication-button__wrapper'}>
            <button
              disabled={loading}
              type={'submit'}
              className={'authentication-button button-blue'}>
              Сбросить пароль
            </button>
          </div>
        </form>
        <div className="forgot-password-wrapper">
          <Link to={'/login'}>Войти</Link>
        </div>
      </div>
      <div className={'authentication-link-wrapper'}>
        <p>Уже есть аккаунт? <Link to={'login'}>Войти</Link></p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;

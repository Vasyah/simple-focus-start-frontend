import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './ForgotPasswordPage.scss';
import Alert from "../../components/Alert/Alert";
import useForgotPassword from "../../hooks/useForgotPassword";
import useValidateEmail from "../../hooks/useValidateEmail";

const ForgotPasswordPage = () => {
  // ref
  const emailRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ errors, setErrors ] = useState([]);
  const [ formSubmit, setFormSubmit ] = useState(false);
  const [ noErrors, setNoErrors ] = useState(false);
  // other
  const { resetErrors, messages, loading } = useForgotPassword(values.email, noErrors);
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
    const messages = [ ...emailErrors ];
    if (!messages.length && formSubmit) {
      setNoErrors(true);
      messages.push(...resetErrors);
    }
    setErrors(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailErrors, resetErrors]);

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
              type="text"
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

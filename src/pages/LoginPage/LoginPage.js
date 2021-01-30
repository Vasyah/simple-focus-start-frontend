import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './login-page.scss';
import Alert from "../../components/Alert/Alert";
import useValidateEmail from "../../hooks/useValidateEmail";
import useValidatePassword from "../../hooks/useValidatePassword";
import useLogin from "../../hooks/useLogin";

const LoginPage = () => {
  // ref
  const emailRef = useRef();
  const passwordRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ errors, setErrors ] = useState([]);
  const [ formSubmit, setFormSubmit ] = useState(false);
  const [ noErrors, setNoErrors ] = useState(false);
  // other
  const { loginErrors, loading } = useLogin(values, noErrors);
  const { emailErrors } = useValidateEmail(values.email, formSubmit);
  const { passwordErrors } = useValidatePassword(values, formSubmit);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setValues(values);
    setFormSubmit(true);
  }

  useEffect(() => {
    const messages = [ ...passwordErrors, ...emailErrors ];
    if (!messages.length && formSubmit) {
      setNoErrors(true);
      messages.push(...loginErrors);
    }
    setErrors(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ emailErrors, passwordErrors, loginErrors ]);


  return (
    <div className={'authentication-wrapper'}>
      <div className={'authentication-form-wrapper'}>
        <h1 className={'authentication-title'}>Вход</h1>
        {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
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
          <div className="authentication-row password">
            <label htmlFor={'password'} className={'email-row__label'}>Пароль</label>
            <input
              defaultValue={'123456789'}
              type="password"
              ref={passwordRef}
              className={'email-row__input'}
              id={'password'}/>
          </div>
          <div className={'authentication-button__wrapper'}>
            <button
              disabled={loading}
              type={'submit'}
              className={'authentication-button button-blue'}>
              Войти
            </button>
          </div>
        </form>
        <div className="forgot-password-wrapper">
          <Link to={'/forgot-password'}>Забыли пароль?</Link>
        </div>
      </div>
      <div className={'authentication-link-wrapper'}>
        <p>Нет аккаунта? <Link to={'signup'}>Регистрация</Link></p>
      </div>
    </div>
  )
}

export default LoginPage;

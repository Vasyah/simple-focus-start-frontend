import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './signup-page.scss';
import Alert from "../../components/Alert/Alert";
import useValidateEmail from "../../hooks/useValidateEmail";
import useValidatePassword from "../../hooks/useValidatePassword";
import useSignup from "../../hooks/useSignup";

const SignupPage = () => {
  // ref
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ errors, setErrors ] = useState([]);
  const [ formSubmit, setFormSubmit ] = useState(false);
  const [ noErrors, setNoErrors ] = useState(false);
  // other
  const { signupErrors, loading } = useSignup(values, noErrors);
  const { emailErrors } = useValidateEmail(values.email, formSubmit);
  const { passwordErrors } = useValidatePassword(values, formSubmit);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirm: passwordConfirmRef.current.value
    }
    setValues(values);
    setFormSubmit(true);
  }

  useEffect(() => {
    const messages = [ ...passwordErrors, ...emailErrors ];
    if (!messages.length && formSubmit) {
      setNoErrors(true);
      messages.push(...signupErrors);
    }
    setErrors(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailErrors, passwordErrors, signupErrors]);

  return (
    <div className={'authentication-wrapper'}>
      <div className={'authentication-form-wrapper'}>
        <h1 className={'authentication-title'}>Регистрация</h1>
        {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
        <form onSubmit={handleSubmit} className={'authentication-form'}>
          <div className="authentication-row name">
            <label htmlFor={'name'} className={'authentication-row__label'}>Имя</label>
            <input
              defaultValue={'Savva2004'}
              type="text"
              ref={nameRef}
              className={'authentication-row__input'}
              id={'name'}/>
          </div>
          <div className="authentication-row email">
            <label htmlFor={'email'} className={'authentication-row__label'}>Почта</label>
            <input
              defaultValue={'yakikbutovski353@gmail.com'}
              type="text"
              ref={emailRef}
              className={'authentication-row__input'}
              id={'email'}/>
          </div>
          <div className="authentication-row password">
            <label htmlFor={'password'} className={'authentication-row__label'}>Пароль</label>
            <input
              defaultValue={'123456789'}
              type="password"
              ref={passwordRef}
              className={'authentication-row__input'}
              id={'password'}/>
          </div>
          <div className="authentication-row password-confirm">
            <label htmlFor={'password-confirm'} className={'authentication-row__label'}>Повторите пароль</label>
            <input
              defaultValue={'123456789'}
              type="password"
              ref={passwordConfirmRef}
              className={'authentication-row__input'}
              id={'password-confirm'}/>
          </div>
          <div className={'authentication-button__wrapper'}>
            <button
              disabled={loading}
              type={'submit'}
              className={'authentication-button button-blue'}>
              Зарегистрироваться
            </button>
          </div>
        </form>
        <div className="forgot-password-wrapper">
          <Link to={'/forgot-password'}>Забыли пароль?</Link>
        </div>
      </div>
      <div className={'authentication-link-wrapper'}>
        <p>Уже есть аккаунт? <Link to={'login'}>Войти</Link></p>
      </div>
    </div>
  )
}

export default SignupPage;

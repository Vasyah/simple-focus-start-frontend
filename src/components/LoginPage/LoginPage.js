import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './login-page.scss';
import useValidate from "../../hooks/useValidate";
import Error from "../Error/Error";

export default function LoginPage () {
  // ref
  const emailRef = useRef();
  const passwordRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ formSubmit, setFormSubmit ] = useState(false);
  // other
  const { errors, loading } = useValidate(values, formSubmit);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setValues(values);
    setFormSubmit(true);
  }

  return (
    <>
      <div className={'authentication-wrapper'}>
        <h1 className={'authentication-title'}>Вход</h1>
        {errors.length !== 0 && <Error errors={errors}/>}
        <form onSubmit={handleSubmit} className={'authentication-form'}>
          <div className="authentication-row email">
            <label htmlFor={'email'} className={'email-row__label'}>Почта</label>
            <input
              defaultValue={'kashin.savva@mail.ru'}
              type="email"
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
        <div className={'login-link-wrapper'}>
          <p>Нет аккаунта? <Link to={'signup'}>Регистрация</Link></p>
        </div>
      </div>
    </>
  )
}

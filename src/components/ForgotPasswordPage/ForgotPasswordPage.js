import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import './forgot-password-page.scss';
import useValidate from "../../hooks/useValidate";
import Error from "../Error/Error";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPasswordPage = () => {
  // ref
  const emailRef = useRef();
  // state
  const [ errors, setErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ message, setMessage ] = useState('');
  // other
  const history = useHistory();
  const { resetPassword } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setMessage('');
      setErrors([]);
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Проверьте свой почтовый ящик и следуйте дальнейщей инструкции');
    } catch {
      setErrors(['Не удалось сбрросить пароль!']);
    }
  }


  return (
    <div className={'authentication-wrapper'}>
      <div className={'authentication-form-wrapper'}>
        <h1 className={'authentication-title'}>Сброс пароля</h1>
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
          <div className={'authentication-button__wrapper'}>
            <button
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

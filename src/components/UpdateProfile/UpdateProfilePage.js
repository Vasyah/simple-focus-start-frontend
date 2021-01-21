import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import './update-profile.scss';
import Alert from "../Alert/Alert";
import useValidateEmail from "../../hooks/useValidateEmail";
import useValidatePassword from "../../hooks/useValidatePassword";
import { useAuth } from "../../contexts/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";

const UpdateProfilePage = () => {
  // ref
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  // state
  const [ values, setValues ] = useState({});
  const [ errors, setErrors ] = useState([]);
  const [ formSubmit, setFormSubmit ] = useState(false);
  const [ noErrors, setNoErrors ] = useState(false);
  // other
  const { currentUser } = useAuth();
  const history = useHistory();
  const { updateProfileErrors, loading } = useUpdateProfile(values, noErrors);
  const { emailErrors } = useValidateEmail(values.email, formSubmit);
  const { passwordErrors } = useValidatePassword(values, formSubmit);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirm: passwordConfirmRef.current.value
    }
    setValues(values);
    setFormSubmit(true);
  }

  useEffect(() => {
    const messages = [ ...emailErrors ];
    if (values.password) messages.push(...passwordErrors);
    if (!messages.length && formSubmit) {
      setNoErrors(true);
      messages.push(...updateProfileErrors);
    }
    setErrors(messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ emailErrors, passwordErrors, updateProfileErrors ]);

  return (
    <div className={'authentication-wrapper'}>
      <div className={'authentication-form-wrapper'}>
        <h1 className={'authentication-title'}>Изменить профиль</h1>
        {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
        <form onSubmit={handleSubmit} className={'authentication-form'}>
          <div className="authentication-row email">
            <label htmlFor={'email'} className={'email-row__label'}>Почта</label>
            <input
              defaultValue={currentUser.email}
              type="text"
              ref={emailRef}
              className={'email-row__input'}
              id={'email'}/>
          </div>
          <div className="authentication-row password">
            <label htmlFor={'password'} className={'email-row__label'}>Пароль</label>
            <input
              placeholder={'Пустое - без изменений'}
              type="password"
              ref={passwordRef}
              className={'email-row__input'}
              id={'password'}/>
          </div>
          <div className="authentication-row password-confirm">
            <label htmlFor={'password-confirm'} className={'email-row__label'}>Повторите пароль</label>
            <input
              placeholder={'Пустое - без изменений'}
              type="password"
              ref={passwordConfirmRef}
              className={'email-row__input'}
              id={'password-confirm'}/>
          </div>
          <div className={'authentication-button__wrapper'}>
            <button
              disabled={loading}
              type={'submit'}
              className={'authentication-button button-blue'}>
              Изменить
            </button>
          </div>
        </form>
      </div>
      <div className={'authentication-link-wrapper'}>
        <p className={'authentication-link'} onClick={() => history.goBack()}>Отменить</p>
      </div>
    </div>
  )
}

export default UpdateProfilePage;

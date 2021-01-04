import React, { useState } from "react";
import './news-page.scss';
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Error from "../Error/Error";

export default function NewsPage() {
  // state
  const [ errors, setErrors ] = useState([]);
  // other
  const history = useHistory();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    setErrors([]);
    try {
      await logout();
      history.push('/login');
    } catch {
      setErrors(['Не удалось выйти из аккаунта!']);
    }
  }

  return (
    <>
      <div className="profile">
        {errors.length !== 0 && <Error errors={errors}/>}
        <h2 className={'profile-title'}>Профиль</h2>
        { currentUser.email }
      </div>
      <div className={'logout-button-wrapper'}>
        <button className={'logout-button'} onClick={handleLogout}>Выйти</button>
      </div>
    </>
  )
}

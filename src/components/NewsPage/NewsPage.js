import React, { useState } from "react";
import './news-page.scss';
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Alert from "../Alert/Alert";

export default function NewsPage() {
  // state
  const [ errors, setErrors ] = useState([]);
  // other
  const history = useHistory();
  const { currentUser, logout } = useAuth();

  const handleUpdate = () => {
    history.push('/update-profile');
  }

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
        {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
        <h2 className={'profile-title'}>Профиль</h2>
        { currentUser.email }
      </div>
      <div className={'update-profile-wrapper'}>
         <button className={'update-profile-button'} onClick={handleUpdate}>Изменить профиль</button>
      </div>
      <div className={'logout-button-wrapper'}>
        <button className={'logout-button'} onClick={handleLogout}>Выйти</button>
      </div>
    </>
  )
}

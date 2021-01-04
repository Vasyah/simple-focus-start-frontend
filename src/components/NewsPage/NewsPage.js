import React, { useState } from "react";
import './news-page.scss';
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

export default function NewsPage() {
  // state
  const [ error, setError ] = useState('');
  // other
  const history = useHistory();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    console.log(error);
    try {
      await logout();
      history.push('/login');
    } catch {
      setError('Не удалось выйти из аккаунта!');
    }
  }

  return (
    <>
      <div className="profile">
        <h2 className={'profile-title'}>Профиль</h2>
        { currentUser.email }
      </div>
      <div className={'logout-button-wrapper'}>
        <button className={'logout-button'} onClick={handleLogout}>Выйти</button>
      </div>
    </>
  )
}

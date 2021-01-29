import React, { useState, useEffect, useMemo, useRef } from "react";
import './header.scss';
import Alert from "../Alert/Alert";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/logo/logo-transparent-cut.png';

const Header = () => {
  // ref
  const dropdownRef = useRef();
  // state
  const [ errors, setErrors ] = useState([]);
  const [ isProfileMenuOpened, setIsProfileMenuOpened ] = useState(false);
  // other
  const history = useHistory();
  const { currentUser, allUsers, logout } = useAuth();

  const handleUpdate = () => {
    history.push('/update-profile');
  }

  const handleLogout = async () => {
    setErrors([]);
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('logout error', error);
      // setErrors([ 'Не удалось выйти из аккаунта!' ]);
    }
  }

  const handleClickOutside = (event) => !event.composedPath().includes(dropdownRef.current) && setIsProfileMenuOpened(false);
  const handleClickOutsideMemo = useMemo(() => handleClickOutside, []);

  useEffect(() => {
    isProfileMenuOpened
      ? window.addEventListener('click', handleClickOutsideMemo, false)
      : window.removeEventListener('click', handleClickOutsideMemo, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isProfileMenuOpened ]);

  return (
    <div className={'header-wrapper'}>
      <div className={'header-content container'}>
        <Link to={'/'} className="logo active">
          <img className={'logo-img'} src={logo} alt="logo"/>
        </Link>
        <div className="navigation">
          <Link to={'/video'}>VIDEO</Link>
        </div>
        {
          currentUser &&
          <div className="profile-dropdown-menu-wrapper" ref={dropdownRef}>
            <div className="profile-dropdown-menu" onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}>
              <h3 className="profile-name">{currentUser.name}</h3>
              <div className="profile-avatar">{currentUser.name.substr(0, 1)}</div>
              <div className="profile-arrow"/>
              {errors.length !== 0 && <Alert messages={errors} type={'error'}/>}
              {isProfileMenuOpened &&
              <div className="profile-dropdown-item">
                <div className={'update-profile-wrapper'}>
                  <button className={'update-profile-button'} onClick={handleUpdate}>Изменить профиль</button>
                </div>
                <div className={'logout-button-wrapper'}>
                  <button className={'logout-button'} onClick={handleLogout}>Выйти</button>
                </div>
              </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Header;

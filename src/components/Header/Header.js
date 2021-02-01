import React, { useState, useEffect, useMemo, useRef } from "react";
import './Header.scss';
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/logo/logo-transparent-cut.png';
import SwitchTheme from "../SwitchTheme/SwitchTheme";

const Header = () => {
  // ref
  const dropdownRef = useRef();
  // state
  const [ isProfileMenuOpened, setIsProfileMenuOpened ] = useState(false);
  // other
  const history = useHistory();
  const { currentUser, logout } = useAuth();

  const handleUpdate = () => {
    history.push('/update-profile');
  }

  const handleLogout = async () => {
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

        </div>
        {
          !currentUser
            // if no user show only theme switch
            ? <SwitchTheme/>
            // if user show all menu
            : <div className="profile-dropdown-menu-wrapper" ref={dropdownRef}>
              <div className="profile-dropdown-menu hover-bg"
                   onClick={() => setIsProfileMenuOpened(!isProfileMenuOpened)}>
                <div className="profile-left">
                  <h3 className="profile-name">{currentUser.name}</h3>
                </div>
                <div className="profile-right">
                  <div className="profile-avatar">{currentUser.name.substr(0, 1)}</div>
                  <div className="profile-arrow"/>
                </div>
              </div>
              {isProfileMenuOpened &&
              <div className="profile-dropdown-item">
                <SwitchTheme/>
                <div className={'update-profile-wrapper'}>
                  <button className={'update-profile-button'} onClick={handleUpdate}>Изменить профиль</button>
                </div>
                <div className={'logout-button-wrapper'}>
                  <button className={'logout-button'} onClick={handleLogout}>Выйти</button>
                </div>
              </div>
              }
            </div>}
      </div>
    </div>
  )
}

export default Header;

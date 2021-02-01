import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import './Users.scss';

const Users = () => {
  const { allUsersWithoutMe } = useAuth();

  return (
    <div className={'users'}>
      <h4 className={'users-title'}>Пользователи</h4>
      {allUsersWithoutMe.map(user => {
        return (
          <Link
            className={'user hover-bg'}
            key={user.id}
            to={`/chat/${user.id}`}>
            {user.name}
            <div className={classNames('user-status', user.online ? 'user-online' : 'user-offline')}/>
          </Link>
        )
      })
      }
    </div>
  )
}

export default Users;

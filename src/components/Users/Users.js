import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import './users.scss';

const Users = () => {
  const { allUsersWithoutMe } = useAuth();

  return (
    <div className={'users'}>
      <h4 className={'users-title'}>Пользователи</h4>
      {allUsersWithoutMe.map(user => {
        return (
          <Link className={'user hover-bg'} key={user.id} to={`/chat/${user.id}`}>{user.name}</Link>
        )
      })
      }
    </div>
  )
}

export default Users;

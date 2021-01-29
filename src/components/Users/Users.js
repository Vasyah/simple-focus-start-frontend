import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Users = () => {
  const { allUsers, currentUser, allUsersWithoutMe } = useAuth();

  return (
    <>
      {allUsersWithoutMe.map(user => {
        return (
          <div key={user.id}>
            <Link to={`/chat/${user.id}`}>{user.name}</Link>
          </div>
        )
      })
      }
    </>
  )
}

export default Users;

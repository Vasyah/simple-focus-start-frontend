import React from 'react';
import { useAuth } from "../../contexts/AuthContext";

const Users = () => {
  const { allUsers } = useAuth();

  return (
    <>
      {allUsers.map(user => (
          <div key={user.id}>
            <span>{user.name}</span>
          </div>
        ))
      }
    </>
  )
}

export default Users;

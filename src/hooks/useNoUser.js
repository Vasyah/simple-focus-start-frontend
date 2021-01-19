import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

const useNoUser = () => {
  const [ noUser, setNoUser ] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchUser().then(() => {
      console.log(currentUser)
    });
  }, [ currentUser ]);

  const fetchUser = async () => {
    try {
      !currentUser ? setNoUser(true) : setNoUser(false);
    } catch {
      console.log('error');
    }
  }

  return { noUser };
}

export default useNoUser;

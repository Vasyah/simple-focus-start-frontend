import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useUpdateProfile = (values, noErrors) => {
  // state
  const [ updateProfileErrors, setUpdateProfileErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const history = useHistory();
  const { updateEmail, updatePassword, currentUser } = useAuth();

  const setUpdateProfile = () => {
    setLoading(true);
    setUpdateProfileErrors([]);
    const promises = [];
    if (values.email !== currentUser.email) {
      promises.push(updateEmail(values.email));
    }
    if (values.password) {
      promises.push(updatePassword(values.password));
    }

    Promise.all(promises).then(() => {
      history.push('/');
    }).catch(() => {
      setUpdateProfileErrors([ 'Не удалось обновить аккаунт!' ]);
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    if (!noErrors) return;
    setUpdateProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ values, noErrors ]);

  return { updateProfileErrors, loading };
}

export default useUpdateProfile;

import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useLogin = (values, noErrors) => {
  // state
  const [ loginErrors, setLoginErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { login } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!noErrors) return;
    setSignup().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noErrors, values]);

  const setSignup = async () => {
    setLoginErrors([]);
    try {
      setLoading(true);
      login(values.email, values.password).then(() => {
        history.push('/');
        setLoading(false);
      })
    } catch {
      setLoading(true);
      setLoginErrors(['Не удалось войти в аккаунт!']);
      setLoading(false);
    }
  }

  return { loginErrors, loading };
}

export default useLogin;

import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useLogin = (value, submitForm) => {
  // state
  const [ loginErrors, setLoginErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { login } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!submitForm) return;
    setSignup().catch(error => console.log(error));
  }, [submitForm, value]);

  const setSignup = async () => {
    setLoginErrors([]);
    try {
      setLoading(true);
      await login(value.email, value.password);
      history.push('/');
      setLoading(false);
    } catch {
      setLoading(true);
      setLoginErrors(['Не удалось войти в аккаунт!']);
      setLoading(false);
    }
  }

  return { loginErrors, loading };
}

export default useLogin;

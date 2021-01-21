import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

const useLogin = (values, noErrors) => {
  // state
  const [ loginErrors, setLoginErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { login } = useAuth();

  useEffect(() => {
    if (!noErrors) return;
    setSignup().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ noErrors, values ]);

  const setSignup = async () => {
    setLoginErrors([]);
    try {
      setLoading(true);
      await login(values.email, values.password)
      setLoading(false);
    } catch {
      setLoading(true);
      setLoginErrors([ 'Не удалось войти в аккаунт!' ]);
      setLoading(false);
    }
  }

  return { loginErrors, loading };
}

export default useLogin;

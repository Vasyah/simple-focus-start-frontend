import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useSignup = (values, noErrors) => {
  // state
  const [ signupErrors, setSignupErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { signup } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!noErrors) return;
    setSignup().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noErrors, values]);

  const setSignup = async () => {
    setSignupErrors([]);
    try {
      setLoading(true);
      await signup(values.email, values.password);
      history.push('/');
      setLoading(false);
    } catch {
      setLoading(true);
      setSignupErrors(['Не удалось создать аккаунт!']);
      setLoading(false);
    }
  }

  return { signupErrors, loading };
}

export default useSignup;

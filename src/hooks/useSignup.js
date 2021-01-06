import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useSignup = (value, submitForm) => {
  // state
  const [ signupErrors, setSignupErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { signup } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!submitForm) return;
    setSignup().catch(error => console.log(error));
  }, [submitForm, value]);

  const setSignup = async () => {
    setSignupErrors([]);
    try {
      setLoading(true);
      await signup(value.email, value.password);
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

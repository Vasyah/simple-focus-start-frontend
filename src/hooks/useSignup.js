import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

const useSignup = (values, noErrors) => {
  // state
  const [ signupErrors, setSignupErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  // other
  const { signup } = useAuth();

  useEffect(() => {
    if (!noErrors) return;
    setSignup().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noErrors, values]);

  const setSignup = async () => {
    setSignupErrors([]);
    try {
      setLoading(true);
      await signup(values.email, values.password, values.name);
      setLoading(false);
    } catch (error) {
      setLoading(true);
      setSignupErrors(['Не удалось создать аккаунт!']);
      setLoading(false);
    }
  }

  return { signupErrors, loading };
}

export default useSignup;

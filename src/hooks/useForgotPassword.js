import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

const useForgotPassword = (email, noErrors) => {
  // state
  const [ resetErrors, setResetErrors ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ messages, setMessages ] = useState([]);
  // other
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (!noErrors) return;
    setSignup().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noErrors, email]);

  const setSignup = async () => {
    setResetErrors([]);
    try {
      setMessages([]);
      setLoading(true);
      await resetPassword(email);
      setMessages(['Проверьте свой почтовый ящик и следуйте дальнейщей инструкции']);
      setLoading(false);
    } catch {
      setLoading(true);
      setResetErrors(['Не удалось сбросить пароль!']);
      setLoading(false);
    }
  }

  return { resetErrors, messages, loading };
}

export default useForgotPassword;

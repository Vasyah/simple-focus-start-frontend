import { useEffect, useState } from "react";

const useValidateName = (name, formSubmit) => {
  let [ nameErrors, setNameErrors ] = useState([]);

  useEffect(() => {
    if (!formSubmit) return;
    setValidationErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ formSubmit, name ]);

  const setValidationErrors = () => {

  }

  return { nameErrors };
}

export default useValidateName;

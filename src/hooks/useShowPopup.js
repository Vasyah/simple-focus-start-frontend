import { useState, useEffect } from 'react';

const useShowPopup = (trigger) => {
  const [ show, setShow ] = useState(false);

  useEffect(() => {
    trigger ? setShow(true) : setShow(false);
  }, [trigger]);

  return show;
}

export default useShowPopup;

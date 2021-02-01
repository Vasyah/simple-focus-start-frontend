import React, { useEffect, useState } from "react";
import { useVideo } from "../../contexts/VideoContext";
import { useAuth } from "../../contexts/AuthContext";

const StartListenServer = () => {
  const { startListen } = useVideo();
  const [ loading, setLoading ] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    currentUser ? setLoading(false) : setLoading(true);
  }, [ currentUser ]);

  useEffect(() => {
    if (!loading) {
      startListen();
      console.log('listen')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <></>
  );
}

export default StartListenServer;

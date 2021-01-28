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
  }, [loading]);

  return (
    <></>
  );
}

export default StartListenServer;

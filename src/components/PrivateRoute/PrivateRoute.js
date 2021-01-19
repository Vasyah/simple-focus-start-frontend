import React, { useState, useEffect } from "react";
import './private-route.scss';
import { Route } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../Loading/Loading";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    currentUser ? setLoading(false) : setLoading(true);
  }, [ currentUser, loading ]);

  return (
    <Route
      {...rest}
      render={props => loading ? <Loading/> : currentUser && <Component {...props} />}
    />
  )
}

export default PrivateRoute;

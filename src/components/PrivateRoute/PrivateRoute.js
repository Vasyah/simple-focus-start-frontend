import React, { useState, useEffect } from "react";
import './PrivateRoute.scss';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../Loading/Loading";
import Delayed from "../Delayed/Delayed";

const PrivateRoute = ({ render: Component, ...rest }) => {
  const { currentUser } = useAuth();
  const [ loading, setLoading ] = useState(true);

  let redirect;
  if (!currentUser) {
    redirect = <Redirect to={'/login'}/>
  }

  useEffect(() => {
    currentUser ? setLoading(false) : setLoading(true);
  }, [ currentUser ]);

  return (
    <Route
      {...rest}
      render={props => loading
        ?
        <>
          <Loading/>
          <Delayed waitBeforeShow={10000}>{redirect}</Delayed>
        </>
        : currentUser
          ? <Component {...props} />
          : <Redirect to={'/login'}/>}
    />
  )
}

export default PrivateRoute;

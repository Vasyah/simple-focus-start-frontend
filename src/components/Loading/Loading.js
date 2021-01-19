import React from "react";
import './loading.scss';
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from 'react-router-dom';
import Delayed from "../Delayed/Delayed";

const Loading = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <div className="lds-roller">
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
      <Delayed waitBeforeShow={6000}>
        {!currentUser && <Redirect to={'/login'}/>}
      </Delayed>
      {/*{!currentUser &&*/}
      {/*<div>Вы не авторизированы,*/}
      {/*  <Link to={'/login'}>войти</Link>*/}
      {/*</div>}*/}
    </>
  )
}

export default Loading;

import React, { useEffect, useState } from "react";
import './loading.scss';
import { useAuth } from "../../contexts/AuthContext";

const Loading = () => {
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
    </>
  )
}

export default Loading;

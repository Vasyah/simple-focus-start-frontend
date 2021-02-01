import React from "react";
import './LilLoading.scss';

const LilLoading = () => {

  return (
    <div className={'lil-loading'}>
      <div className="lds-ring">
        <div/>
        <div/>
        <div/>
        <div/>
      </div>
    </div>
  )
}

export default LilLoading;

import React from "react";
import './news-page.scss';
import { useGlobalPopup } from "../../contexts/GlobalPopupContext";

export default function NewsPage() {
  const { addMessage } = useGlobalPopup();

  return (
    <>
      <div className="news-page">
        <h1>News page</h1>
        <button onClick={() => {
          addMessage('message', '304');
        }}>Popup show!</button>
      </div>
    </>
  )
}

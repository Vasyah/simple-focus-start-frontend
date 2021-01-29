import React, { useEffect } from 'react';
import { useGlobalPopup } from "../../contexts/GlobalPopupContext";
import { useVideo } from "../../contexts/VideoContext";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const GlobalPopup = () => {
  const { message, removeMessage, addMessage } = useGlobalPopup();
  const { receivingCall, callAccepted, declineCall, caller } = useVideo();
  const { allUsers } = useAuth();
  const history = useHistory();

  const handleDecline = () => {
    declineCall();
  };

  const handleAccept = () => {
    history.push('/video');
  }

  const handleClose = () => {
    removeMessage();
  }

  useEffect(() => {
    let user;
    // выбираю чела который звонит
    if (caller.data) user = allUsers.find(user => user.id === caller.data.userId);
    // добавляю сообщение
    if (receivingCall && !callAccepted && caller) addMessage(`вам звонит ${user.name}`, { type: 'call' });
  }, [ receivingCall, callAccepted, caller ]);

  const popupType = () => {
    let popup;
    // выбираю нужный тип попапа
    switch (message.payload.type) {
      case 'call':
        popup =
          <>
            <div>
              {message.message && <p>{message.message}</p>}
              <button onClick={() => {
                handleAccept();
                handleClose();
              }}>ответить</button>
              <button onClick={() => {
                handleDecline();
                handleClose();
              }}>отклонить</button>
            </div>
          </>
        break;
      case 'message':
        popup =
          <div>
            {message.message && <p>{message.message}</p>}
            <button onClick={handleClose}>
              закрыть
            </button>
          </div>
        break;
      default:
        popup = <></>;
    }
    return popup;
  }


  return (
    <>
      {!!message && popupType()}
    </>
  )
}

export default GlobalPopup;

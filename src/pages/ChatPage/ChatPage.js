import React, { useRef, useState, useEffect } from 'react';
import './chat-page.scss'
import { useMessages } from "../../contexts/MessagesContext";
import { Prompt, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ChatPage = () => {
  // ref
  const message = useRef();
  // state
  const [ otherUserId, setOtherUserId ] = useState('');
  const [ showVoiceRecorder, setShowVoiceRecorder ] = useState(true);
  // other
  const history = useHistory();
  const {
    // state
    messages,
    test,
    // text messages actions
    getMessages,
    stopGettingMessages,
    sendMessageHandler,
    // voice messages actions
    start,
    stop,
    handlePermissions
  } = useMessages();
  const { currentUser } = useAuth();

  useEffect(() => {
    setOtherUserId(history.location.pathname.split('/')[2]);
  }, [ history.location.pathname ]);

  useEffect(() => {
    if (otherUserId) getMessages(otherUserId);
  }, [ otherUserId ]);

  // useEffect(() => {
  //   const unListen = history.listen(() => {
  //
  //   });
  //   return () => {
  //     unListen();
  //   }
  // }, []);

  useEffect(() => {
    console.log('message', messages);
  }, [ messages ]);

  return (
    <div className={'chat'}>
      <Prompt
        when={showVoiceRecorder}
        message={((location) => {
          const prevLocation = window.location.href.split('/')[4];
          const nextLocation = location.pathname.split('/')[2];
          if (showVoiceRecorder && prevLocation !== nextLocation) {
            handlePermissions(false);
            stopGettingMessages();
          }
          return true;
        })}
      />
      <div className={'chat-window'}>
        {messages && messages.map(message => (
          // где то здесь нужно считать какой тип сообщения мне пришел и в зависимости от этого выводить просто сообщение или гс или ещё что то
          <div
            key={message.messageId}
            className={message.messageDetails.from.id === currentUser.id
              ? 'my-message'
              : 'other-message'}>
            {/*text message*/}
            {message.messageDetails.type === 'text' &&
            <span>
              {message.messageDetails.message}
            </span>}
            {/*voice message*/}
            {message.messageDetails.type === 'voice' &&
            <div className="App">
              <header className="App-header">
                <audio src={message.messageDetails.url} controls="controls"/>
              </header>
            </div>
            }
          </div>
        ))}
      </div>

      <div className={'chat-input-wrapper'}>
        <input type="text" className={'chat-input'} ref={message} onInput={() => {
          message.current.value.length > 0 ? setShowVoiceRecorder(false) : setShowVoiceRecorder(true);
        }}/>
        {
          showVoiceRecorder ?
            // если нет текста то...
            <input type="checkbox" onClick={event => {
              if (event.target.checked) {
                handlePermissions(true);
                start();
              } else {
                handlePermissions(false);
                stop(message, showVoiceRecorder, otherUserId);
              }
            }}/> :
            // если есть текст то...
            <button onClick={() => {
              sendMessageHandler({ message, showVoiceRecorder, otherUserId });
            }} className={'chat-button'}>Отправить
            </button>
        }
      </div>
    </div>
  )
}

export default ChatPage;

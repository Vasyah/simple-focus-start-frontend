import React, { useRef, useState, useEffect } from 'react';
import './chat-page.scss'
import { useMessages } from "../../contexts/MessagesContext";
import { Link, Prompt, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Icon from '@material-ui/core/Icon';
import classNames from 'classnames';
import LilLoading from "../../components/LilLoading/LilLoading";

const ChatPage = () => {
  // ref
  const message = useRef();
  const chat = useRef();
  // state
  const [ otherUserId, setOtherUserId ] = useState('');
  const [ otherUser, setOtherUser ] = useState({});
  const [ showVoiceRecorder, setShowVoiceRecorder ] = useState(true);
  const [ activeMicro, setActiveMicro ] = useState(false);
  // other
  const history = useHistory();
  const {
    // state
    messages,
    // text messages actions
    getMessages,
    stopGettingMessages,
    sendMessageHandler,
    // voice messages actions
    start,
    stop,
    handlePermissions
  } = useMessages();
  const { currentUser, allUsersWithoutMe } = useAuth();

  useEffect(() => {
    const otherUserId = history.location.pathname.split('/')[2];
    const otherUser = allUsersWithoutMe.find(user => user.id === otherUserId);
    setOtherUserId(otherUserId);
    setOtherUser(otherUser);
  }, [ allUsersWithoutMe, history.location.pathname ]);

  useEffect(() => {
    if (otherUserId) getMessages(otherUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ otherUserId ]);

  useEffect(() => {
    if (allUsersWithoutMe) {

    }
  }, [ allUsersWithoutMe ]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chat.current.scrollTo(0, chat.current.scrollHeight)
    }, 20)
  };

  useEffect(() => {
    // console.log('message', messages);
    scrollToBottom();
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
      <div className={'chat-user'}>
        <div className="chat-user-info">
          <h4 className={'chat-user-name'}>{otherUser && otherUser.name}</h4>
        </div>
        {otherUser && otherUser.online &&
        <Link className={'chat-user-call hover-bg'} to={`/video/${otherUserId}`}>
          <Icon style={{ lineHeight: '30px' }}>phone</Icon>
        </Link>}
      </div>
      <div className={'chat-window'} ref={chat}>
        {messages
          ? messages.map(message => (
            <div
              key={message.messageId}
              className={classNames(
                message.messageDetails.from.id === currentUser.id
                  ? 'my-message'
                  : 'other-message',
                message.messageDetails.type === 'text'
                  ? 'text-message'
                  : 'voice-message'
              )}>
              {/*text message*/}
              {message.messageDetails.type === 'text' &&
              <>
                {message.messageDetails.from.name}: {message.messageDetails.message}
                <span
                  className={'message-time'}>{message.messageDetails.time.hours}:{message.messageDetails.time.minutes}</span>
              </>}
              {/*voice message*/}
              {message.messageDetails.type === 'voice' &&
              <>
                <audio src={message.messageDetails.url} controls="controls"/>
                <span
                  className={'message-time'}>
                {message.messageDetails.time.hours}:{message.messageDetails.time.minutes}
              </span>
              </>
              }
            </div>
          )) : <LilLoading/>}
      </div>
      <div className={'chat-input-wrapper'}>
        <input
          type="text"
          className={'chat-input'}
          ref={message}
          onKeyDown={event => {
            if (event.key === 'Enter' && message.current.value.trim().length > 0) {
              sendMessageHandler({ message, showVoiceRecorder, otherUserId });
              message.current.value = '';
              setShowVoiceRecorder(true);
            }
          }}
          onInput={() => {
            message.current.value.trim().length > 0 ? setShowVoiceRecorder(false) : setShowVoiceRecorder(true);
          }}/>
        {
          showVoiceRecorder ?
            // если нет текста то...
            <>
              <input
                id="micro"
                className={'microphone-input'}
                type="checkbox"
                onClick={event => {
                  if (event.target.checked) {
                    handlePermissions(true);
                    setActiveMicro(true);
                    start();
                  } else {
                    handlePermissions(false);
                    setActiveMicro(false);
                    stop(message, showVoiceRecorder, otherUserId);
                  }
                }}/>
              <label
                htmlFor="micro"
                className={classNames('microphone-label', activeMicro ? 'active' : 'notActive')}>
                <Icon>mic</Icon>
              </label>
            </> :
            // если есть текст то...
            <button onClick={() => {
              sendMessageHandler({ message, showVoiceRecorder, otherUserId });
            }} className={'chat-button'}>
              <Icon>send</Icon>
            </button>
        }
      </div>
    </div>
  )
}

export default ChatPage;

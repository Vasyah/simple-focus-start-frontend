import React, { useRef, useState, useEffect } from 'react';
import './chat-page.scss'
import { useMessages } from "../../contexts/MessagesContext";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ChatPage = () => {
  // ref
  const message = useRef();
  // state
  const [ otherUserId, setOtherUserId ] = useState('');
  const [ localMessages, setLocalMessages ] = useState([]);
  // other
  const history = useHistory();
  const { sendMessage, getMessages, messages } = useMessages();
  const { currentUser } = useAuth();

  const sendMessageHandler = () => {
    if (message.current.value.length <= 0) return;
    const createdAt = new Date();
    const hours = createdAt.getHours()
    const minutesStr = createdAt.getMinutes().toString()
    const minutes = 2 >= minutesStr.length
      ? Array.apply(null, { length: 2 - minutesStr.length + 1 }).join("0") + minutesStr
      : minutesStr.substring(0, 2);
    const months = [
      { string: "January", number: 1 },
      { string: "February", number: 2 },
      { string: "March", number: 3 },
      { string: "April", number: 4 },
      { string: "May", number: 5 },
      { string: "June", number: 6 },
      { string: "July", number: 7 },
      { string: "August", number: 8 },
      { string: "September", number: 9 },
      { string: "October", number: 10 },
      { string: "November", number: 11 },
      { string: "December", number: 12 }
    ];
    const time = {
      date: {
        day: createdAt.getDate(),
        month: months[createdAt.getMonth()],
        year: createdAt.getFullYear()
      },
      hours,
      minutes,
    }
    sendMessage({
      otherUserId,
      messageInfo: {
        message: message.current.value,
        from: {
          name: currentUser.name,
          id: currentUser.id
        },
        time,
      }
    })
  }

  useEffect(() => {
    setOtherUserId(history.location.pathname.split('/')[2]);
  }, [ history.location.pathname ]);

  useEffect(() => {
    console.log('1')
    if (otherUserId) getMessages(otherUserId);
  }, [ otherUserId ]);

  useEffect(() => {
    console.log('messages', messages);
    setLocalMessages(messages);
  }, [ messages ])

  return (
    <div className={'chat'}>
      <div className={'chat-window'}>
        {messages && messages.map(message => (
          <div key={message.messageId}>
            <span
              className={message.messageDetails.from.id === currentUser.id
                ? 'my-message'
                : 'other-message'}>
              {message.messageDetails.message}
            </span>
          </div>
        ))}
      </div>
      <div className={'chat-input-wrapper'}>
        <input type="text" className={'chat-input'} ref={message}/>
        <button onClick={() => {
          sendMessageHandler();
        }} className={'chat-button'}>Отправить
        </button>
      </div>
    </div>
  )
}

export default ChatPage;

import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import { useAuth } from "./AuthContext";
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MessagesContext = React.createContext(undefined, undefined);

export const useMessages = () => useContext(MessagesContext);

let messagesRef;

export function MessagesProvider({ children }) {
  // state
  const [ messages, setMessages ] = useState([]);
  const [ isRecording, setIsRecording ] = useState(false);
  const [ blobURL, setBlobURL ] = useState('');
  const [ isBlocked, setIsBlocked ] = useState(false);
  // other
  const { currentUser } = useAuth();

  // voice messages

  const start = () => {
    // start recording voice
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          setIsRecording(true)
        })
        .catch((e) => console.error(e));
    }
  };

  const stop = (message, showVoiceRecorder, otherUserId) => {
    // stop recording voice
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([ buffer, blob ]) => {
        const blobURL = URL.createObjectURL(blob)
        console.log(blobURL);
        setBlobURL(blobURL);
        setIsRecording(false);
        sendMessageHandler({ message, showVoiceRecorder, otherUserId, blobURL });
      })
      .catch((e) => console.log(e));
  };

  const handlePermissions = (record) => {
    // adaptive for all browsers
    navigator.getUserMedia = (
      navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
    );

    // off mic after voice recorded
    document.querySelectorAll('audio').forEach(item => {
      if (!item.srcObject) return;
      const tracks = item.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
    });
    // set permissions true/false
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setIsBlocked(false);
      },
      () => {
        console.log('Permission Denied');
        setIsBlocked(true);
      },
    );
  }

  // text messages

  const sendMessage = (payload) => {
    // send message to both of users
    firebase.database()
      .ref(`chats/${currentUser.id}/${payload.otherUserId}`)
      .push(payload.messageInfo);
    firebase.database()
      .ref(`chats/${payload.otherUserId}/${currentUser.id}`)
      .push(payload.messageInfo);
  }

  const getMessages = (otherUserId) => {
    // get messages from db
    const newMessages = [];
    messagesRef = firebase.database().ref('chats/' + currentUser.id + '/' + otherUserId);
    messagesRef.on('child_added', snapshot => {
      let messageDetails = snapshot.val();
      let messageId = snapshot.key;
      newMessages.push({
        messageDetails,
        messageId
      })
      Promise.all(newMessages).then(() => {
        // setMessages(() => setMessages(messages));
        setMessages(() => {
          setTimeout(() => setMessages(newMessages));
        });
      })
    })
  }

  const stopGettingMessages = () => {
    // stop getting messages then url changes
    if (messagesRef) {
      messagesRef.off('child_added')
      setMessages([]);
    }
  }

  const sendMessageHandler = (payload) => {
    if (payload.message.current.value.length <= 0 && !payload.showVoiceRecorder) return;
    // set date of message
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

    // set type of message
    let messageType;
    if (payload.showVoiceRecorder && payload.blobURL.length) {
      messageType = 'voice';
      // send voice messages
      sendMessage({
        otherUserId: payload.otherUserId,
        messageInfo: {
          voice: payload.blobURL,
          from: {
            name: currentUser.name,
            id: currentUser.id
          },
          time,
          type: messageType
        }
      })
    } else {
      // send text messages
      setBlobURL('');
      messageType = 'text';
      sendMessage({
        otherUserId: payload.otherUserId,
        messageInfo: {
          image: '',
          message: payload.message.current.value,
          from: {
            name: currentUser.name,
            id: currentUser.id
          },
          time,
          type: messageType
        }
      })
    }
  }

  const value = {
    // state
    messages,
    isRecording,
    blobURL,
    isBlocked,
    // text messages actions
    sendMessage,
    getMessages,
    stopGettingMessages,
    sendMessageHandler,
    // voice messages actions
    start,
    stop,
    handlePermissions
  }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

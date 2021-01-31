import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import { useAuth } from "./AuthContext";
import MicRecorder from 'mic-recorder-to-mp3';
import JSZip from 'jszip';
import uniqId from "uniqid";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MessagesContext = React.createContext(undefined, undefined);

export const useMessages = () => useContext(MessagesContext);

let messagesRef;
let audioMessagesRef;

export function MessagesProvider({ children }) {
  // state
  const [ messages, setMessages ] = useState([]);
  const [ isRecording, setIsRecording ] = useState(false);
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
        setIsRecording(false);
        // set voice file
        const file = new File(buffer, 'music.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });
        console.log('player', URL.createObjectURL(file));

        const uniqIdSaved = uniqId();
        // save voice file in another db
        firebase.storage()
          .ref(`chats/${currentUser.id}/${otherUserId}/${uniqIdSaved}`)
          .put(file)
          .then(snapshot => {
            console.log(snapshot);
            sendMessageHandler({ message, showVoiceRecorder, otherUserId, uniqId: uniqIdSaved });
          });
      })
      .catch((error) => console.log('voice recording error', error));
  };

  const handlePermissions = (record) => {
    // adaptive for all browsers
    navigator.getUserMedia = (
      navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
    );

    // set permissions
    navigator.getUserMedia({ audio: true },
      (stream) => {
        console.log('record', record);
        if (record) {
          console.log('Permission Granted');
          setIsBlocked(false);
        } else {
          stream.getAudioTracks().forEach(track => {
            track.stop();
          })
          // setIsBlocked(true);
        }
      },
      () => {
        console.log('Permission Denied');
        setIsBlocked(true);
      },
    );

    // off mic after voice recorded
    // document.querySelectorAll('audio').forEach(item => {
    //   console.log(item.srcObject);
    //   if (!item.srcObject) return;
    //   const tracks = item.srcObject.getTracks();
    //   tracks.forEach(track => {
    //     track.stop();
    //   });
    // });
  }

  // text messages

  const sendMessage = (payload) => {
    // audio messages
    // firebase.storage()
    //   .ref(`chats/${currentUser.id}/${payload.otherUserId}`)
    //   .put(payload.messageInfo).then();
    // firebase.database()
    //   .ref(`chats/${payload.otherUserId}/${currentUser.id}`)
    //   .push(payload.messageInfo);

    // апихнуть url на моменте пуша в массив

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
    messagesRef = firebase.database().ref(`chats/${currentUser.id}/${otherUserId}`);
    // audioMessagesRef = firebase.storage().ref(`chats/${currentUser.id}/${otherUserId}`);

    // audioMessagesRef.getMetadata().then(metadata => {
    //   console.log(metadata);
    // }).catch(error => {
    //   console.log('metadata error', error);
    // })

    messagesRef.on('child_added', snapshot => {
      let messageDetails = snapshot.val();
      let messageId = snapshot.key;

      newMessages.push({
        messageDetails,
        messageId
      })

      return Promise.all(newMessages).then(() => {
        console.log(newMessages);
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
    if (payload.showVoiceRecorder) {
      messageType = 'voice';
      // надо придумать voiceId какой то чтобы потом тягать по нему файл из базы данных с голосовыми
      // send voice messages
      firebase.storage().ref(`chats/${currentUser.id}/${payload.otherUserId}/${payload.uniqId}`).getDownloadURL().then(url => {
        sendMessage({
          otherUserId: payload.otherUserId,
          messageInfo: {
            from: {
              name: currentUser.name,
              id: currentUser.id
            },
            time,
            type: messageType,
            url
          }
        })
      });
    } else {
      // send text messages
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

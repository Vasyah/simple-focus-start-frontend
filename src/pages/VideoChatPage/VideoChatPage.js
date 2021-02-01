import React, { useEffect, useState, useRef } from 'react';
import './video-chat-page.scss';
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Prompt } from "react-router-dom";
import { useVideo } from "../../contexts/VideoContext";

const VideoChatPage = () => {
  // ref
  const userVideo = useRef();
  const partnerVideo = useRef();
  // state
  const [ otherUserId, setOtherUserId ] = useState('');
  const [ otherUser, setOtherUser ] = useState({});
  // other
  const history = useHistory();
  const {
    // state
    receivingCall,
    callAccepted,
    stream,
    caller,
    // actions
    stopCurrentUserVideo,
    stopCall,
    startVideo,
    callPeer,
    acceptCall
  } = useVideo();
  const { currentUser, allUsersWithoutMe } = useAuth();

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video playsInline muted ref={userVideo} autoPlay/>
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video playsInline ref={partnerVideo} autoPlay/>
    );
  }

  let IncomingCall;
  if (receivingCall && !callAccepted && caller) {
    IncomingCall = (
      <div>
        <button onClick={() => {
          acceptCall(partnerVideo);
        }}>
          Accept
        </button>
      </div>
    )
  }

  useEffect(() => {
    return () => {
      console.log('video unmount')
    }
  }, []);

  useEffect(() => {
    startVideo(userVideo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ currentUser ]);

  useEffect(() => {
    const otherUserId = history.location.pathname.split('/')[2];
    const otherUser = allUsersWithoutMe.find(user => user.id === otherUserId);
    setOtherUserId(otherUserId);
    setOtherUser(otherUser);
  }, [ allUsersWithoutMe, history.location.pathname ]);

  return (
    <div className={'videochat-wrapper container'}>
      <div className={'videochat-control-buttons'}>
        {otherUser && <button onClick={() => {
          callPeer(otherUserId, partnerVideo);
        }}>Позвонить: {otherUser.name}</button>
        }
        <button onClick={() => {
          stopCurrentUserVideo(userVideo.current);
        }}>
          stop video
        </button>
        <button onClick={() => {
          startVideo(userVideo)
        }}>
          start video
        </button>
        <button onClick={() => {
          stopCall(userVideo.current, partnerVideo.current);
        }}>
          stop call
        </button>
      </div>
      <div className={'videochat'}>
        <Prompt
          when={!!stream}
          message={((location) => {
            if (!!stream && location.pathname !== '/video') {
              console.log('webcam stop');
              stopCall(userVideo.current, partnerVideo.current);
            }
            return true;
          })}
        />
        <div>
          {UserVideo}
          {PartnerVideo}
        </div>
        <div>
          {IncomingCall}
        </div>
      </div>
    </div>
  );
}

export default VideoChatPage;

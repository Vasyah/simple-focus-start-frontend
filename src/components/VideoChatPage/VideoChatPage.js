import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import './video-chat-page.scss';
import { useAuth } from "../../contexts/AuthContext";

const VideoChatPage = () => {
  // ref
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  // state
  const [ yourID, setYourID ] = useState("");
  const [ users, setUsers ] = useState({});
  const [ stream, setStream ] = useState();
  const [ receivingCall, setReceivingCall ] = useState(false);
  const [ caller, setCaller ] = useState("");
  const [ callerSignal, setCallerSignal ] = useState();
  const [ callAccepted, setCallAccepted ] = useState(false);
  // other
  const { currentUser } = useAuth();

  useEffect(() => {
    startVideo();
  }, []);

  const stopVideo = () => {
    if (userVideo.current) {
      let tracks = userVideo.current.srcObject.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
      userVideo.current.srcObject = null;
    }
  }

  const stopCall = () => {
    if (userVideo.current && partnerVideo.current) {
      let videos = [];
      videos.push(partnerVideo.current.srcObject.getTracks(), userVideo.current.srcObject.getTracks());
      videos.forEach(tracks => {
        tracks.forEach(function (track) {
          track.stop();
        });
      })
      userVideo.current.srcObject = null;
      partnerVideo.current.srcObject = null;
    }
  }

  const startVideo = () => {
    if (currentUser.id) {
      socket.current = io.connect("/");
      console.log(1)
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })

      // socket.current.on("yourID", (id) => {
      //   setYourID(id);
      // })
      // socket.current.on("allUsers", (users) => {
      //   setUsers(users);
      // })

      socket.current.emit("yourID", currentUser.id);
      socket.current.emit("allUsers", currentUser.id);

      socket.current.on("hey", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      })
    }
  }

  const callPeer = id => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: currentUser.id,
      })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('acceptCall', {
        signal: data,
        to: caller
      })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  const log = () => {
    console.log('partnerVideo', partnerVideo);
    console.log('currentUser', currentUser);
  }

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

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }

  return (
    <div className={'videochat-wrapper container'}>
      <div className={'videochat'}>
        <div>
          {UserVideo}
          {PartnerVideo}
        </div>
        <div>
          {Object.keys(users).map(key => {
            if (key === yourID) {
              console.log(key)
              return null;
            }
            return (
              <button key={yourID} onClick={() => callPeer(key)}>Call {key}</button>
            );
          })}
          <button onClick={stopVideo}>stop video</button>
          <button onClick={startVideo}>start video</button>
          <button onClick={stopCall}>stop call</button>
          <button onClick={log}>log something</button>
        </div>
        <div>
          {incomingCall}
        </div>
      </div>
    </div>
  );
}

export default VideoChatPage;

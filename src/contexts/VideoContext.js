import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase';
import { useAuth } from "./AuthContext";
import io from "socket.io-client";
import Peer from "simple-peer";

const VideoContext = React.createContext();

export const useVideo = () => useContext(VideoContext);

export function VideoProvider({ children }) {
  // state
  const [ stream, setStream ] = useState();
  const [ receivingCall, setReceivingCall ] = useState(false);
  const [ caller, setCaller ] = useState("");
  const [ callerSignal, setCallerSignal ] = useState();
  const [ callAccepted, setCallAccepted ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  // other
  const { currentUser } = useAuth();

  const stopCurrentUserVideo = (userVideo) => {
    if (userVideo && userVideo.srcObject) {
      console.log('userVideo', userVideo)
      let tracks = userVideo.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      userVideo.srcObject = null;
    }
  }

  const stopOtherUserVideo = (partnerVideo) => {
    if (partnerVideo && partnerVideo.srcObject) {
      console.log('partnerVideo', partnerVideo)
      let tracks = partnerVideo.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      partnerVideo.srcObject = null;
    }
  }

  const stopCall = (userVideo, partnerVideo) => {
    stopCurrentUserVideo(userVideo);
    stopOtherUserVideo(partnerVideo);
    setCallAccepted(false);
    setReceivingCall(false);
  }

  const startVideo = (socket, userVideo) => {
    if (currentUser) {
      socket.current = io.connect("/");
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        socket.current.emit("yourID", currentUser.id);
        socket.current.emit("allUsers", currentUser.id);

        socket.current.on("hey", (data) => {
          setReceivingCall(true);
          setCaller(data.from);
          setCallerSignal(data.signal);
        })
      })
    }
  }

  const callPeer = (id, socket, partnerVideo) => {
    console.log('срабатывает у того кто звонит');
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('callUser', {
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

  const acceptCall = (socket, partnerVideo) => {
    console.log('срабатывает у того кому звонят')
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

  const value = {
    // state
    receivingCall,
    callAccepted,
    stream,
    caller,
    // actions
    stopCurrentUserVideo,
    stopOtherUserVideo,
    stopCall,
    startVideo,
    callPeer,
    acceptCall,
  }

  return (
    <VideoContext.Provider value={value}>
      {!loading && children}
    </VideoContext.Provider>
  )
}

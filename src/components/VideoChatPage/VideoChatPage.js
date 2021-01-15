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
    if (this.currentUser.id) {
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

      socket.current.emit("yourID", currentUser.userId);
      socket.current.emit("allUsers", currentUser.userId);

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

  // old
  // const callPeer = (id) => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: this.stream,
  //   })
  //
  //   peer.on('signal', data => {
  //     this.socket.emit('callUser', {
  //       userToCall: id,
  //       signalData: data,
  //       from: this.userDetails.userId,
  //     })
  //   })
  //
  //   peer.on('stream', stream => {
  //     if (this.$refs.partnerVideo) {
  //       this.$refs.partnerVideo.srcObject = stream
  //     }
  //   })
  //
  //   this.socket.on('callAccepted', signal => {
  //     this.callAccepted = true
  //     peer.signal(signal)
  //   })
  // }

  // const acceptCall = () => {
  //   this.callAccepted = true
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: this.stream
  //   })
  //
  //   peer.on('signal', data => {
  //     this.socket.emit('acceptCall', {
  //       signal: data,
  //       to: this.caller
  //     })
  //   })
  //
  //   peer.on('stream', stream => {
  //     this.$refs.partnerVideo.srcObject = stream
  //   })
  //
  //   peer.signal(this.callerSignal)
  // }

  // const setVideo = () => {
  //   if (this.userDetails.userId) {
  //     // [this.video, this.audio] = [true, true]
  //     this.socket = io.connect('http://localhost:8000')
  //     navigator.mediaDevices.getUserMedia({ video: this.video, audio: this.audio }).then(stream => {
  //       this.stream = stream
  //       if (this.$refs.userVideo) {
  //         this.$refs.userVideo.srcObject = stream
  //       }
  //     }).catch(error => console.error(error))
  //
  //     this.socket.emit("yourID", this.userDetails.userId);
  //     this.socket.emit("allUsers", this.userDetails.userId);
  //
  //     this.socket.on('hey', data => {
  //       this.receivingCall = true
  //       this.caller = data.from
  //       this.callerSignal = data.signal
  //     })
  //   }
  // }

  // old

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

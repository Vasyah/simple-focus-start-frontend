import React, { useEffect, useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const AudioMessage = () => {
  // state
  const [ isRecording, setIsRecording ] = useState(false);
  const [ blobURL, setBlobURL ] = useState('');
  const [ isBlocked, setIsBlocked ] = useState(false);
  // other
  // const start = () => {
  //   if (isBlocked) {
  //     console.log('Permission Denied');
  //   } else {
  //     Mp3Recorder
  //       .start()
  //       .then(() => {
  //         setIsRecording(true)
  //       }).catch((e) => console.error(e));
  //   }
  // };
  //
  // const stop = () => {
  //   Mp3Recorder
  //     .stop()
  //     .getMp3()
  //     .then(([ buffer, blob ]) => {
  //       const blobURL = URL.createObjectURL(blob)
  //       console.log(blobURL);
  //       setBlobURL(blobURL);
  //       setIsRecording(false);
  //     }).catch((e) => console.log(e));
  // };

  // const handlePermissions = () => {
  //   navigator.getUserMedia({ audio: true },
  //     () => {
  //       console.log('Permission Granted');
  //       setIsBlocked(false);
  //     },
  //     () => {
  //       console.log('Permission Denied');
  //       setIsBlocked(true);
  //     },
  //   );
  // }

  useEffect(() => {
    // handlePermissions();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <audio src={blobURL} controls="controls"/>
      </header>
    </div>
  )
}

export default AudioMessage;

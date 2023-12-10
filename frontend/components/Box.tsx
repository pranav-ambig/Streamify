"use client";
import axios from 'axios';
import React, { MouseEventHandler, use, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { SERVER_BASE_URL } from '@/app/page';



const Box = () => {

  const constraints = {
    video : {
      cursor: 'always',
      displaySurface: 'monitor',
    }
  }

  const [Streams, setStreams] = useState({StreamIDs: []});
  const [UserID, setUserID] = useState("");

  const getScreenVideo = () =>{
    navigator.mediaDevices.getDisplayMedia(constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream);
          const vid : HTMLVideoElement = document.querySelector('#stream') as HTMLVideoElement
          vid.srcObject = stream
          // console.log(stream)
      })
      .catch(error => {
          console.error('Error accessing media devices.', error);
      });
  }

  const getRemoteClientID = ()=>{
    console.log('sending')
    axios.post(SERVER_BASE_URL+'/api/getStreamIDs', 
      {
        userID: UserID
      }
    )
    .then((res)=>{
      console.log(res.data.StreamIDs)
      setStreams(res.data)
    })
  }

  // const createSignalChannel = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
  //   let remoteClientId = (e.target as HTMLParagraphElement).innerText;

  //   const signalingChannel = new SignalingChannel(remoteClientId);
  //   signalingChannel.addEventListener('message', message => {
  //       // New message from remote client received
  //   });

  //   // Send an asynchronous message to the remote client
  //   signalingChannel.send('Hello!');
  // }

  useEffect(()=>{
    axios.get(SERVER_BASE_URL+'/api/register')
    .then((res)=>{
      setUserID(res.data)
      console.log(res.data)
    })
  }, [])

  return (
    <div className='flex flex-col items-center justify-evenly max-w-[50vw] min-h-[50vh] gap-4'>
      <h1>Preview</h1>
      <div id="stream-ctn" className='w'>
        <video id='stream' autoPlay playsInline controls={true}></video>
      </div>
      <button className='bg-red-200 hover:bg-red-400 px-10 py-4 rounded-full' onClick={getScreenVideo}>Start Sharing</button>
      <button className='bg-red-200 hover:bg-red-400 px-10 py-4 rounded-full' onClick={getRemoteClientID}>Send req</button>
      {Streams.StreamIDs.map((StreamID)=>{
        return (
          <p key={StreamID} onClick={createSignalChannel}>{StreamID}</p>
        )
      })}
    </div>
  )
}

export default Box
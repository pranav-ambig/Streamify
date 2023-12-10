"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SERVER_BASE_URL, ICE_CONFIG } from '../page';

const SetupStream = () => {

  const constraints = {
    video : {
      cursor: 'always',
      displaySurface: 'window',
    }
  }

  const [UserID, setUserID] = useState("");

  const sendOffer = async () => {
    // initiate a peer connection and send offer details to server for storage

    const peerConnection = new RTCPeerConnection(ICE_CONFIG);
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    axios.post(SERVER_BASE_URL+'/api/registerStream', {
      sourceDesc : offer
    })

  }

  const getScreenVideo = () =>{
    navigator.mediaDevices.getDisplayMedia(constraints)
      .then(stream => {
          // Once video is available, set video element
          console.log('Got MediaStream:', stream);
          const vid : HTMLVideoElement = document.querySelector('#stream') as HTMLVideoElement
          vid.srcObject = stream

          // create and send an offer
          sendOffer()

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
      console.log(res)
      // setStreams(res.data)
    })
  }

  const createSignalChannel = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    // let remoteClientId = (e.target as HTMLParagraphElement).innerText;

    // const signalingChannel = new SignalingChannel(remoteClientId);
    // signalingChannel.addEventListener('message', message => {
    //     // New message from remote client received
    // });

    // // Send an asynchronous message to the remote client
    // signalingChannel.send('Hello!');
  }

  // useEffect(()=>{
    
  // }, [])


  return (
    <div className='flex flex-col items-center justify-evenly w-screen h-screen gap-4'>
      <h1>Preview</h1>
      <div id="stream-ctn" className='w-1/2'>
        <video id='stream' className='mx-auto object-contain' autoPlay playsInline controls={true}></video>
      </div>
      <button className='bg-red-200 hover:bg-red-400 px-10 py-4 rounded-full' onClick={getScreenVideo}>New Stream</button>
      {/* <button className='bg-red-200 hover:bg-red-400 px-10 py-4 rounded-full' onClick={getRemoteClientID}>Send req</button> */}
      
    </div>
  )
}

export default SetupStream
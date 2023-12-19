"use client";


import axios from 'axios';
import React from 'react'
import { SERVER_BASE_URL, socket, ICE_CONFIG } from '../../core/constants';

const SetupStream = () => {

  const constraints = {
    video : {
      cursor: 'always',
      displaySurface: 'window',
    }
  }
  let peerConnection: RTCPeerConnection, localDescription: RTCSessionDescription;

  
  const initSocketConn = ()=>{

    socket.connect()

    // event handlers
    socket.on('offer', async (offer)=>{
      const serverDesc = offer.serverDesc;
      await peerConnection.setRemoteDescription(serverDesc);
      console.log('set remote desc!')
    })
  }

  const initPeerConnWithServer = async () => {

    // Setup a peer connection for server to connect to
    peerConnection = new RTCPeerConnection(ICE_CONFIG)
    const offer = await peerConnection.createOffer()
    localDescription = new RTCSessionDescription(offer)
    await peerConnection.setLocalDescription(localDescription)

    // register this stream
    axios.post(SERVER_BASE_URL+'/api/registerStream', {
      streamerDesc : localDescription
    })
    .then(async (res)=>{
      // res has serverDesc and streamID
      let {serverDesc, streamID} = res.data;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(serverDesc))

      // after setting remote desc, send a socket event to register for signalling
      console.log('sending register')
      if (!socket.connected){
        socket.connect()
      }
      socket.on("connect", ()=>{
        socket.emit("signal-register", streamID)
      })
    })
  }

  const getScreenVideo = () =>{
    navigator.mediaDevices.getDisplayMedia(constraints)
      .then(stream => {
          // Once video is available, set video element
          const vid : HTMLVideoElement = document.querySelector('#stream') as HTMLVideoElement
          vid.srcObject = stream

          // handle stream end
          const [track] = stream.getTracks();
          track.addEventListener('ended', ()=>{
            socket.disconnect();
            console.log('stream ended')
          })
      })
      .catch(error => {
          console.error('Error accessing media devices.', error);
      });
  }

  // const getRemoteClientID = ()=>{
  //   console.log('sending')
  //   axios.post(SERVER_BASE_URL+'/api/getStreamIDs', 
  //     {
  //       userID: UserID
  //     }
  //   )
  //   .then((res)=>{
  //     console.log(res)
  //     // setStreams(res.data)
  //   })
  // }

  const initStream = ()=>{
    getScreenVideo()
    initPeerConnWithServer()
    // initSocketConn()
  }


  return (
    <div className='flex flex-col items-center justify-evenly w-screen h-screen gap-4'>
      <h1>Preview</h1>
      <div id="stream-ctn" className='w-1/2'>
        <video id='stream' className='mx-auto object-contain' autoPlay playsInline controls={true}></video>
      </div>
      <button className='bg-red-200 hover:bg-red-400 active:bg-red-500 px-10 py-4 rounded-full' onClick={initStream}>New Stream</button>
      {/* <button className='bg-red-200 hover:bg-red-400 px-10 py-4 rounded-full' onClick={getRemoteClientID}>Send req</button> */}
      
    </div>
  )
}

export default SetupStream
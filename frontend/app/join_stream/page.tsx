"use client";

import React, { useEffect, useState } from 'react'
import { SERVER_BASE_URL, socket, ICE_CONFIG } from '../../core/constants';
import axios from 'axios';

// stream id -> {streamerDesc: string, streamerSocketID: string}
type streamDescriptions = {
  [StreamID: string]: {
    streamerDesc: RTCSessionDescriptionInit,
    streamerSocketID?: string
  }
}


const JoinStream = () => {

  let [AvailableStreams, setAvailableStreams] = useState<streamDescriptions>({});

  // On page load, get available streams
  // TODO_P5: Make this dynamic using sockets
  useEffect(()=>{
    axios.get(SERVER_BASE_URL+'/api/getStreamIDs')
    .then((res)=>{
      setAvailableStreams(res.data)
    })
  }, [])

  const joinStream = async (StreamToJoin: string) => {
    // do ice stuff here
    const {streamerDesc, streamerSocketID} = AvailableStreams[StreamToJoin];

    console.log(typeof streamerDesc, streamerDesc)
    
    const peerConnection = new RTCPeerConnection(ICE_CONFIG)
    const offer = await peerConnection.createOffer()
    const localDescription = new RTCSessionDescription(offer)
    await peerConnection.setLocalDescription(localDescription)
    await peerConnection.setRemoteDescription(streamerDesc)

    console.log('remote desc set!')

  }

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-8'>
      <div>JoinStream</div>
  
      {Object.keys(AvailableStreams).map((StreamID: string)=>{
        return (
          <p key={StreamID} onClick={()=>joinStream(StreamID)}>{StreamID}</p>
        )
      })}
    </div>
    
  )
}

export default JoinStream
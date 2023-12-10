"use client";

import React, { useEffect, useState } from 'react'
import { SERVER_BASE_URL } from '../page'
import axios from 'axios';

type StreamDescriptionsObject = {
  [StreamID: string]: Object
}


const JoinStream = () => {

  let [AvailableStreams, setAvailableStreams] = useState<StreamDescriptionsObject>({});

  // On page load, get available streams
  useEffect(()=>{
    axios.get(SERVER_BASE_URL+'/api/getStreamIDs')
    .then((res)=>{
      setAvailableStreams(res.data)
    })
  }, [])

  const joinStream = (StreamToJoin: string) => {
    // do ice stuff here
    const StreamToJoinDesc = AvailableStreams[StreamToJoin];
    
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
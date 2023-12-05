"use client";
import React, { MouseEventHandler, use, useEffect, useState } from 'react'

const Box = () => {


  // const [IsSharing, setIsSharing] = useState(false);

  const constraints = {
    video : {
      cursor: 'always',
      displaySurface: 'monitor',
    }
  }

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

  // useEffect(()=>{
    
  // }, [])

  return (
    <div className='flex flex-col items-center justify-evenly max-w-[50vw] min-h-[50vh] gap-4'>
      <h1>Preview</h1>
      <div id="stream-ctn" className='w'>
        <video id='stream' autoPlay playsInline controls={true}></video>
      </div>
      <button className='bg-red-200 hover:bg-red-400 p-4 rounded-full' onClick={getScreenVideo}>Start Sharing</button>
    </div>
  )
}

export default Box
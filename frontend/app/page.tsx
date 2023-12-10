import Box from '@/components/Box'
import Image from 'next/image'
import Link from 'next/link'


export const SERVER_BASE_URL = 'http://localhost:5052'
export const ICE_CONFIG = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

export default function Home() {
  return (
    <main className="flex flex-col items-center p-16 min-h-screen">
      <h1 className='text-3xl'>Streamify</h1>
      <div className='mt-12 flex flex-col gap-8 items-center'>
        <Link href="/join_stream" className='text-xl'>Join Stream</Link>
        <Link href="/setup_stream" className='text-xl' >Setup Stream</Link>
      </div>
    </main>
  )
}

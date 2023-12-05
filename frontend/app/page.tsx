import Box from '@/components/Box'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex flex-col items-center p-16 min-h-screen">
      <h1 className='text-3xl'>Streamify</h1>
      <div className='mt-12'>
        <Box></Box>
      </div>
    </main>
  )
}

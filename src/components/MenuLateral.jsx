import React from 'react'
import Logo from './Menu/Logo'

export default function MenuLateral() {
  return (
    <div className='w-[5%] h-full hidden lg:flex flex-col min-h-screen bg-[#066396] px-4 py-2 items-center'>
      <Logo/>
    </div>
  )
}

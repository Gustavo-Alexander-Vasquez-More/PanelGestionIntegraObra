import React from 'react'
import NombreRuta from './Navbar/NombreRuta'

export default function NavBarMobile() {
  return (
    <div className='w-[95%] fixed flex lg:hidden py-3 px-4 justify-between items-center bg-[#F48437] shadow-2xl'>
            <NombreRuta/>
        </div>
  )
}

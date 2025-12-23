import React from 'react'
import NombreRuta from './Navbar/NombreRuta'
import PerfilUser from './Navbar/PerfilUser'

export default function NavBarSuperior() {
  return (
    <div className='w-[95%] fixed hidden lg:flex py-3 px-4 justify-between items-center bg-[#F48437] shadow-2xl'>
        <NombreRuta/>
        <PerfilUser/>
    </div>
  )
}

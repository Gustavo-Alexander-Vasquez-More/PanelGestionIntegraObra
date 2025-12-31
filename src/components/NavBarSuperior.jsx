import React from 'react'
import PerfilUser from './Navbar/PerfilUser'
import { MenuHamburguesa, MenuPanelLateral } from './Navbar/MenuNavegacion'

export default function NavBarSuperior() {
  const [openMenu, setOpenMenu] = React.useState(false);
  return (
    <>
      <div className='w-full fixed hidden lg:flex py-3 px-4 justify-between items-center bg-[#F48437] shadow-2xl z-40'>
        <MenuHamburguesa onClick={() => setOpenMenu(true)} />
        <PerfilUser/>
      </div>
      <MenuPanelLateral open={openMenu} setOpen={setOpenMenu} />
    </>
  )
}

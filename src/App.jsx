import './App.css'
import MenuLateral from './components/MenuLateral'
import NombreRuta from './components/Navbar/NombreRuta'
import PerfilUser from './components/Navbar/PerfilUser'
import NavBarSuperior from './components/NavBarSuperior'
import Router from './Router'

function App() {
  return (
    <div className='flex h-screen'>
      <MenuLateral/>
      <div className='w-full h-screen overflow-y-auto flex flex-col bg-gray-100'>
        <NavBarSuperior/>
        <div className='w-full invisible flex py-3 px-4 justify-between items-center bg-[#F48437] shadow-2xl'>
            <NombreRuta/>
            <PerfilUser/>
        </div>
        <Router/>
      </div>
    </div>
  )
}

export default App

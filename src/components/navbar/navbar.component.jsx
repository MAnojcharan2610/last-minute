import './navbar.styles.scss'
import { Fragment, useState } from 'react';
import LogoSvg from '../../assets/hotel-2-svgrepo-com.svg'
import { Outlet } from 'react-router-dom';

const Navbar = () => {

        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const toggleMenu = () => {
          setIsMenuOpen(!isMenuOpen);
        };
      
        return (
            <Fragment>
          <nav className="navbar">
            <div className="navbar-container">
              <img src={LogoSvg} width={"40px"} />
              <div className="navbar-logo">
                <a href="/">ROOMS AND TRAVELS</a>
              </div>
      
              <div 
                className={`menu-icon ${isMenuOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </div>
      
              <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                <li className="nav-item">
                  <a href="/rooms" className="nav-link">Rooms</a>
                </li>
                <li className="nav-item">
                  <a href="/travels" className="nav-link">Travels</a>
                </li>
                <li className="nav-item">
                  <a href="/user" className="nav-link">User</a>
                </li>
              </ul>
            </div>
          </nav>
          <Outlet/>
          </Fragment>
     );
}
 
export default Navbar;
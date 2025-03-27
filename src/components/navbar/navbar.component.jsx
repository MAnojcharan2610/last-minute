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
                  <a href="/home" className="nav-link">Home</a>
                </li>
                <li className="nav-item">
                  <a href="/about" className="nav-link">About</a>
                </li>
                <li className="nav-item">
                  <a href="/contact" className="nav-link">Contact</a>
                </li>
              </ul>
            </div>
          </nav>
          <Outlet/>
          </Fragment>
     );
}
 
export default Navbar;
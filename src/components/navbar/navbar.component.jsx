import './navbar.styles.scss'
import { Fragment, useState, useEffect } from 'react';
import LogoSvg from '../../assets/hotel-2-svgrepo-com.svg'
import { Outlet, useLocation, Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const router = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navLinks = [
        { path: '/rooms', label: 'Rooms' },
        { path: '/travels', label: 'Travels' },
        { path: '/user', label: 'User' },
        { path: '/my-bookings', label: 'My bookings' },
    ];

    return (
        <Fragment>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <div className="navbar-brand">
                        <img src={LogoSvg} alt="Logo" width="40px" onClick={()=>router('/')} />
                        <Link to="/" className="navbar-logo">
                            ROOMS AND TRAVELS
                        </Link>
                    </div>

                    <div 
                        className={`menu-icon ${isMenuOpen ? 'open' : ''}`} 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        {navLinks.map((link) => (
                            <li 
                                key={link.path} 
                                className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                <Link to={link.path} className="nav-link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <Outlet/>
        </Fragment>
    );
}
 
export default Navbar;
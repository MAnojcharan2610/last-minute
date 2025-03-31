import './travels.styles.scss';
import { useState, useEffect } from 'react';
import { travelsObject } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { MdLocationOn, MdDirectionsBus, MdAcUnit, MdAccessTime, MdRoute } from 'react-icons/md';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const travelBusRoutes = ['chennai to banglore', 'chennai to hyderabad', 'hyderabad to banglore', 'hyderabad to chennai', 'banglore to chennai', 'banglore to hyderabad'];

const Travels = () => {
    const [selectedRoute, setSelectedRoute] = useState('hyderabad to banglore');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const filteredTravels = selectedRoute 
        ? travelsObject.filter(travel => travel.route.toLowerCase() === selectedRoute.toLowerCase())
        : [];

    useEffect(() => {
        if (selectedRoute) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
        }
    }, [selectedRoute]);

    const handleTravelSelect = (travel) => {
        navigate('/booking', { state: { travel } });
    };

    return (
        <div className="travels-selection-container">
            <div className="route-selector">
                <h2>Select Route</h2>
                <p className="subtitle">Choose your preferred bus route to view available buses</p>
                <div className="route-buttons">
                    {travelBusRoutes.map(route => (
                        <button 
                            key={route}
                            className={`route-btn ${selectedRoute === route ? 'active' : ''}`}
                            onClick={() => setSelectedRoute(route)}
                            aria-label={`Select ${route} route`}
                        >
                            <MdLocationOn className="route-icon" />
                            {route.charAt(0).toUpperCase() + route.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {selectedRoute && (
                <div className="travels-grid">
                    <div className="travels-header">
                        <h3>Available Buses on {selectedRoute.charAt(0).toUpperCase() + selectedRoute.slice(1)} Route</h3>
                        <p className="bus-count">{filteredTravels.length} buses found</p>
                    </div>

                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading buses...</p>
                        </div>
                    ) : (
                        <div className="travels-container">
                            {filteredTravels.map((travel, index) => (
                                <div 
                                    key={index} 
                                    className="travel-card"
                                    onClick={() => handleTravelSelect(travel)}
                                >
                                    <div className="travel-image-container">
                                        <img 
                                            src={travel.busImg} 
                                            alt={`Bus ${travel.busNo} - ${travel.busName}`} 
                                            className="travel-image" 
                                        />
                                        <div className="travel-overlay">
                                            <span className="book-now">Book Now</span>
                                        </div>
                                    </div>
                                    <div className="travel-details">
                                        <div className="travel-header">
                                            <h4>{travel.busName || 'Unnamed Bus'}</h4>
                                            <span className="bus-number">Bus {travel.busNo}</span>
                                        </div>
                                        <div className="travel-info">
                                            <div className="info-item">
                                                <MdDirectionsBus className="info-icon" />
                                                <p><strong>Bus Type:</strong> {travel.busType}</p>
                                            </div>
                                            <div className="info-item">
                                                <MdAcUnit className="info-icon" />
                                                <p><strong>AC:</strong> {travel.isAcAvailable.toUpperCase()}</p>
                                            </div>
                                            <div className="info-item">
                                                <FaIndianRupeeSign className="info-icon" />
                                                <p><strong>Cost:</strong> {travel.busCost}</p>
                                            </div>
                                            <div className="info-item">
                                                <MdAccessTime className="info-icon" />
                                                <p><strong>Trip Time:</strong> {travel.tripTime}</p>
                                            </div>
                                            <div className="info-item">
                                                <MdRoute className="info-icon" />
                                                <p><strong>Via:</strong> {travel.via}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
 
export default Travels;
import './travels.styles.scss';
import { useState } from 'react';
import { travelsObject } from '../../utils/helpers';

const travelBusRoutes=['chennai to banglore','chennai to hyderabad','hyderabad to banglore','hyderabad to chennai','banglore to chennai','banglore to hyderabad'];

const Travels = () => {

    const [selectedRoute, setSelectedRoute] = useState('');

    const filteredTravels = selectedRoute 
      ? travelsObject.filter(travel => travel.route.toLowerCase() === selectedRoute.toLowerCase())
      : [];

    return (
        <div className="travels-selection-container">
          <div className="route-selector">
            <h2>Select Route</h2>
            <div className="route-buttons">
              {travelBusRoutes.map(route => (
                <button 
                  key={route}
                  className={`route-btn ${selectedRoute === route ? 'active' : ''}`}
                  onClick={() => setSelectedRoute(route)}
                >
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                </button>
              ))}
            </div>
          </div>
    
          {selectedRoute && (
            <div className="travels-grid">
              <h3>Available Travels on {selectedRoute.charAt(0).toUpperCase() + selectedRoute.slice(1)} Route</h3>
              <div className="travels-container">
                {filteredTravels.map((travel, index) => (
                  <div key={index} className="travel-card">
                    <img src={travel.busImg} alt={`Bus ${travel.busNo}`} className="travel-image" />
                    <div className="travel-details">
                      <h4>{travel.busName || 'Unnamed Bus'} - {travel.busNo}</h4>
                      <div className="travel-info">
                        <p><strong>Bus Type:</strong> {travel.busType}</p>
                        <p><strong>AC:</strong> {travel.isAcAvailable.toUpperCase()}</p>
                        <p><strong>Cost:</strong> {travel.busCost}</p>
                        <p><strong>Trip Time:</strong> {travel.tripTime}</p>
                        <p><strong>Via:</strong> {travel.via}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
}
 
export default Travels;
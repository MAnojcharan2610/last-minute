import './user.styles.scss';
import { useUserContext } from '../../contexts/user.context';
import { useState } from 'react';
import { signOutUser } from '../../utils/firebase';

const User = () => {
    const { user } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOutUser();
        } catch (error) {
            console.error('Sign out failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='user-container'>
            <div className='user-card'>
                <div className='user-header'>
                    <h2>User Profile</h2>
                </div>
                
                <div className='user-content'>
                    <div className='user-avatar'>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" />
                        ) : (
                            <div className='avatar-placeholder'>
                                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                    </div>
                    
                    <div className='user-details'>
                        <div className='detail-item'>
                            <span className='label'>Name:</span>
                            <span className='value'>{user?.displayName || 'Not provided'}</span>
                        </div>
                        
                        <div className='detail-item'>
                            <span className='label'>Email:</span>
                            <span className='value'>{user?.email || 'Not provided'}</span>
                        </div>
                        
                        <div className='detail-item'>
                            <span className='label'>User ID:</span>
                            <span className='value'>{user?.uid || 'Not available'}</span>
                        </div>
                    </div>
                </div>
                
                <div className='user-actions'>
                    <button 
                        className='sign-out-button' 
                        onClick={handleSignOut}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default User;
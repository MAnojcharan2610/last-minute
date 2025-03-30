import './login.styles.scss';
import LoginImg from '../../assets/login-img.png';
import { FaGoogle } from "react-icons/fa6";
import { signInWithGooglePopup } from '../../utils/firebase';

const Login = () => {
    return (
        <div className='login-container'>
            <div className='login-card'>
                <div className='login-image'>
                    <img src={LoginImg} alt="Login" />
                </div>
                <div className='login-content'>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your account</p>
                    <button 
                        className='google-btn'
                        onClick={signInWithGooglePopup}
                    >
                        <FaGoogle />
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
import './login.styles.scss'
import LoginImg from '../../assets/login-img.png'
import { FaGoogle } from "react-icons/fa6";
import { signInWithGooglePopup } from '../../utils/firebase';

const Login = () => {
    return ( 
        <div className='login-div'>
            <div className='img'>
                <img src={LoginImg} />
            </div>
                <button onClick={signInWithGooglePopup}> <FaGoogle/> Sign In</button>
        </div>
     );
}
 
export default Login;
import "../components/login.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState ,useRef} from "react";
import axios from "axios";
export default function Register({setshowLogin,mystorage,setCurrUser}) {
  const [failure,setFailure]=useState(false);
  const userRef= useRef();
  const passwordRef= useRef();
  const handleClick = async(e)=>{
    e.preventDefault();
    const user={
      username:userRef.current.value,
      password:passwordRef.current.value
    }
    try{
      const res= await axios.post("https://web-server2-0cgj.onrender.com//api/users/login",user);
      mystorage.setItem("user",res.data.username)
      setCurrUser(res.data.username)
      setshowLogin(false);
      setFailure(false);
    }catch(err){
      console.log(err);
      setFailure(true);
    }
  }
  return (
    <div className="loginContainer">
        <div className="logo">
            <LocationOnIcon/>
            Map Pin
           </div>
            <form onSubmit={handleClick}>
                <input type="text"  placeholder="username" ref={userRef}/>
                <input type="text" placeholder="password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {failure && <span className="failure">Something went wrong!</span>}
                </form>
                <CancelIcon className="loginCancel" onClick={()=>{setshowLogin(false)}}/>
    </div>
  );
}

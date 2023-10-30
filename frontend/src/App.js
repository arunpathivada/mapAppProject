
import * as React from 'react';
import Map, { Marker ,Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import "./app.css"
import axios from 'axios';
import {format} from "timeago.js";
import { useState,useEffect } from 'react';
import Register from "./components/Register";
import Login from "./components/login"

function App() {
  const st={longitude: -100,
    latitude: 40,
    zoom: 3.5}
  const mystorage=window.localStorage;
  const [currUser,setCurrUser]=useState(mystorage.getItem("user"));
  const [popupid,setpopupid]=useState(null);
  const [pins,setPins]=useState([]);
  const [newPlace,setNewPlace]=useState(null);
  const [rating,setRating]=useState(0);
  const [title,setTitle]=useState(null);
  const [desc,setDesc]=useState(null);
  const [viewport, setViewport] = useState(st);
  const [showLogin,setshowLogin]=useState(false);
  const [showRegister,setshowRegister]=useState(false);

  useEffect(()=>{
    const getPins= async ()=>{
       try{
        const res = await axios.get("http://localhost:8000/api/pins");
        setPins(res.data);
       }catch(err){
        console.log(err);
       }
    }
    getPins();
  },[]);

  const handleMarkerClick=(id,lat,long)=>{

    setpopupid(id);
    setViewport({ longitude: long, latitude: lat, zoom: 4 });

  }
  const handleDClick=(e)=>{
    const {lng,lat}=e.lngLat;
    setNewPlace({lat,long:lng});
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    const newPin={
      username:currUser,
      title:title,
      desc:desc,
      rating:rating,
      lat:newPlace.lat,
      long:newPlace.long
    }
    try{
      const res = await axios.post("http://localhost:8000/api/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);

    }catch(err){
      console.log(err);
    }
  }
  const handleclickLogout =()=>{
    mystorage.removeItem("user");
    setCurrUser(null);
  }
  return (
    <div className='mapContainer'>
    <Map
      mapLib={import('mapbox-gl')}
      initialViewState={viewport}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken='pk.eyJ1IjoiYXJ1bnBhdGhpdmFkYSIsImEiOiJjbG5tb2JrZ24wMHJtMmpudDk3czd3MXc2In0.8CSx5e2uJYTFlw9c00joEA'
      onDblClick={handleDClick}
      transitionDuration="200"
    >

      
      {pins.map((pin) => (
  <Marker longitude={pin.long} latitude={pin.lat} anchor="bottom" key={pin._id}>
    <LocationOnIcon 
    style={{color:pin.username===currUser?"tomato":"slateblue",cursor:"pointer"}}
    onClick={()=>handleMarkerClick(pin._id,pin.lat,pin.long)}
    />
    {pin._id === popupid && 
    (<Popup
      longitude={pin.long}
      latitude={pin.lat}
      anchor="left"
      closeButton={true}
      closeOnClick={false}
      key={pin.id}
      onClose={()=>setpopupid(null)}
    >
      <div className='card'>
        <label>Place</label>
        <h4 className='place'>{pin.title}</h4>
        <label>Review</label>
        <p className='desc'>{pin.desc}</p>
        <label>Rating</label>
        <div className='stars'>
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
        <label>Information</label>
        <span className='username' >Created by <b>{pin.username}</b></span>
        <span className='date'>{format(pin.createdAt)}</span>
      </div>
    </Popup>)
}
  </Marker>
))}


{newPlace &&(
<Popup
      longitude={newPlace.long}
      latitude={newPlace.lat}
      anchor="left"
      closeButton={true}
      closeOnClick={false}
      onClose={()=>setNewPlace(null)}
    >
      <div>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input placeholder='Enter a title' onChange={(e)=>{setTitle(e.target.value)}}/>
          <label>Review</label>
          <textarea placeholder='Say something about this place' onChange={(e)=>{setDesc(e.target.value)}}/>
          <label>Rating</label>
          <select onChange={(e)=>{setRating(e.target.value)}}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select >
          <button className='submitButton' type="submit">Add pin</button>
        </form>
      </div>
      </Popup>



      )}
      {currUser ?(<button className='button logout' onClick={handleclickLogout}>Logout</button>):(<div className='buttons'>
      <button className='button login' onClick={()=>setshowLogin(true)}>Login</button>
      <button className='button register' onClick={()=>setshowRegister(true)}>Register</button>
      </div>)}
      {showLogin && <Login setshowLogin={setshowLogin} mystorage={mystorage} setCurrUser={setCurrUser}/> }
      {showRegister && <Register setshowRegister={setshowRegister}/> }
      
    </Map>
    </div>
  );
}

export default App;

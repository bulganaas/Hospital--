import React from 'react';
import {Link, useNavigate} from "react-router-dom"; {/*Link оруулж ирнэ */}

export default function Navbar() {
  const navigate = useNavigate()
  
  const onLogout = ()=>{
   navigate("/")
   localStorage.removeItem("token");
  }

  return (
    <div className="navbar-start">
      <Link className="navbar-item" to="/patients/patient">
        Өвчтөнүүд
      </Link>
      <Link className="navbar-item" to="/addpatient">
        Өвчтөн бүртгэх
      </Link>
     

      <a className="navbar-item" onClick={() => onLogout()}>
        {/*callback */}
        Гарах
      </a>
    </div>
  );
}


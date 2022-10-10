
import React, { Component} from 'react'; //react-аас component-ийг оруулж ирнэ. 
import {BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom"; //react-router-dom-оос react element-үүдийг browserRouter холбож өгдөг, URL холбодог Route, сонголт хийх боломж олгодог switch component. //
import Login from "./Login"; //login - оруулна
import Patients from './Patients';
import PatientDetail from './PatientDetail';
import NewPatient from './PatientAdd';

export default class App extends Component {
  state = { 
    token: null, //үндсэн app-ийн state-рүү бичигдэнэ
  };


  handleLogin = (token) => {
      //token хүлээж авна
      this.setState({ token }); //setState-дээр token-оо хадгална
      localStorage.setItem("token", token); //localStorage-дээр /key value databaseS/token гэдэг key хадгална    // console.log("Logged in ... Token: " + token); //token үзүүлнэ
      //this.router.history.push("/patients/patient"); //history-ын patients-д this.router-г push хийнэ
      // redirect user to the auth page
      window.location.href = "/patients/patient";
    };
  handleLogout = () => {    //logout function ажиллана
    localStorage.removeItem("token"); //logout хийсний дараа token-өө цэвэрлэнэ
    this.setState({ token: null }); //logout хийсний дараа setState-ийн token-ийг цэвэрлэнэ//
    this.router.history.push("/"); //logout хийсний дараа / route-рүү шилжинэ    //window.location.href = '/';
  };
  
  render() {
    return (
      <div className="App">
        <div className="AppGlass">
          <Router ref={(router) => (this.router = router)}>
            {/*router обьектийг манай энэ классын router лүү router хүсэлт явуулна. ref ямар нэг обьектийг JS-тай холбож өгнө */}

            <div className="container">
              <Routes>
                <Route exact path="/patients/patient" element={<Patients />} />
                <Route exact path="/addpatient" element={<NewPatient />} />
                <Route path="/patients/:id" element={<PatientDetail />} />
                <Route
                  path="/"
                  element={<Login onLogin={this.handleLogin} />}
                />{" "}
                {/*render-лүү суман функц дамжуулна*/}{" "}
                {/*onLogin гэдэг method дамжуулна//handleLogin-Г onLogin-руу дамжуулна */}
              </Routes>
            </div>
          </Router>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import axios from 'axios'; //axios оруулж ирнэ
import {Link} from "react-router-dom"; //link оруулж ирнэ
import Spinner from "./Spinner";
import { cdnUrl } from "../src/utils/cdnUrl";
import Navbar from './Navbar';
import Table from './Table'
export default class Patients extends Component {
  state = {
    //бүх өвчтөнгүүдээ state-д хадгална 
    error: null, //алдаа
    loading: false,
    patients: [],
  };

  componentDidMount = () => {
       //бүх юм дууссаны дараа componentDidMount сэрвэрээс дуудаж ажиллана
       this.setState({loading: true}); //loading: true болгоно

       this.setState({ loading: true }); 
       axios
      .get("http://localhost:8000/api/v1/patients/patient")
      .then((result) =>  {this.setState({ loading: false, patients: result.data.data }); //setstate-ийн result.data.data хэвлэнэ
       })
        .catch((err) => this.setState({ loading: false, error: err.response })); //err нь response дотор байгаа
  }; //амжилттай ирвэл  result хэвлэнэ, үгүй бол catch errpr хэвлэнэ
  render() {
       return (
         <div>
           <Navbar />
           <h1 className="title">Мөнх Дом эмнэлэг</h1>
           {this.state.loading ? ( //triple ашиглан loading үүсгэнэ
             <Spinner />
           ) : (
             <div className="columns is-multiline">
               {/*<aside class="menu">
                 <p class="menu-label">General</p>
                 <ul class="menu-list">
                   <li>
                     <a>Dashboard</a>
                   </li>
                   <li>
                     <a>Customers</a>
                   </li>
                 </ul>
                 <p class="menu-label">Administration</p>
                 <ul class="menu-list">
                   <li>
                     <a>Team Settings</a>
                   </li>
                   <li>
                     <a class="is-active">Manage Your Team</a>
                     <ul>
                       <li>
                         <a>Members</a>
                       </li>
                       <li>
                         <a>Plugins</a>
                       </li>
                       <li>
                         <a>Add a member</a>
                       </li>
                     </ul>
                   </li>
                   <li>
                     <a>Invitations</a>
                   </li>
                   <li>
                     <a>Cloud Storage Environment Settings</a>
                   </li>
                   <li>
                     <a>Authentication</a>
                   </li>
                 </ul>
                 <p class="menu-label">Transactions</p>
                 <ul class="menu-list">
                   <li>
                     <a>Payments</a>
                   </li>
                   <li>
                     <a>Transfers</a>
                   </li>
                   <li>
                     <a>Balance</a>
                   </li>
                 </ul>
               </aside>
               */}
               <Table />
               {/*олон мөртэй багана */}
               {this.state.patients.map((el, index) => (
                 //өвчтөнгүүдийн зураг хэвлэнэ
                 <div key={index} className="column is-one-quarter">
                   <Link to={`/patients/${el._id}`}>
                     {/*patients/id-аар холбоно */}
                     <img src={`${cdnUrl}${el.Photo}`} /> {/*зураг оруулна */}
                   </Link>
                 </div>
               ))}
               {/*бүх өвчтөнгүүдийн давталт хийгээд гаргахад map функц хэрэглэнэ */}
             </div>
           )}
         </div>
       );
  }
}

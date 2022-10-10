import React, { Component } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import {cdnUrl} from "../src/utils/cdnUrl"
import Navbar from './Navbar';

function withRouter(Component) {
  function ComponentWithRouter(props) {
    let params = useParams();
    return <Component {...props} params={params} />;
  }
  return ComponentWithRouter;
}

 class PatientDetail extends Component {
   state = {
     PatientID: null,
     PatientName: null,
     PatientLastName: null,
     Problem: null,
     Photo: null,
     PhoneNo: null,
     Address: null,
     Age: null,
     Gender: null,
     Bill: null,
     error: null,
     success: null,
     deleted: null,
     loading: false,
     id: "",
   };
  
   goBack = () => {
    console.log(this.props.history);
    window.location.href = "/patients/patient";
   }

   handleType = (e) => {
     //бичиж байх явцад ажилладаг функц
     const { name, value } = e.target; //event target-аас name, value гаргаж авна.

     this.setState({ [name]: value, error: null, success: null }); //email value //бичиж байх явцад error цэвэрлэнэ
   };
   componentDidMount() {
     this.setState({
       id: this.props.params.id,
     });
   }
   static getDerivedStateFromProps(nextProps) {
     return {
       id: nextProps.params.id,
     };
   } //үр дүнг нь хэвлэнэ

   componentDidMount = () => {
     //component маань didmount гэдэг функц
     this.setState({ loading: true });
     axios
       .get("http://localhost:8000/api/v1/patients/" + this.state.id) //өвчтөний id-аар олж дуудна
       .then((result) =>
         this.setState({ ...result.data.data, error: null, loading: false })
       ) //алдаа гарсан бол error nullгэнэ
       // .then((result) => console.log(result))
       .catch((err) => {
         this.setState({
           error: err.response.data.error.message,
           loading: false,
         }); //алдаа гарах юм бол
       });
     // .catch((err) => console.log(err)); //алдаа гарвал хэвлэнэ
   };

   handleSave = () => {
     const token = localStorage.getItem("token");
     this.setState({ loading: true, success: null });
     axios
       .put(
         "http://localhost:8000/api/v1/patients/" + this.state.id,
         {
           PatientName: this.state.PatientName,
           PatientLastName: this.state.PatientLastName,
           Address: this.state.Address,
         }, //өгөгдөл {
         {
           headers: {
             Authorization: `Bearer ${token}`, //токенийн өгөгдлийн тохируулга
           },
         }
       ) //өвчтөний id-аар олж дуудна
       .then((result) => {
         console.log(result);
         this.setState({
           ...result.data.data,
           error: null,
           loading: false,
           success: "Амжилттай хадгалагдлаа...",
         });
       }) //алдаа гарсан бол error nullгэнэ
       // .then((result) => console.log(result)) //үр дүнг нь хэвлэнэ

       .catch((err) => {
         console.log(err);
         this.setState({
           error: err.response.data.error.message,
           loading: false,
         }); //алдаа гарах юм бол
       });
   };

   handleDelete = () => {
     const token = localStorage.getItem("token");
     this.setState({ loading: true, success: null });
     axios
       .delete(
         "http://localhost:8000/api/v1/patients/" + this.state.id,

         {
           headers: {
             Authorization: `Bearer ${token}`, //токенийн өгөгдлийн тохируулга
           },
         }
       ) //өвчтөний id-аар олж дуудна
       .then((result) => {
         this.setState({
           deleted: true,
         });
       }) //алдаа гарсан бол error nullгэнэ
       // .then((result) => console.log(result)) //үр дүнг нь хэвлэнэ

       .catch((err) => {
         console.log(err);
         this.setState({
           error: err.response.data.error.message,
           loading: false,
         }); //алдаа гарах юм бол
       });
   };
   render() {
     if (this.state.deleted) {
       return (
         <div className="notification is-danger">Амжилттай устгагдлаа</div>
       );
     }
     return (
       <>
       <Navbar/>
         {this.state.error && (
           <div className="notification is-warning">{this.state.error}</div>
         )}
         {this.state.success && (
           <div className="notification is-success">{this.state.success}</div>
         )}
         <h1 className="title">{this.state.PatientName}</h1>
         <div className="media">
           <div className="media-left">
             <figure class="image is-128x128">
               <img src={`${cdnUrl}${this.state.Photo}`} />
             </figure>
           </div>
           <div className="media-content">
             <div className="field">
               <label className="label">Нэр</label>
               <input
                 className="input"
                 name="PatientName"
                 value={this.state.PatientName}
                 onChange={this.handleType}
               />
             </div>
             <div className="field">
               <label className="label">Овог</label>
               <input
                 className="input"
                 name="PatientLastName"
                 value={this.state.PatientLastName}
                 onChange={this.handleType}
               />
             </div>
             <div className="field">
               <label className="label">Онош</label>
               <input
                 className="input"
                 name="Problem"
                 value={this.state.Problem}
                 onChange={this.handleType}
               />

               <div className="field">
                 <label className="label">Хаяг</label>
                 <textarea
                   style={{ height: "10em" }} //react style
                   className="input"
                   name="Address"
                   value={this.state.Address}
                   onChange={this.handleType}
                 />
               </div>
               <div className="field">

                 <button className="button is-success" onClick={this.goBack}>
                   Буцах
                 </button>
                 &nbsp;
                 <button className="button is-link" onClick={this.handleSave}>
                   Хадгалах
                 </button>
                 &nbsp;
                 <button
                   className="button is-danger"
                   onClick={this.handleDelete}
                 >
                   Устгах
                 </button>
               </div>
             </div>
           </div>
         </div>
       </>
     ); //js тул нуман хаалтанд хийнэ
   }
 }


const SinglePatientDetail = withRouter(PatientDetail);

export default SinglePatientDetail;
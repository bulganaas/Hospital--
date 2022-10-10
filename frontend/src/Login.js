import React, { Component } from 'react';
import axios from 'axios'; //login-оос email, password оруулна
import Spinner from './Spinner';
import { url } from './utils/url';
export default class Login extends Component {
    state = {
        email: null,
        password: null,
        error: null, 
        loading: false,//ачаалахгүй
    };
    
      handleType = (e) => { //бичиж байх явцад ажилладаг функц
      const { name, value } = e.target; //event target-аас name, value гаргаж авна. 
      
      this.setState({[name]: value, error: null}); //email value //бичиж байх явцад error цэвэрлэнэ
      };
      handleClick = () => {
        this.setState({ loading: true }); //login Хийх үед loading:true болно
        axios
          .post(`${url}/users/login`, {
            email: this.state.email, // обьектийг дамжуулсны дараа email, password-г postлоно
            password: this.state.password,
          })
          .then((result) => {
            this.setState({ loading: false }); 
            this.props.onLogin(result.data.token);
            // this.setState({ error: data.result }); //onLogin рүү token дамжуулна
          }) //үр дүнг нь хэвлэнэ/token-оо app.js-рүү дамжуулна
          .catch((err) => 
          this.setState({ 
            error: err.response.data.error.message,
            loading: false, 
          }) //setState-руу error message дамжуулна уу/алдаа гарвал spinning байхгүй  болно
          ); //амжилтгүй болбол error хэвлэнэ //алдааны response хэвлэнэ
        // console.log('clicked...');
      };
    
    render() {
    return (
      <div
        style={{
          width: "100%",
          height: 1000,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "clay",
          display: "flex",
        }}
      >
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "aqua",
            alignSelf: "center",
          }}
        >
          <div className="field">
            {this.state.error && ( //Bulma хэрэв state дотор error Ороод ирвэл JSX function дуудна
              <div className="notification is-warning">{this.state.error}</div>
            )}{" "}
            {/*Алдааг state-д хэвлэнэ */} {this.state.loading && <Spinner />}{" "}
            {/*this.state-ийн loading ба Spinner  */}
            LOGIN
            <label className="label">Имэйл</label>
            <input
              className="input"
              name="email"
              type="text"
              onChange={this.handleType}
            />
          </div>
          <div className="field">
            <label className="label">Нууц үг</label>
            <input
              className="input"
              name="password"
              type="password"
              onChange={this.handleType}
            />
          </div>
          <div className="field" onClick={this.handleClick}>
            {/*handleClick функц ажиллуулна */}
            <button className="button is-link">Нэвтрэх</button>
          </div>
        </div>
      </div>
    );
  }
}

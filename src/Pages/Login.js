import React, { useState,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../App';

import { Border, BorderBottom, TextLeft } from "react-bootstrap-icons";

export const Login = () => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate(); // Para redirecionar após o login

  // Função de login
  const login = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do form

    try {
      // Faz a requisição para a API
      const response = await Axios.post("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/account", {
        username,  // Envia o username do estado
        password   // Envia o password do estado
      }, {
        withCredentials: true // Permite o envio de cookies
      });

      if (response.status === 200) {
        console.log('Login bem-sucedido:', response.data);
        
        // Guarda o user no localStorage
        sessionStorage.setItem('user', JSON.stringify(response.data));
        

        setUser(JSON.stringify(response.data))

        // Redireciona para a home page
       
        
        navigate(-1)
      } else {
        throw new Error('Erro ao fazer login');
      }

    } catch (err) {
      // Mostra o erro se algo der errado
      setError("Dados Inválidos");
      console.error('Erro:', err);
    }
  };

  return (
    
    <Container  style={{float:'left ', color: '#6495ED ', display: 'flex ', width:'600vh '}}>
   
    <div className="row w-100">
      <div col-md={4}>
        <div style={{margin:"10px 10px 30px 15px "}}>
            <h1 style={{width:'100% '}}>Login</h1>
            <hr className="w-100"></hr>
        </div>
        <form onSubmit={login}>
          <div style={{margin:'10px 10px 10px 0px'}} >
            <label style={{ }} htmlFor="Username">Username</label>
            <br />
            <input            
              style={{backgroundColor:'#6495ED'}}
              type="text"
              
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
         
          <div style={{margin:'10px 10px 10px 0px'}}>
            <label style={{}} htmlFor="Password">Password</label>
            <br />
            <input
              style={{backgroundColor:'#6495ED'}}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-success" style={{margin: '10px',  color:'white'}} type="submit">Login</button>
          {error && <p style={{ color: 'red', font:'bold' }}>{error}</p>}
        </form>
      </div>
    </div>
    </Container>
  );
};

export default Login;
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Border, BorderBottom, TextLeft } from "react-bootstrap-icons";

export const Login = () => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Para redirecionar após o login

  // Função de login
  const login = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do form

    try {
      // Faz a requisição para a API
      const response = await Axios.post("http://localhost:5206/api/gerir/account", {
        username,  // Envia o username do estado
        password   // Envia o password do estado
      }, {
        withCredentials: true // Permite o envio de cookies
      });

      if (response.status === 200) {
        console.log('Login bem-sucedido:', response.data);

        // Guarda o user no localStorage
        localStorage.setItem('user', JSON.stringify(response.data));

        // Redireciona para a home page
        navigate('/'); 
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
    <Container  style={{float:'left ', color: '#6495ED ', display: 'flex ', width:'300vh '}}>
    <div className="row">
      <div col-md={4}>
        <div style={{margin:"10px 10px 30px 15px "}}>
            <h2 style={{display:'flex ', width:'100% '}}>Login</h2>
        </div>
        <form onSubmit={login}>
          <div style={{margin:'10px 10px 10px 0px'}} >
            <label style={{float:'left ' }} htmlFor="Username">Username</label>
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
            <label style={{float:'left '}} htmlFor="Password">Password</label>
            <br />
            <input
              style={{backgroundColor:'#6495ED'}}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-info" style={{margin: '10px', display: 'flex', color:'purple'}} type="submit">Login</button>
          {error && <p style={{ color: 'red', font:'bold' }}>{error}</p>}
        </form>
      </div>
    </div>
    </Container>
  );
};

export default Login;
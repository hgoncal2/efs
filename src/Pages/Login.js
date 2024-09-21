import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

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
      setError(err.message);
      console.error('Erro:', err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <form onSubmit={login}>
          <div>
            <label htmlFor="Username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import Axios from "axios";
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';


export const Login = () => {
  const [error, setError] = useState('');

 

  useEffect(() => {
    const fetchUser = async () => {

         // Dados que serão enviados para a API de autenticação
        try {
            const response = await Axios
                .post("http://localhost:5206/api/gerir/account", { username: 'daniel2', password: 'Teste123!'},{
                    headers: {
                      "Access-Control-Allow-Credentials":true
                  
                    }})
                .then((res) => {
                    if (res.status!=200) {
                      throw new Error(res.statusText);
                    }
                    const data = res.data;
                    console.log(data);
                });
                  
                } catch (err) {
                  setError(err.message);
                }
              };
          
              fetchUser();
            }, []);
  return(

<div className="row">
    <div className="col-md-4">
        <form asp-action="Login">
            <div asp-validation-summary="ModelOnly" className="text-danger"></div>
            <div className="form-group">
                <label asp-for="Username" className="control-label"></label>
                <input asp-for="Username" className="form-control" />
                <span asp-validation-for="Username" className="text-danger"></span>
            </div>
            <div class="form-group">
                <label asp-for="Password" className="control-label"></label>
                <input asp-for="Password" type="password" className="form-control" />
                <span asp-validation-for="Password" className="text-danger"></span>
            </div>
            <br />
            <br />
            <div className="form-group">
                <input type="submit" value="Login" className="btn btn-primary" />
            </div>
        </form>
        <br />
        <div className="">

            <a className="text-decoration-none" asp-action="ResetPassword" asp-controller="Account"><i className="bi bi-question-circle-fill fa fa-2x"></i><span className="h3 ms-3">Esqueceu password?</span></a>

            <br/>
            <br />
            <a className="text-decoration-none" asp-action="Register" asp-controller="Account"><i className="bi bi-person-vcard fa fa-2x "></i><span class="h3 ms-3">Criar conta</span></a>
            <br />
            <br />
            <a className="text-decoration-none" asp-action="ResendEmailConfirmation" asp-controller="Account"><i className="bi bi-envelope-check fa fa-2x "></i><span className="h3 ms-3">Reenviar email de confirmação</span></a>
            
            
        </div>
    </div>
</div>
);
}
  
  export default Login;

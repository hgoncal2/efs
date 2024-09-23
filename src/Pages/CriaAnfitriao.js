import React, { useEffect, useState, useContext } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { getDifColor } from "../App";

import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";
import { PencilFill } from "react-bootstrap-icons";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import { Card, Stack, Form, Row, Col,Alert } from "react-bootstrap";
import { format } from "date-fns";

import "bootstrap/dist/css/bootstrap.min.css";

import Carousel from "react-bootstrap/Carousel";

export const CriaAnfitriao = () => {
  const [anf, setAnf] = useState([]);
  const [mudarPassword,setMudarPassword] = useState(false)
  const { id } = useParams();   
   const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [showAlert, setShowAlert] = useState(null);

  const navigate = useNavigate(); // Para redirecionar após o login

  

 
  
    
   
    
    

 

  const ConstroiAnf = () => {
    //dados do anf
    const [email, setEmail] = useState("");
    const [primeiroNome, setPrimeiroNome] = useState("");
    const [ultimoNome, setUltimoNome] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    
    const [confirmPassword, setConfirmPassword] = useState('');


    const  handleSave = async () => {

      if(password!=confirmPassword){
        setShowAlert({msg : " Passwords não são iguais!" , style: "danger"})
      }else{

      

  try {
    let formData = new FormData();
    formData.append("Email", email);
    formData.append("Username", username);
    formData.append("PrimeiroNome", primeiroNome);
    formData.append("UltimoNome", ultimoNome);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);


    


    const response = await Axios.post(
      "https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/anfs",

        formData

      ,{withCredentials:true}
    ).then((res) => {
      if (res.status != 200) {
        throw new Error(res.statusText);
      }
      const data = res.data;
      setShowAlert({msg : "Anfitrião criado com sucesso!" , style:"success"})
      setTimeout(() => {
        navigate(-1); // Esconder o alerta após 1,2 segundos, por exemplo
      }, 1200);
    });
  } catch (err) {
    setShowAlert({msg:"Erro a criar anfitrião!Certifique-se que o nome não pode ter letras,e tem no mínimo 20 caracteres",style:"danger"});
  }
};
}


    
    

    const form = () => (
      <Form className="text-center align-center">
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail2">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Username
            </Form.Label>
            <Form.Control
              type="text"
              required={true}
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Jorge"
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalNomes">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={3}>
              Primeiro Nome
            </Form.Label>
            <Form.Control
              type="text"
              value={primeiroNome}
              onChange={(e) => setPrimeiroNome(e.target.value)}
              placeholder="Lula"
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Último Nome
            </Form.Label>
            <Form.Control
              type="text"
              value={ultimoNome}
              onChange={(e) => setUltimoNome(e.target.value)}
              placeholder="Dos Santos"
            />
          </Col>
        </Form.Group>




     
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalNomeswd">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={3}>
              Nova password
            </Form.Label>
            <Form.Control
            required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={4}>
              Confirmar nova password
            </Form.Label>
            <Form.Control required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              
            />
          </Col>
        </Form.Group>

      
        

        <Button variant="primary" onClick={handleSave}>
          Criar
        </Button>
      </Form>
    );

    return <div>

    {form()}
    </div>;
  };

 
  return (
    <div className="home">
         {showAlert!=null && <Alert variant={showAlert.style} dismissible onClose={() => setShowAlert(null)}>{showAlert.msg}</Alert>}

      <section className="titulo">
        <ConstroiAnf></ConstroiAnf>
      </section>
    </div>
  );
};

export default CriaAnfitriao;

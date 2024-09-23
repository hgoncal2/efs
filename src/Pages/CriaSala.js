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

export const CriaSala = () => {
  const [sala, setSala] = useState([]);
   const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [showAlert, setShowAlert] = useState(null);

  const navigate = useNavigate(); // Para redirecionar após criar sala

  

  const ConstroiSala = () => {
    //dados da sala
    const [numero, setNumero] = useState("");
    const [area, setArea] = useState("");
    const [listaAnf, setListaAnf] = useState([]);


    const  handleSave = async () => {

  try {
    let formData = new FormData();
    formData.append("numero", numero);
    formData.append("area", area);
    formData.append("listaAnf","jonSilva")

    const response = await Axios.post(
      "http://localhost:5206/api/gerir/salas",


        formData

      ,{withCredentials:true}
    ).then((res) => {
      if (res.status != 200) {
        throw new Error(res.statusText);
      }
      const data = res.data;
      setShowAlert({msg : "Sala criada com sucesso!" , style:"success"})
      setTimeout(() => {
        navigate(-1); // Esconder o alerta após 1,2 segundos, por exemplo
      }, 1200);
    });
  } catch (err) {
    navigate(-1);
    setShowAlert({msg:"Erro ao criar a Sala! Certifique-se que o número da sala não é repetido e tem 3 ou menos números",style:"danger"});
    
  }
}


    const form = () => (
      <Form className="text-center align-center">
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail2">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Número da Sala
            </Form.Label>
            <Form.Control
              type="text"
              required={true}
              onChange={(e) => setNumero(e.target.value)}
              value={numero}
              placeholder="0"
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Área(m2)
            </Form.Label>
            <Form.Control
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="0"
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
        <ConstroiSala></ConstroiSala>
      </section>
    </div>
  );
};

export default CriaSala;

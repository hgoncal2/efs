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

export const EditaAnf = () => {
  const [anf, setAnf] = useState([]);
  const [mudarPassword,setMudarPassword] = useState(false)
  const { id } = useParams();   
   const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [showAlert, setShowAlert] = useState(null);

  const navigate = useNavigate(); // Para redirecionar após o login

  

  const constroiFooterRoles = (props) => {
    const a = props.roles.map((i) => (
      <li
        key={i}
        className={
          "list-group-item text-white " +
          (i == "Anfitriao" ? "bg-warning" : "bg-danger") +
          " flex-fill ms-2"
        }
      >
        {i}
      </li>
    ));

    return (
      <ul className="list-group text-break list-group-horizontal mt-2 mb-2">
        {a}
      </ul>
    );
  };

  
  useEffect(() => {
    
   
    
    const fetchAnf = async () => {
      try {
        //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
        // "showTemasSemSala=true",por defeito é false
        const response = await Axios.get(
          "http://localhost:5206/api/gerir/anfs/" + id
        ).then((res) => {
          if (res.status != 200) {
            throw new Error(res.statusText);
          }
          const data = res.data;
          setAnf(data);
        });
      } catch (err) {
        setShowAlert({msg:"Erro a carregar anfitriões!",style:"danger" });
      }
    };

    fetchAnf();
  }, []);

  if (error) {
    return (
      <h1>
        Error: <span className="text-danger">{error}</span>
      </h1>
    );
  }

  const ConstroiAnf = (props) => {
    //dados do anf
    const [email, setEmail] = useState(props.dados.email);
    const [primeiroNome, setPrimeiroNome] = useState(props.dados.primeiroNome);
    const [ultimoNome, setUltimoNome] = useState(props.dados.ultimoNome);
    const [mudarPassword, setMudarPassword] = useState(false);
    const [novaPassword, setNovaPassword] = useState('');
    
    const [confirmNovaPassword, setConfirmNovaPassword] = useState('');


    const  handleSave = async () => {

if(mudarPassword && (novaPassword!=confirmNovaPassword)){
  setShowAlert({msg : " Passwords não são iguais!" , style: "danger"})
}else{
  try {
    let formData = new FormData();
    formData.append("email", email);
    formData.append("username", props.dados.username);
    formData.append("Id", id);
    formData.append("primeiroNome", primeiroNome);
    formData.append("ultimoNome", ultimoNome);
    if(mudarPassword){
      formData.append("password", novaPassword);
      formData.append("confirmPassword", confirmNovaPassword);


    }



    //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
    // "showTemasSemSala=true",por defeito é false
    const response = await Axios.put(
      "http://localhost:5206/api/gerir/anfs/" + id,

        formData

      ,{withCredentials:true}
    ).then((res) => {
      if (res.status != 200) {
        throw new Error(res.statusText);
      }
      const data = res.data;
      setShowAlert({msg : "Anfitrião atualizado com sucesso!" , style:"success"})
      setTimeout(() => {
        navigate(-1); // Esconder o alerta após 1,2 segundos, por exemplo
      }, 1200);
    });
  } catch (err) {
    setShowAlert({msg:"Erro a guardar anfitrião!Certifique-se que o nome não pode ter letras,e tem no mínimo 20 caracteres",style:"danger"});
  }
};


}
    
    

    const form = () => (
      <Form className="text-center align-center">
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Username
            </Form.Label>
            <Form.Control
              type="text"
              readOnly
              value={props.dados.username}
              placeholder="Email"
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
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
<hr></hr>
<Form.Group as={Row} className="mb-3" controlId="formHorizontalNomesdwaa">
<Stack direction="horizontal" gap={1} className="align-items-center justify-content-center">
<Form.Label >
              Mudar Password
            </Form.Label>
<Form.Check // prettier-ignore
        type="switch" checked={mudarPassword} onChange={(e) => setMudarPassword(e.target.checked)}
        id="custom-switch" 
       
      />
</Stack>

</Form.Group>

      {mudarPassword && (
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalNomeswd">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={3}>
              Nova password
            </Form.Label>
            <Form.Control
              type="password"
              value={novaPassword}
              onChange={(e) => setNovaPassword(e.target.value)}
              
            />
          </Col>
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={4}>
              Confirmar nova password
            </Form.Label>
            <Form.Control
              type="password"
              value={confirmNovaPassword}
              onChange={(e) => setConfirmNovaPassword(e.target.value)}
              
            />
          </Col>
        </Form.Group>

      )}
        

        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Form>
    );

    return <div>

    {form()}
    </div>;
  };

  if (anf.length === 0 || !anf) {
    return <h1>Nenhum Anfitriao!</h1>;
  }
  return (
    <div className="home">
         {showAlert!=null && <Alert variant={showAlert.style} dismissible onClose={() => setShowAlert(null)}>{showAlert.msg}</Alert>}

      <section className="titulo">
        <ConstroiAnf dados={anf}></ConstroiAnf>
      </section>
    </div>
  );
};

export default EditaAnf;

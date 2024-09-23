import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import { UserContext } from '../App';
import { PencilFill,Plus, Trash } from "react-bootstrap-icons";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import { Card,Stack,Alert } from "react-bootstrap";
import { format } from "date-fns";

import 'bootstrap/dist/css/bootstrap.min.css';

import Carousel from "react-bootstrap/Carousel";

export const Anfs = () => {
  const [anfs, setAnfs] = useState([]);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(null);

  const { user, setUser } = useContext(UserContext);


const handleDelete = async (id) => {
  try {
    //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
    // "showTemasSemSala=true",por defeito é false
    const response = await Axios.delete("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/anfs/"+id,{withCredentials:true}).then((res) =>{
      console.log(res)
        if (res.status!=200) {
           // throw new Error(res.statusText);
           console.log(res.data.error)
          }
          setShowAlert({msg:"Utilizador eliminado com sucesso",style:"success"})
          setTimeout(() => {
            window.location.reload(); // Esconder o alerta após 3 segundos, por exemplo
          }, 1200);
    });
    
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      setShowAlert({msg:err.response.data.error,style:"danger"}); // Acessando a mensagem de erro
    } else {
      setError(err.message); // Mensagem de erro padrão
    }
  }

};




  const constroiFooterRoles = (props) => {
    
    const a = props.roles.map((i) => (
        <li key={i} className={"list-group-item text-white "+ (i=='Anfitriao' ? 'bg-warning' : 'bg-danger' ) + " flex-fill ms-2"}>{i}</li>
        ))
        
        return (
        <ul className="list-group text-break list-group-horizontal mt-2 mb-2">
            {a}
        </ul>
        
        )
    
    }

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
        // "showTemasSemSala=true",por defeito é false
        const response = await Axios.get("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/anfs").then((res) =>{
            if (res.status!=200) {
                throw new Error(res.statusText);
              }
              const data =res.data;
              setAnfs(data);
        });
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTemas();
  }, []);

  if (error) {
    return (
      <h1>
        Error: <span className="text-danger">{error}</span>
      </h1>
    );
  }

  const ConstroiAnfs = (props) => {
    const i = 0;

    const rows = props.dados.map((row) => (
        <div key={row.id} id={row.username}>
        
        <Card style={{ width: '25rem' }} className={"border "   +  ((user != null && user.username==row.username) ? 'border-success' : 'border-warning') + " border-4"}>
        <Card.Header className={"border "+ (row.roles.includes('Admin') ? 'border-danger' : '   ')  +" border-3 bg-info"}>{row.primeiroNome} {row.ultimoNome}</Card.Header>

        <Card.Body className="bg-dark">
          <Card.Title>{row.username}</Card.Title>
          <Card.Img variant="top" src="https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/imagens/defaultUser.jpg" />
          <Card.Text>
           Email: {row.email}
          </Card.Text>
          <Card.Footer className="bg-secondary">
         {constroiFooterRoles({roles:row.roles})}
            Anfitrião orgulhoso desde {format(new Date(row.dataCriacao), 'dd-mm-yyyy')}
             {(user != null && (user.username==row.username || user.roles.includes("Admin"))) && <LinkContainer to={`/anfitrioes/${row.id}`}><Button variant="primary"><PencilFill className="me-2" as="a"></PencilFill>Editar</Button></LinkContainer>  }
             {(user != null && (user.username!=row.username && user.roles.includes("Admin"))) && <Button variant="primary" onClick={() => handleDelete(row.id)}><Trash className="me-2" as="a"></Trash>Apagar</Button>  }

          </Card.Footer>
          
        </Card.Body>
      </Card>
      
      </div>

      
    ));
    
    return (
<div>
{showAlert!=null && <Alert variant={showAlert.style} dismissible onClose={() => setShowAlert(null)}>{showAlert.msg}</Alert>}

{(user != null && user.roles.includes("Admin")) &&<div className="mb-5 "> <LinkContainer to={`/criaAnfitriao`}><Button variant="primary"><Plus className="me-2 " as="a"></Plus>Criar Anfitrião</Button></LinkContainer> </div> }

<Stack direction="horizontal" gap={3} className="ms-5 h-100 flex-wrap">
  {rows}  
  </Stack>
</div>




    )
  };

  if (anfs.length === 0 || !anfs) {
    return <h1>Nenhum Anfitriao!</h1>;
  }
  return (
    <div className="home">
      <section className="titulo">
        <ConstroiAnfs dados={anfs}></ConstroiAnfs>
        
      </section>
    </div>
  );
};

export default Anfs;

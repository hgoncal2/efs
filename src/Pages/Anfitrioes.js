import React, { useEffect, useState,useContext } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import { UserContext } from '../App';
import { PencilFill,Plus } from "react-bootstrap-icons";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import { Card,Stack } from "react-bootstrap";
import { format } from "date-fns";

import 'bootstrap/dist/css/bootstrap.min.css';

import Carousel from "react-bootstrap/Carousel";

export const Anfs = () => {
  const [anfs, setAnfs] = useState([]);
  const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);


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
        const response = await Axios.get("http://localhost:5206/api/gerir/anfs").then((res) =>{
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
          <Card.Img variant="top" src="http://localhost:5206/imagens/defaultUser.jpg" />
          <Card.Text>
           Email: {row.email}
          </Card.Text>
          <Card.Footer className="bg-secondary">
         {constroiFooterRoles({roles:row.roles})}
            Anfitrião orgulhoso desde {format(new Date(row.dataCriacao), 'dd-mm-yyyy')}
             {(user != null && (user.username==row.username || user.roles.includes("Admin"))) && <LinkContainer to={`/anfitrioes/${row.id}`}><Button variant="primary"><PencilFill className="me-2" as="a"></PencilFill>Editar</Button></LinkContainer>  }
            
          </Card.Footer>
          
        </Card.Body>
      </Card>
      
      </div>

      
    ));
    
    return (
<div>
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

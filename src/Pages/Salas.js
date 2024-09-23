import React, { useEffect, useState,useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { getDifColor } from "../App";
import { UserContext } from "../App";

import {LinkContainer} from "react-router-bootstrap";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from "date-fns";
export const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [error, setError] = useState(null);
  const [deleted, setDeleted] = useState('');
  const { user, setUser } = useContext(UserContext);

  const [alert, setAlert] = useState(null); 
  const navigate = useNavigate(); 

console.log(user)
    
  const GeraAnfs = (props) => {
    console.log(props.anfs)
    const anfs = props.anfs.map((i) => (
    <li key={i} className='list-group-item text-white bg-warning flex-fill ms-2'>{i}</li>
    ))
    
    return (
    <ul className="list-group text-break list-group-horizontal mt-2 mb-2">
        {anfs}
    </ul>
    
    )
    
    }

    const handleShowAlert = (msg) => {
      setAlert(msg);
      setTimeout(() => {
        window.location.reload(); // Esconder o alerta após 3 segundos, por exemplo
      }, 1200);
  };

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await Axios.get("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/salas").then((res) =>{
            if (res.status!=200) {
                throw new Error(res.statusText);
              }
              const data =res.data;
              setSalas(data);
        });
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSalas();
  }, []);

  const deleteSala = async(salaId) => {
    try{
      const response = await Axios.delete("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/salas/" + salaId, {withCredentials: true});
      if(response.status == 200){
        setDeleted('Sala apagada com sucesso!');
      }else{
        throw new Error('Erro ao apagar Sala!');
      }
    }catch(err){
      setError('Erro ao apagar Sala!');
    }
  }

  if (error) {
    return (
      <h1>
        Error: <span className="text-danger">{error}</span>
      </h1>
    );
  }

  const Teste = (props) => {
    const i = 0;
    console.log(props.teste);
  
    const rows = props.dados.map((row) => (
       
        <tr key={row.salaId} >
            <td>
                {row.salaId}
                
            </td>
            <td>
                {row.numero}
            </td>
            <td>
                {row.area}
            </td>
            <td>
                <GeraAnfs anfs={row.listaAnfitrioes}></GeraAnfs>
            </td>
            <td>
                {row.listaReservas.length}
            </td>
            <td>
            {format(new Date(row.dataCriacao), 'dd-mm-yyyy')}
            </td>
            <td>
                {row.criadoPorUsername}
            </td>
            <td className="text-center">

                <div className="mt-4">
                    <LinkContainer to={`/salas/${row.salaId}`}>
                        <Button className={`btn btn-outline-dark`} >VER SALA</Button>
                    </LinkContainer>
                    <Button className={`btn btn-outline-danger`} onClick={() => deleteSala(row.salaId)} handleShowAlert={"AAAAAAAAAAAAAA"}>Apagar</Button>
                </div>
            </td>
        </tr>
        
        
      
    ));
    
    return (
      <div>
        <table className="table">
          <thead>
              <th>
                  SalaId
              </th>
              <th>
                  Número da Sala
              </th>
              <th>
                  Área (m2)
              </th>
              <th>
                  Anfitriões
              </th>
              <th>
                  Número de Reservas
              </th>
              <th>
                  Data de Criação
              </th>
              <th>
                  Criado Por
              </th>
              <th>
                  Ações
              </th>
          </thead>

          <tbody>
              {rows}

          </tbody>
        </table>
        <LinkContainer to={`/criaSala`}>
          <Button className={`btn btn-outline-dark`} >CRIAR SALA</Button>
        </LinkContainer>
      </div>
    )
  };

  if (salas.length === 0 || !salas) {
    return <h1>Nenhuma Sala!</h1>;
  }
  return (
    <div className="home">
      <section className="titulo">
        <Teste dados={salas}></Teste>
      </section>     
    </div>
  );
};

export default Salas;

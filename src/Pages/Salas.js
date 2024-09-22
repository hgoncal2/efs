import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from "date-fns";
export const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const response = await Axios.get("http://localhost:5206/api/gerir/salas").then((res) =>{
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
                    <Button className={`btn btn-outline-danger`} >Apagar</Button>
                </div>
            </td>
        </tr>
        
        
      
    ));
    
    return (
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import { Routes, Route, useParams } from 'react-router-dom';
import {LinkContainer} from "react-router-bootstrap";

import Button from 'react-bootstrap/Button';


 export const ReservasSala = (props) => {


  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);

  http://localhost:5206/api/reservasSala/4

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("/reservasSala/" + id);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setReservas(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservas();
  }, []);




  console.log(reservas)
  if(reservas.length === 0 || !reservas){
   return <h1 className="text-danger">Nenhuma reserva efetuada!</h1>
  }

  return (
    <h2>Mostrar reservas para sala {reservas.salaNumero}</h2>
  )
}

export default ReservasSala
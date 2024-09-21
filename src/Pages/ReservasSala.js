import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import { Routes, Route, useParams } from 'react-router-dom';
import {LinkContainer} from "react-router-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Button from 'react-bootstrap/Button';
import { humanizeDuration } from 'humanize-duration';




 export const ReservasSala = (props) => {


  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);


  function makeCalendar(res){

    const rLista = res.listaReservas.map(i => {
      const reservaDate = new Date(i.reservaDate);
      const reservaEndDate = new Date(i.reservaEndDate);
      const isPast = reservaDate < new Date();
      return {
        id: i.reservaId,
        title: `Reserva ${i.reservaId} - Sala ${res.salaNumero}`,
        start: reservaDate.toISOString(),
        end: reservaEndDate.toISOString(),
        className: `${i.reservaId}`,
        description: `Reserva ${i.reservaId} - Sala ${res.salaNumero} `,
        extendedProps: {
            nome: `${i.clientePrimeiroNome} ${i.clienteUltimoNome}`,
            idReserva: i.reservaId,
            dataI: reservaDate.toLocaleString(),
            dataF: reservaEndDate.toLocaleString(),
            
            temaNome: res.temaNome,
            sala: res.salaNumero,
            cancelada: i.cancelada,
            nPessoas: i.numPessoas,
            totalPreco: i.totalPreco,
        },
        allDay: false
    };
   
    
});
setEvents(rLista);
    }  

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("/reservasSala/" + id);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setReservas(data);
        makeCalendar(data)
      
        
       
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservas();
  }, []);




  console.log(reservas)
  if(reservas.length === 0 || !reservas){
   return (
    <div>
 <h1 className="text-danger">Nenhuma reserva efetuada!</h1>
 

    

    </div>
   


   )
  }

  return (
    <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
        />
  )
}

export default ReservasSala
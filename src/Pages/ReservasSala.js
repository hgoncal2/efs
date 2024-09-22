import React, { useEffect, useState,useContext } from "react";
import { json, Link } from "react-router-dom";
import { getDifColor } from "../App";
import { Routes, Route, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Form from 'react-bootstrap/Form';
import Cookies from 'js-cookie';

import { UserContext } from '../App';

import interactionPlugin from "@fullcalendar/interaction";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import { Alert } from "react-bootstrap";

import Tooltip from "tooltip.js";
import { DialogEvent, DialogSelect } from '../App/Dialog';
import ptLocale from "@fullcalendar/core/locales/pt";
import { pt } from 'date-fns/locale'
import { formatRelative } from "date-fns";


import { humanizeDuration } from "humanize-duration";

export const ReservasSala = (props) => {
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [verCanc,setVerCanc] = useState(Boolean(Cookies.get("verCanc")));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [alert, setAlert] = useState(null); 
  const [alertDismissable, setAlertDismissable] = useState(null); 

  const { user, setUser } = useContext(UserContext);
  let username = null;

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event.extendedProps); 
    setShowDialog(true);
  };

  

  const handleVerCanc = (arg) => {
    console.log(verCanc)
    Cookies.set("verCanc",Boolean(arg))
    setVerCanc(Boolean(arg));
  }

  const handleEventSelect= (arg) => {
    setSelectedEvent(arg); 
    setSelected(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setSelected(false)
  }
  const handleShowAlertDismissable = (msg) => {
    setAlertDismissable(msg);
   
};

  const handleShowAlert = (msg) => {
    setAlert(msg);
    setTimeout(() => {
      window.location.reload(); // Esconder o alerta após 3 segundos, por exemplo
    }, 1200);
};
  const handleSelect = () => {
      setSelected(true)
  }

function showDisplay(data){
  return data > (new Date()) ? 'block' : 'background';
}

function getEventColor(client,u){

 console.log({user})
  return u.username == client ? '#a463eb' : '#2a602a';
}

  function makeCalendar(res) {
    
    const rLista = res.listaReservas.map((i) => {
      const reservaDate = new Date(i.reservaDate);
      const reservaEndDate = new Date(i.reservaEndDate);
      const isPast = reservaDate < new Date();
      return {
        id: i.reservaId,
        title: formatRelative(reservaDate,new Date(),{locale:pt}),
        start: reservaDate.toISOString(),
        end: reservaEndDate.toISOString(),
        display: showDisplay(reservaEndDate),
        className: `${i.reservaId}`,
        color: getEventColor(i.clienteUsername,{username}),
        description: `Reserva ${i.reservaId} - Sala ${res.salaNumero} `,
        extendedProps: {
          nome: `${i.clientePrimeiroNome} ${i.clienteUltimoNome}`,
          idReserva: i.reservaId,
          clientUsername : `${i.clienteUsername}`,
          dataI: reservaDate.toLocaleString(),
          dataF: reservaEndDate.toLocaleString(),
          temaDif : res.temaDificuldade,
          dataInicialDate: reservaDate,
          temaNome: res.temaNome,
          sala: res.salaNumero,
          anfs : i.anfitrioes,
          cancelada: i.cancelada,
          nPessoas: i.numPessoas,
          totalPreco: i.totalPreco,
        },
        allDay: false,
      };
    });
    setEvents(rLista);
  }


  function devolveTemaJson(t){

   let jsonVar = {
      "preco" : t.temaPreco,
      "minPessoas" : t.temaMinPessoas,
      "maxPessoas": t.temaMaxPessoas,
      "salaId":reservas.salaId
    }
    return jsonVar;
      
    
  }

  useEffect(() => {
    const fetchReservas = async () => {
      
      try {
        console.log(verCanc)
        const response = await Axios.get("http://localhost:5206/api/reservasSala/" + id + "?showCanc=" + (verCanc == null ? 'true' : verCanc)).then((res) =>{
          if (res.status!=200) {
              throw new Error(res.statusText);
            }
            const data = res.data;
           
        setReservas(data);
        makeCalendar(data);

      });
       
      } catch (err) {
        setError(err.message);
      }
    };
    if(user != null){
      username = user.username;
    }
    fetchReservas();
  }, [user,verCanc]);
  //Faz com que a função seja executada sempre que o valor de User muda,que é o que nos queremos

 
  if (reservas.length === 0 || !reservas) {
    return (
      <div>
        <h1 className="text-danger">Nenhuma reserva efetuada!</h1>
      </div>
    );
  }

  
  return (
   
    <div>
     {(alertDismissable != null) && <Alert dismissible onClose={() => setAlertDismissable(null)} variant={alertDismissable.style}>{alertDismissable.msg}</Alert>}
     {(alert != null) && <Alert variant={alert.style}>{alert.msg}</Alert>}

    {showDialog && <DialogEvent
        show={showDialog}
        handleClose={handleClose}
        handleShowAlert={handleShowAlert}
        e={selectedEvent}
      />
      }

      {selected && <DialogSelect show={selected}
        handleClose={handleClose} handleShowAlert={handleShowAlert}
        e={selectedEvent} tema={devolveTemaJson(reservas)}/>}

<h2>Mostrar reservas para sala {reservas.salaNumero}</h2>
    
<Form className="float-end">
  Ver canceladas
      <Form.Check // prettier-ignore
        type="switch" checked={verCanc} onChange={(e) => handleVerCanc(e.target.checked)}
        id="custom-switch" className="float-left"
       
      />
      
    </Form>
    <br></br>
    

     
  
  
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotEventOverlap={false}
        
        initialDate={new Date()}
        stickyHeaderDates={true}
        slotDuration="00:15:00"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        hiddenDays={[0]}
        eventOverlap={false}
        timeZone="UTC"
        selectOverlap={false}
        nowIndicator={true}
        selectable={true}
       
        select={(arg) => {
          if(user == null){
            handleShowAlertDismissable({
             msg: "Por favor faça login para fazer reservas!",
             style:'danger'
          });   
            return;
          }else{
              if(!user.roles.includes("Cliente")){
                
                handleShowAlertDismissable({
             msg: "Apenas clientes podem fazer reservas!",
             style:'danger'
          });   
                return;
              }
          }
          {handleEventSelect(arg)}
       
        }}
        editable={false}
        eventDisplay="block"
        eventStartEditable={false}
        eventDurationEditable={false}
        contentHeight="auto"
        
        eventTextColor="white"
        allDaySlot={false}
        headerToolbar={{
          left: "prev,dayGridMonth",
          center: "title,today",
          right: "next,timeGridWeek",
        }}
        buttonText={{
          today: "Ver dia atual",
          month: "Ver mês",
          week: "Ver semana",
          day: "Ver dia",
        }}
        locale={ptLocale}
        eventMouseEnter={(info) => {
          info.el.style.cursor = "pointer";
        }}
        eventDidMount={(info) => {
          new Tooltip(info.el, {
            title: info.event.extendedProps.description,
            placement: "top",
            trigger: "hover",
            container: "body",
          });
        }}
        eventClick={(arg) => {
          {user.username == arg.event.extendedProps.clientUsername && handleEventClick(arg) }
          
       
        }}
        eventClassNames={(arg) => {
          return arg.event.extendedProps.cancelada === true
            ? ["strike-class"]
            : ["textWhite"];
        }}
        selectAllow={(info) => {
          
          return info.start >= new Date();
        }}
      />
    </div>
  );
};

export default ReservasSala;

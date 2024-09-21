import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import { Routes, Route, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import Tooltip from "tooltip.js";
import DialogEvent from "../App/Dialog"
import ptLocale from "@fullcalendar/core/locales/pt";
import { humanizeDuration } from "humanize-duration";

export const ReservasSala = (props) => {
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event.extendedProps); 
    setShowDialog(true);
  };

  const handleClose = () => setShowDialog(false);

  function makeCalendar(res) {
    const rLista = res.listaReservas.map((i) => {
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
        allDay: false,
      };
    });
    setEvents(rLista);
  }

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await Axios.get("http://localhost:5206/api/reservasSala/" + id + "?showCanc=true").then((res) => {
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

    fetchReservas();
  }, []);

  console.log(reservas);
  if (reservas.length === 0 || !reservas) {
    return (
      <div>
        <h1 className="text-danger">Nenhuma reserva efetuada!</h1>
      </div>
    );
  }
  console.log(events)
  console.log("waad")
  return (
    <div>
    {showDialog && <DialogEvent
        show={showDialog}
        handleClose={handleClose}
        eventDetails={selectedEvent}
      />
      }
    
      <h2>Mostrar reservas para sala {reservas.salaNumero}</h2>
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
        selectable={false}
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
          console.log(arg.event.extendedProps)
          {handleEventClick(arg)}
       
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

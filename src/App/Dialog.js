import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addHours } from "date-fns";
import { SlashCircle, X,slashCircle } from 'react-bootstrap-icons';
import { pt } from 'date-fns/locale'
import { formatRelative } from "date-fns";
import  Axios  from "axios";
import {Alert}  from "react-bootstrap";
import Tippy from '@tippyjs/react';




const GeraAnfs = (props) => {
console.log(props.anfs)
const anfs = props.anfs.map((i) => (
  <a key={i.userId} href={"/anfitrioes#"+ i.username} className="text-decoration-none ">
<li  className='list-group-item text-white bg-warning flex-fill ms-2'>{i.username}</li>
</a>
))

return (
<ul className="list-group text-break list-group-horizontal mt-2 mb-2">
    {anfs}
</ul>

)

}

function showCancel(canc){
  return  canc? <div style={{float:"right"}} className="me-4"><X className="text-danger" size={40}></X>
 
  <span class='text-danger h3'>Cancelada!</span></div> : "";
  
}

 


export const DialogSelect = ({ show, handleClose, handleShowAlert,e, salaId,tema}) =>{
    const [alert, setAlert] = useState(false);
    

     
     

    async function handleConfirmReserva(props){
        try {
          const response = await Axios.post("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/reservas/",{
            salaId:props.salaId,
            nPessoas:props.nPessoas,
            dataI:props.dataI
    
    
          },{withCredentials:true}).then((res) =>{
            if (res.status!=200) {
                throw new Error(res.statusText);
              }else{
                handleShowAlert({
                  msg:"Reserva realizada com sucesso!",
                  style:"success"
                
              })
                handleClose()
              }
             
        });
         
        } catch (err) {
          //setError(err.message);
        }
      };
    

    const [nPessoas, setNPessoas] = useState(tema.minPessoas);
;    console.log(e)

    return (
        <>
        <Alert variant="success" show={alert}></Alert>
          <Modal  show={show} onHide={handleClose}>
            <Modal.Header closeButton className="bg-primary">
            
              <Modal.Title>

              <h5 className="modal-title">Confirmar reserva para  {e.startStr}</h5>
              
              </Modal.Title>
              
            </Modal.Header>
            <Modal.Body className="bg-dark" >
            <span className="text-center">Número de pessoas:</span>
<div className="input-group">
<div style={{maxWidth:"75px"}} className="border border-success border-3">


    <span className="input-group-text bg-white text-warning text-bold" >€
        <span id="preco" className="input-group-text bg-white text-black" style={{maxWidth:"40px"}}>{nPessoas * tema.preco}</span>

    </span>
    </div>
    <div className="form-floating ms-5  ">
 
        <input type="number" id="nPessoasInput" className="w-100 h-100" onChange={e=> setNPessoas(e.target.value)} min={tema.minPessoas} value={nPessoas}  max={tema.maxPessoas}></input>
        
    </div>
</div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Fechar
              </Button>
              <Button variant="success" onClick={ () => handleConfirmReserva({salaId:tema.salaId,nPessoas:nPessoas,dataI:e.startStr})}>
                Confirmar reserva
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );


}

export const DialogEvent = ({ show, handleClose,handleShowAlert, e }) => {
  let disabled = e.dataI

  async function handleCancelaReserva(id){
    try {
      const response = await Axios.put("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/reservas/"+id,{},
        { withCredentials: true }).then((res) =>{
        if (res.status!=200) {
            throw new Error(res.statusText);
          }else{
            handleShowAlert({
             msg: "Reserva cancelada com sucesso!",
             style:'success'
          })
            handleClose()
          }
         
    });
     
    } catch (err) {
      //setError(err.message);
    }
  };
 
  return (
    <>
      <Modal  show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        {showCancel(e.cancelada)}
          <Modal.Title>Reserva nº {e.idReserva} - {formatRelative(e.dataInicialDate,new Date(),{locale:pt})}
         
          
          </Modal.Title>
          
        </Modal.Header>
        <Modal.Body className="bg-dark" >
          <div className="row">
            <div className="col ">
              <div>
                Ínicio :<span className="text-success ms-1">{e.dataI}</span>
              </div>
              <div>
                Fim : <span className="text-danger ms-1">{e.dataF}</span>
              </div>
            </div>
            <div className="col">
              <div className="text-info">Número de pessoas:{e.nPessoas}</div>
              <div>
                Sala: <span>{e.sala}</span>
              </div>
            </div>
            <div className="mt-2 text-center  ">
              Tema: <span className={`text-${e.temaDif}`}>{e.temaNome}</span>
            </div>
            <div class="mt-2 text-center  ">
    
     Preço Total: <span class="text-success">{e.totalPreco}€</span>
    
</div>
            <div className="mt-2 text-center  ">
            <GeraAnfs anfs={e.anfs}></GeraAnfs>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Fechar
          </Button>
          <Tippy  allowHTML={true}
 content={!(addHours(new Date(),48) <= e.dataInicialDate) ? 'As reservas apenas podem ser canceladas até 48h antes da data marcada' : 'Cancelar reserva'}>
 <div>
          <Button variant="danger" hidden={e.cancelada} disabled={!(addHours(new Date(),48) <= e.dataInicialDate)} onClick={ () => handleCancelaReserva(e.idReserva)}>
          <SlashCircle className="text-white me-3" size={20}></SlashCircle>
            Cancelar reserva
          </Button>
          </div>
          </Tippy>
        </Modal.Footer>
      </Modal>
    </>
  );
};


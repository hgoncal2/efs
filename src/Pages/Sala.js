import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
export const Sala = (props) => {
const { id } = useParams();
const [salaId, setSalaId] = useState('');
const [sala, setSala] = useState('');
  const [numero, setNumero] = useState('');
  const [area, setArea] = useState('');
  const [listaAnfitrioes, setListaAnfitrioes] = useState([]);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null); 


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
    const fetchSala = async () => {
      try {
        const response = await Axios.get("http://localhost:5206/api/gerir/salas/" + id).then((res) =>{
            if (res.status!=200) {
                throw new Error(res.statusText);
              }
              const data =res.data;
              setSala(data);
        });
        
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSala();
  }, [sala]);


  const editSala = async() => {
    try{
      const response = await Axios.put("http://localhost:5206/api/gerir/salas/" + id, {withCredentials: true});
      if(response.status == 200){
        setSala(sala);
      }else{
        throw new Error('Erro ao apagar Sala!');
      }
    }catch(err){
      setError('Erro ao editar Sala!');
    }
  }

  return (
    
   
    
    <div className="row w-100">
      <div col-md={4}>
        <div style={{margin:"10px 10px 30px 15px "}}>
            <h1 style={{width:'100% '}}>Sala {sala.salaId}</h1>
            <hr className="w-100"></hr>
        </div>
        <form onSubmit={editSala}>
          <div style={{margin:'10px 10px 10px 0px'}} >
            <label htmlFor="numero">Número da Sala</label>
            <br />
            <input            
              style={{backgroundColor:'#6495ED'}}
              type="text"
              
              id="numero"
              value={sala.numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
         
          <div style={{margin:'10px 10px 10px 0px'}}>
            <label htmlFor="Area">Area</label>
            <br />
            <input
              style={{backgroundColor:'#6495ED'}}
              type="area"
              id="area"
              value={sala.area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div style={{margin:'10px 10px 10px 0px'}}>
            <label style={{}} htmlFor="listaAnfitrioes">Anfitriões</label>
            <br />
            <input
              style={{backgroundColor:'#6495ED'}}
              type="listaAnfitrioes"
              id="listaAnfitrioes"
              value={sala.listaAnfitrioes}
              onChange={(e) => setListaAnfitrioes(e.target.value)}
            />
          </div>
          <button className="btn btn-success" style={{margin: '10px',  color:'white'}} type="submit">Guardar Alterações</button>
          {error && <p style={{ color: 'red', font:'bold' }}>{error}</p>}
        </form>
      </div>
    </div>
  );

}
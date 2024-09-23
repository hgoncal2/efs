import React, { useEffect, useState, useContext } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { getDifColor } from "../App";

import { LinkContainer } from "react-router-bootstrap";
import Select from "react-select";

import { UserContext } from "../App";
import { PencilFill } from "react-bootstrap-icons";
import Axios from "axios";
import Button from "react-bootstrap/Button";
import { Card, Stack, Form, Row, Col,Alert } from "react-bootstrap";
import { format } from "date-fns";

import "bootstrap/dist/css/bootstrap.min.css";

import Carousel from "react-bootstrap/Carousel";

export const EditaSala = () => {
  const [sala, setSala] = useState([]);
  const { id } = useParams();   
   const [error, setError] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [showAlert, setShowAlert] = useState(null);

  const navigate = useNavigate(); // Para redirecionar após o login


  if(user == null || (!user.roles.includes("Anfitriao") && !user.roles.includes("Admin"))){
navigate(-1)
  }

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
        // "showTemasSemSala=true",por defeito é false
        const response = await Axios.get("https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/salas/"+id).then((res) =>{
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

    fetchTemas();
  }, []);
  if (error) {
    return (
      <h1>
        Error: <span className="text-danger">{error}</span>
      </h1>
    );
  }


  const ConstroiSelect = ({ anfs, allAnfs ,handleSelect }) => {
    
    const a = allAnfs.map((i) => (
      <option selected={anfs.includes(i.username)}  value={i.username}>{i.username}</option>
    ))

    return (
      <Form.Select multiple aria-label="Default select example" onChange={(e) => handleSelect(e.target.value)}>
           {a}
    </Form.Select>
       
      
    )
  }
    


  const ConstroiSala = (props) => {
    //dados do anf
    const [numero, setNumero] = useState(props.dados.numero);
    const [area, setArea] = useState(props.dados.area);
    const [listaAnfs, setListaAnfs] = useState(props.dados.listaAnfitrioes);
    const [allAnfits, setAllAnfits] = useState(
      props.dados.anfsWrappersList.map((anf) => ({
        value: anf.username,
        label: anf.username
      }))
    );
    const [selectedAnfs, setSelectedAnfs] = useState(
      props.dados.listaAnfitrioes.map((anf) => ({
        value: anf,
        label: anf
      }))
    );

    


    const editaSala = async () =>{
      try {
        let formData = new FormData();
        formData.append("numero", numero);
        formData.append('salaId',id)
        formData.append("area", area);
        formData.append("listaAnfitrioes",selectedAnfs ? selectedAnfs.map(option => option.value) : [])
        

        
    
    
    
        //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
        // "showTemasSemSala=true",por defeito é false
        const response = await Axios.put(
          "https://23327-a5cpgeh9hwevc7gp.northeurope-01.azurewebsites.net/api/gerir/salas/" + id,
    
            formData
    
          ,{withCredentials:true}
        ).then((res) => {
          if (res.status != 200) {
            throw new Error(res.statusText);
          }
          const data = res.data;
         setShowAlert({msg : "Sala atualizado com sucesso!" , style:"success"})
          setTimeout(() => {
            window.location.reload() // Esconder o alerta após 1,2 segundos, por exemplo
          }, 1200);
        });
      } catch (err) {
       setShowAlert({msg:"Erro a guardar anfitrião!Certifique-se que o nome não pode ter letras,e tem no mínimo 20 caracteres",style:"danger"});
      }
    };
    
    



    function onSelect(selectedOptions){
      setSelectedAnfs(selectedOptions || []); 
      console.log("Anfitriões selecionados: ", selectedOptions);

      
    }
    

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? "white" : "blue",  
        backgroundColor: state.isSelected ? "blue" : "white",  
        ":hover": {
          backgroundColor: "lightgray",  
          color: "black"
        }
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: "black", 
         
      }),
    };

    const form = () => (

      
      <Form className="text-center align-center">
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col className="ms-5" sm={5}>
            <Form.Label column sm={2}>
              Numero
            </Form.Label>
            <Form.Control
              type="text"
              
              value={numero}
              onChange={(e) => setNumero(e.target.value)}

            />
          </Col>
        
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col className="ms-5" sm={5}>
          <Form.Label column sm={2}>
              Area
            </Form.Label>
            <Form.Control
              
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Col>
          
           
          
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col className="ms-5" sm={5}>
          
          <Select
        isMulti
        styles={customStyles}
        value={selectedAnfs} // Define o valor selecionado atual
        onChange={onSelect} // Chama quando o select é alterado
        options={allAnfits} // Passa as opções de anfitriões
      />   
          </Col>
          
           
          
        </Form.Group>

      
        

        <Button onClick={editaSala} variant="primary" >
          Guardar
        </Button>
      </Form>
    );

    return <div>

    {form()}
    </div>;
  };

  
  return (
    <div className="home">
         {showAlert!=null && <Alert variant={showAlert.style} dismissible onClose={() => setShowAlert(null)}>{showAlert.msg}</Alert>}

      <section className="titulo">
       {sala.length!=0 && <ConstroiSala dados={sala}></ConstroiSala>} 
      </section>
    </div>
  );
};

export default EditaSala;

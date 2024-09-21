import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDifColor } from "../App";
import {LinkContainer} from "react-router-bootstrap";
import Axios from "axios";
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';

import Carousel from "react-bootstrap/Carousel";

export const Home = () => {
  const [temas, setTemas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        //Se quisermos ver todos os temas,não apenas os que têm sala atribuida,podemos passar o param
        // "showTemasSemSala=true",por defeito é false
        const response = await Axios.get("http://localhost:5206/api/gerir/temas").then((res) =>{
            if (res.status!=200) {
                throw new Error(res.statusText);
              }
              const data =res.data;
              setTemas(data);
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

  const Teste = (props) => {
    const i = 0;

    const rows = props.dados.map((row) => (
      
        <tr key={row.temaId}
          className={`border border-${getDifColor(
            row.dificuldade
          )} border-2 m-4`}
        >
          <td style={{ width: "50%" }}>

          <img className="d-block w-100" style={{ height: "300px" }} src={`http://localhost:5206/Imagens/${row.listaDeFotos[0]}`} alt="First slide" title={row.nome} />
          </td>
          <td className="text-center">
          <div className="h3 text-center text-@c mt-4">

                {row.nome}
</div>
 <div className="text-center text-info mt-4">
     {row.descricao}
 </div>
 <div className="mt-4">
 <LinkContainer to={`/temas/reserva/${row.salaID}`}>
        <Button className={`btn btn-outline-${getDifColor(row.dificuldade)}`} as="a" variant="">VER TEMA</Button>
        </LinkContainer>
</div>
          </td>
        </tr>
      
    ));
    
    return (
<table className="table">
<tbody>
{rows}

</tbody>
</table>

    )
  };

  if (temas.length === 0 || !temas) {
    return <h1>Nenhum tema!</h1>;
  }
  return (
    <div className="home">
      <section className="titulo">
        <Teste dados={temas}></Teste>
      </section>
    </div>
  );
};

export default Home;

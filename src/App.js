import logo from './logo.svg';

import "bootswatch/dist/superhero/bootstrap.min.css"
import './App.css';
import NavBar from './App/navbarTeste';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import
import { BrowserRouter as Router,Route,Routes,useParams,useNavigate} from 'react-router-dom';
import { Home } from './Pages/Home';
import { Alert } from "react-bootstrap";

import { Temas } from './Pages/Temas';
import { ReservasSala } from './Pages/ReservasSala.js';
import  Axios  from 'axios';
import { Login } from './Pages/Login.js';
import Cookies from 'js-cookie';

import { NotFound } from './Pages/404';
import { useState,useEffect,createContext  } from 'react';

export function getDifColor(difficulty){

  if (difficulty == 0) return "success";
  if (difficulty == 1) return "warning";
  if (difficulty == 2) return "danger";
  if (difficulty == 3) return "secondary";

}

export const UserContext = createContext(null);



function App()  {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [logoutSucc, setLogoutSucc] = useState(false);
  
  const handleLogOut = async () => {
  
    try {
      const response = await Axios.put("http://localhost:5206/api/gerir/account",{},{withCredentials:true}).then((res) =>{
        if (res.status!=200) {
            throw new Error(res.statusText);
          }
          
      sessionStorage.removeItem("user");
      setUser(null)
      setLogoutSucc(true)
      setTimeout(() => {
        window.location.reload(); // Esconder o alerta após 1,2 segundos, por exemplo
      }, 1200);
     
    });
     
    } catch (err) {
      setError(err.message);
    }
  };







  useEffect(() => {
    
    const verificaLogIn = async () => {
      try {
        const response = await Axios.get("http://localhost:5206/api/gerir/account",{withCredentials:true}).then((res) =>{
          if (res.status!=200) {
              throw new Error(res.statusText);
            }
            const data = res.data;
        setUser(data)
      });
       
      } catch (err) {
        setError(err.message);
      }
    };
    verificaLogIn();
    
    
  }, []);
  console.log(user)

  if(user != null && window.location.pathname =="/login"){
 //   window.location.pathname="/";
  }

  return (
    
    <div className='App' >
 {logoutSucc && <Alert variant="success" dismissible onClose={() => setLogoutSucc(false)}>Logout com sucesso!</Alert>}

<UserContext.Provider value={{ user: user, setUser: setUser }}>

    <header >
        <NavBar handleLogOut={handleLogOut} />
      </header>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/temas" element={<Temas/>}></Route>
        <Route path="/temas/reserva/:id" element={<ReservasSala/>}></Route>
        <Route path="/login" element={<Login/>}></Route>

      </Routes>
    </Router>
    </UserContext.Provider>
    </div>
  );
}

export default App;

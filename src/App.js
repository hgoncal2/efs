import logo from './logo.svg';

import "bootswatch/dist/superhero/bootstrap.min.css"
import './App.css';
import NavBar from './App/navbarTeste';
import { BrowserRouter as Router,Route,Routes,useParams} from 'react-router-dom';
import { Home } from './Pages/Home';
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

  return (
    
    <div className='App' >

<UserContext.Provider value={{ user: user, setUser: setUser }}>

    <header >
        <NavBar  />
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

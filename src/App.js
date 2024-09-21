import logo from './logo.svg';
import "bootswatch/dist/superhero/bootstrap.min.css"
import './App.css';
import NavBar from './App/navbarTeste';
import { BrowserRouter as Router,Route,Routes,useParams} from 'react-router-dom';
import { Home } from './Pages/Home';
import { Temas } from './Pages/Temas';
import { ReservasSala } from './Pages/ReservasSala.js';
import { NotFound } from './Pages/404';

export function getDifColor(difficulty){

  if (difficulty == 0) return "success";
  if (difficulty == 1) return "warning";
  if (difficulty == 2) return "danger";
  if (difficulty == 3) return "secondary";

}

function App()  {
  return (
    <div className='App' >
    <header >
        <NavBar  />
      </header>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/temas" element={<Temas/>}></Route>
        <Route path="/temas/reserva/:id" element={<ReservasSala/>}></Route>
        
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;

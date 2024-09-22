import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState,useContext } from 'react';
import handleLogOut from '../App'
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';


import { UserContext } from '../App';



function NavBar({handleLogOut}) {
  const { user, setUser } = useContext(UserContext);
  return (
    <Navbar expand="lg" className="bg-primary" data-bs-theme="light" >
      <Container>
        <Navbar.Brand href="/" className='text-body'>Escape From Sellium</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/temas" className='text-body'>Temas</Nav.Link>
            {/* <Nav.Link href="#link" className='text-light'>Link</Nav.Link> */}
            
           
           
          </Nav>
          {user == null ? (
            <Nav.Link href="/login" className='text-body'>Login</Nav.Link>
          ) : (
            <NavDropdown title={user.username} className="ms-auto me-0 float-end">
              <NavDropdown.Item onClick={handleLogOut}>Logout</NavDropdown.Item>
              
            </NavDropdown>
          )}
          
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavBar;
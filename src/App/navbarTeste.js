import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React, { useState,useContext } from 'react';

import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';


import { UserContext } from '../App';



function NavBar() {
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
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
           
           
          </Nav>
          <Nav className="ms-auto me-0 float-end">
          {user == null ? <Nav.Link href="/login" className='text-body'>Login</Nav.Link> : <span>{user.username}</span> }
          

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavBar;
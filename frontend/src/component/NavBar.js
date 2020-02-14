import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavBar = (props) => {
  const { boardNames } = props;
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/home">SKNC</Navbar.Brand>
      <Nav className="mr-auto">
        {
          boardNames.map((item) => (
            <Nav.Link key={item} href={item}>{item}</Nav.Link>
          ))
        }
      </Nav>
    </Navbar>
  )
}

export default NavBar;

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { title } from '../settings';

// TODO : admin logout, font size modification, En/Ko, etc
const NavBar = (props) => {
  const { boardNames } = props;
  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="/home"><b>{title}</b></Navbar.Brand>
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

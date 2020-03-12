import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { title, boards } from '../settings';


const NavBar = (props) => {
  // TODO : this is not working; maybe because this is component?
  // TODO : useLocation() to get current url ?
  const loggedIn = true;
  const admin = true;

  const signout = () => {
    // TODO : do actual signout
    console.log("sign out")
  }


  const overlayBundle = (
    // TODO : logout
    // TODO : change password
    // TODO : if admin, control panel (edit user role)
    <Popover id={`popover-bundle`}>
      <Popover.Content>
        <Button
          variant='light'
          onClick={() => {
            signout();
          }}>sign out</Button>
        <br />
        <Button variant='light' href='/account'>account</Button>
        {
          admin
            ? <><hr /><Button variant='outline-primary' href='/manage'>
              manage
              </Button></>
            : <></>
        }
      </Popover.Content>
    </Popover>
  )

  // TODO

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="/home"><b>{title}</b></Navbar.Brand>
      <Nav className="mr-auto">
        {
          Object.keys(boards).map((item) => (
            <Nav.Link
              key={item}
              href={item}
            >{boards[item][0]}</Nav.Link>
          ))
        }
      </Nav>
      {
        loggedIn
          ?
          <OverlayTrigger
            trigger="click"
            rootClose
            placement="bottom"
            overlay={overlayBundle}
          >
            <Button variant="outline-secondary">
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </OverlayTrigger>
          :
          <Button
            variant="outline-secondary"
            href="/signin"
          >
            <FontAwesomeIcon icon={faKey} />
          </Button>
      }
    </Navbar>
  )
}

export default NavBar;

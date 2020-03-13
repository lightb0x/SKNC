import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import { signout, getRole } from '../action/user';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { title, boards, cookieLogin, adminRole } from '../settings';

import './NavBar.css';


const NavBar = (props) => {
  // TODO : this is not working; maybe because this is component?
  // TODO : useLocation() to get current url ?
  const { signout, role, getRole } = props;

  const loggedIn = Cookies.get(cookieLogin) != null;
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getRole()
    setAdmin(role === adminRole)
  }, [setAdmin, role, getRole])

  const overlayBundle = (
    <Popover id={`popover-bundle`}>
      <Popover.Content>
        <Button
          variant='light'
          onClick={() => {
            signout();
            window.location.reload(false);
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
    <Navbar bg="light" variant="light" className='no-padding-xs'>
      <Navbar.Brand href="/home" className='margin-right-auto-xs'>
        <b>{title}</b>
      </Navbar.Brand>
      <Nav className="mr-auto">
        {
          Object.keys(boards).map((item) => (
            <Nav.Link
              className="margin-auto-xs"
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
            <Button
              className="margin-auto-xs"
              variant="outline-secondary"
            >
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </OverlayTrigger>
          :
          <Button
            className="margin-auto-xs"
            variant="outline-secondary"
            href="/signin"
          >
            <FontAwesomeIcon icon={faKey} />
          </Button>
      }
    </Navbar>
  )
}

const mapStateToProps = (state) => ({
  role: state.user.role,
});

const mapDispatchToProps = (dispatch) => ({
  signout: () => dispatch(signout()),
  getRole: () => dispatch(getRole()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { useKeyPressEvent } from 'react-use';
import { useHistory } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { signin, getRole } from '../action/user';

import PropTypes from 'prop-types';

import { cookieLogin } from '../settings';
import '../center.css';

function Signin(props) {
  const { signin, failed, role } = props;
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isEmpty = () => { return !username || !password; };

  const keydown = () => { submit(); };
  useKeyPressEvent('Enter', keydown);

  const submit = () => {
    if (isEmpty()) {
      return;
    }

    signin(username, password)
    setUsername('');
    setPassword('');
  };

  // redirect to `/` if already logged in
  useEffect(() => {
    if (Cookies.get(cookieLogin) != null) {
      history.push('/')
    }
  }, [role, history])

  return (
    <div className="signin">
      <Alert variant='warning' style={{ textAlign: "center" }}>
        <p style={{
          marginBottom: 0,
        }}>이 사이트에서는 로그인 관리를 위해 쿠키를 사용합니다.</p>
        <p style={{
          marginBottom: 0,
        }}>로그인 시도시 쿠키 사용에 동의하는 것으로 간주합니다.</p>
      </Alert>
      <Card style={{
        width: '22rem',
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <Card.Body>
          <Card.Title>Welcome</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            please login
          </Card.Subtitle>
          <Form>
            <br />
            <Form.Control
              type="username"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <br />
            <Form.Control
              id="pw"
              type="password"
              placeholder="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p style={{
              fontSize: 'small',
              textAlign: 'left',
            }}><a href='/reset'><u>비밀번호를 잊어버렸나요?</u></a></p>
            <br />
            {
              failed
                ? <p style={{
                  fontSize: 'small',
                  color: 'red',
                  marginBottom: '5px',
                  textAlign: 'right',
                }}>로그인에 실패하였습니다</p>
                : <br />
            }
            <Button
              variant="outline-secondary"
              onClick={() => { history.push('/signup') }}
            >
              signup
            </Button>
            <Button
              id="submit"
              variant="primary"
              disabled={isEmpty()}
              onClick={() => { submit(); }}
              style={{
                float: "right"
              }}
            >
              submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
};

const mapStateToProps = (state) => ({
  failed: state.user.signinFailed,
  role: state.user.role,
})

const mapDispatchToProps = (dispatch) => ({
  signin: (username, password) => dispatch(signin(username, password)),
  getRole: () => dispatch(getRole()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signin);

Signin.propTypes = {
  failed: PropTypes.bool.isRequired,
  signin: PropTypes.func.isRequired,
  getRole: PropTypes.func.isRequired,
};

import React, { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../center.css';

// TODO : login feature (redux)
export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isEmpty = () => { return !username || !password; };

  const keydown = () => { submit(); };
  useKeyPressEvent('Enter', keydown);

  const submit = () => {
    if (isEmpty()) {
      return;
    }
    setUsername('');
    setPassword('');
    // TODO : do actual submit!
    console.log('submit')
  };

  return (
    <div className="center">
      <Card style={{ width: '22rem' }}>
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
            <br />
            <br />
            {/* type="submit" ? */}
            <Button
              id="submit"
              variant="primary"
              disabled={isEmpty()}
              onClick={() => { submit(); }}
            >
              submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
};

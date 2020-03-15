import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
  return (
    <div>
      <br />
      <br />
      <br />
      <Spinner animation="border" role="status" variant="secondary" style={{
        position: "absolute", left: "50%",
      }}><span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  )
}

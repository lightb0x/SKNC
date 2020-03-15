import React from 'react';
import Image from 'react-bootstrap/Image';

import BoardEntry from '../component/BoardEntry';

export default function Home(props) {
  return (
    <div>
      <Image
        src="sknc.jpg" alt="sknc"
        style={{
          // image does not go out of view
          maxWidth: "100%",
          // image size cap
          maxHeight: "500px",
          // horizontal center
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      {/* what's new OR recommended OR trending OR random article for you 
          OR ... */}
      <BoardEntry boardName={"what's new"} />
    </div>
  )
}

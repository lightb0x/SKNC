import React from 'react';
import BoardEntry from '../component/BoardEntry';

export default function Boards(props) {
  const boardName = props.match.path.slice(1);
  return (
    <div>
      <br />
      <BoardEntry boardName={boardName} />
    </div>
  )
}

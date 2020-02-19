import React from 'react';
import BoardEntry from '../component/BoardEntry';

export default function Boards(props) {
  const boardName = props.match.path.slice(1);
  // TODO : get articles from DB
  // TODO : get more articles on scroll end
  return (
    <div>
      <br />
      <BoardEntry boardName={boardName} articles={[]} search />
    </div>
  )
}

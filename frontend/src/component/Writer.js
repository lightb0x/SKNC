import React from 'react';

import ComplexWriter from './ComplexWriter';
import SimpleWriter from './SimpleWriter';

import PropTypes from 'prop-types';

export default function Writer(props) {
  const { complex, id } = props;
  return (
    complex
      ? <ComplexWriter id={id} />
      : <SimpleWriter />
  )
}

Writer.propTypes = {
  id: PropTypes.string,
  complex: PropTypes.bool,
};

import React from 'react';
import Card from 'react-bootstrap/Card';

import PropTypes from 'prop-types';

export default function ArticleEntry(props) {
  return (
    <div>
      <Card>

      </Card>
    </div>
  )
}

ArticleEntry.propTypes = {
  article: PropTypes.object.isRequired,
};

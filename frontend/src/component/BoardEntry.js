import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import ArticleEntry from './ArticleEntry';

import PropTypes from 'prop-types';

import { boards, searchType } from '../settings';

export default function BoardEntry(props) {
  const { articles, boardName, search } = props;
  const description = boards[boardName];

  const [searchT, setSearchT] = useState(searchType[0]);
  const [searchBy, setSearchBy] = useState('');

  const dropdownItemFactory = (name) => {
    return (
      <Dropdown.Item key={name} onSelect={() => setSearchT(name)}>
        {name}
      </Dropdown.Item>
    )
  };

  return (
    <div>
      <h3>{boardName}{description ? <br /> : ''}<b>{description}</b></h3>
      {
        search
          ? (
            <Container><Row>
              <Col></Col>
              <Col xs={12} sm={10} md={10} lg={10} xl={10}>
                <InputGroup>
                  <b><DropdownButton
                    variant="light"
                    as={InputGroup.Prepend}
                    title={searchT}
                  >
                    {
                      searchType.map(function (item) {
                        return (dropdownItemFactory(item));
                      })
                    }
                  </DropdownButton></b>
                  <FormControl
                    value={searchBy}
                    onChange={(event) => {
                      setSearchBy(event.target.value)
                    }}
                  />
                  <InputGroup.Append>
                    <Button disabled={!searchBy} variant="danger">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
              <Col></Col>
            </Row></Container>
          )
          : <hr />
      }
      {
        articles.map(function (item) {
          return (
            <ArticleEntry article={item} />
          )
        })
      }
    </div>
  );
}

BoardEntry.defaultProps = {
  search: false,
};

BoardEntry.propTypes = {
  articles: PropTypes.array.isRequired,
  boardName: PropTypes.string.isRequired,
  search: PropTypes.bool.isRequired,
};
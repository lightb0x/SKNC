import React, { useState } from 'react';
import { connect } from 'react-redux';
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

function BoardEntry(props) {
  const { boardName } = props;
  // const boardName = props.match.path.slice(1);
  const board = boards[boardName];
  let description, search, load, header;
  if (board === undefined) {
    description = null;
    search = false;
    load = false;
    header = boardName
  } else {
    description = board[1];
    search = true;
    load = true;
    header = boards[boardName][0]
  }

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
      <h3>
        {header}
        {description ? <br /> : ''}<b>{description}</b>
      </h3>
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
      {/* TODO : https://www.npmjs.com/package/react-infinite-scroller */}
      {/*        if load === true */}
      {/* {
        articles.map(function (item) {
          return (
            <ArticleEntry article={item} />
          )
        })
      } */}
    </div>
  );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoardEntry);

BoardEntry.propTypes = {
  boardName: PropTypes.string.isRequired,
};

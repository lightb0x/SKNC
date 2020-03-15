import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useKeyPressEvent } from 'react-use';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { getRole } from '../action/user';
import { fetchArticleList } from '../action/article';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit } from '@fortawesome/free-solid-svg-icons';

import ArticleEntry from './ArticleEntry';

import PropTypes from 'prop-types';

import {
  boards,
  searchType,
  adminRole,
  staffRole,
  userRole,
  allUser,
  staffOnly,
} from '../settings';

function BoardEntry(props) {
  const history = useHistory();
  const { boardName, role, getRole } = props;

  const board = boards[boardName];
  let description, search, header;
  if (board === undefined) {
    description = null;
    search = false;
    header = boardName
  } else {
    description = board[1];
    search = true;
    header = boards[boardName][0]
  }

  const [searchT, setSearchT] = useState(searchType[0]);
  const [searchBy, setSearchBy] = useState('');
  const [staff, setStaff] = useState(false);
  const [user, setUser] = useState(false);
  useEffect(() => {
    getRole();
    const isStaff = (role === adminRole || role === staffRole);
    setStaff(isStaff);
    setUser(role === userRole || isStaff);
  }, [setStaff, setUser, role, getRole])


  const handleSearch = () => {
    if (searchBy) {
      // TODO : go search
    } else {
      // TODO : dismiss
    }
  };
  useKeyPressEvent('Enter', handleSearch);

  const dropdownItemFactory = (name) => {
    return (
      <Dropdown.Item key={name} onSelect={() => setSearchT(name)}>
        {name}
      </Dropdown.Item>
    )
  };
  return (
    <div>
      <Container><Row>
        <Col>
          <h3>
            {header}
            {description ? <br /> : ''}<b>{description}</b>
          </h3>
        </Col>
        <Col xs="auto">
          {
            staff && staffOnly.includes(boardName)
              ? (
                <Button onClick={() => history.push('/draft')} style={{
                  paddingRight: "8px",
                }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              ) : ''
          }
          {
            user && allUser.includes(boardName)
              ? (
                <Button onClick={() => history.push('/write')} sylte={{
                  paddingRight: "8px",
                }}>
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              ) : ''
          }
        </Col>
      </Row></Container>
      {
        search
          ? (
            <Container><Row>
              <Col></Col>
              <Col xs={12} md={10}>
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
                    {/* TODO : search on enter */}
                    <Button disabled={!searchBy} variant="danger"
                      onClick={() => { handleSearch(); }}>
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
    </div >
  );
}

const mapStateToProps = (state) => ({
  role: state.user.role,
  articles: state.article.articleList,
});

const mapDispatchToProps = (dispatch) => ({
  getRole: () => dispatch(getRole()),
  getArticles: (option) => dispatch(fetchArticleList(option)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoardEntry);

BoardEntry.propTypes = {
  boardName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  getRole: PropTypes.func.isRequired,
  articles: PropTypes.array.isRequired,
  getArticles: PropTypes.func.isRequired,
};

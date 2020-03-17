import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2'

import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faCode,
  faFileImage,
  faCloudUploadAlt,
  faNewspaper,
} from '@fortawesome/free-solid-svg-icons';

import ImageEditor from './ImageEditor';
import { fetchImages, fetchHTML } from '../action/draft';
import { postArticle, editArticle, fetchArticle } from '../action/article';
import PropTypes from 'prop-types';

import { boards, staffOnly } from '../settings';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './ComplexWriter.css';
import '../article-view.css';

require('codemirror/mode/xml/xml');

function ComplexWriter(props) {
  const history = useHistory();
  const {
    id, getImages, getHTML, images, code, postArticle, edit, editArticle,
    fetchArticle, invalid, articleID,
  } = props;
  const [boardname, setBoardname] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [localCode, setLocalCode] = useState('');

  const [alertShow, setAlertShow] = useState(true);

  useEffect(() => {
    if (!edit) {
      getImages(id);
      getHTML(id)
    }
  }, [edit, getImages, getHTML, id]);

  useEffect(() => {
    if (edit) {
      fetchArticle(id)
    }
  }, [edit, fetchArticle, id]);

  useEffect(() => {
    if (articleID) {
      history.push('/' + articleID);
    }
  }, [articleID, history]);

  // TODO : useEffect to update boardname, title, summary, localCode

  useEffect(() => {
    setLocalCode(code);
  }, [setLocalCode, code]);

  const dropdownItemFactory = (name) => {
    return (
      <Dropdown.Item key={name} onSelect={() => setBoardname(name)}>
        {name}
      </Dropdown.Item>
    )
  };

  function handleSubmit() {
    if (edit) {
      editArticle(id, title, summary, thumbnail, localCode);
    } else {
      postArticle(id, boardname, title, summary, thumbnail, localCode, images);
    }
  }

  function setFile(e) {
    const imageFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function () {
      setThumbnail(reader.result);
    };
  }

  return (
    <div>
      <p>id = {id}</p>
      {
        invalid.length === 0
          ? '' : <Container><Row><Col></Col>
            <Col xs={12} md={10}>
              <Alert variant='danger' style={{ textAlign: 'center' }}>
                <p><b>{invalid.join(", ")}</b> 파일은 지원되지 않습니다.</p>
                <p>워드파일의 원본 사진을 바꿔 다시 업로드해주세요.</p>
                <p>지원 확장자 : <b>jpg, jpeg, png</b></p>
              </Alert>
            </Col>
            <Col></Col></Row></Container>
      }
      {
        Object.keys(images) === 0
          ? '' : <Alert variant='warning' style={{ textAlign: "center" }}>
            {/* TODO : ONLY-SHOW when image is there */}
            <p>자른 이미지는 기사 미리보기에 적용되지 않습니다</p>
            <p><b>하지만 등록하면 제대로 적용됩니다!</b></p>
          </Alert>
      }
      <InputGroup>
        <b><DropdownButton
          disabled={edit}
          as={InputGroup.Prepend}
          title={boardname ? boardname : '게시판 선택'}
        >
          {
            Object.keys(boards).map(function (item) {
              if (staffOnly.includes(item)) {
                return (dropdownItemFactory(item));
              }
              return '';
            })
          }
        </DropdownButton></b>
        <FormControl
          placeholder="제목 (필수, 120자 이하)"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
          }}
        />
        <InputGroup.Append>
          <Button disabled={!title || !boardname || !summary}
            onClick={() => { handleSubmit(); }}>
            <FontAwesomeIcon icon={faCloudUploadAlt} />
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <br />
      <Tabs defaultActiveKey="preview">
        <Tab eventKey="preview" title={<FontAwesomeIcon icon={faEye} />}>
          <div
            className="article-view"
            dangerouslySetInnerHTML={{ __html: localCode }}
          />
        </Tab>
        <Tab eventKey="edit" title={<FontAwesomeIcon icon={faCode} />}>
          {
            alertShow
              ?
              <Alert variant="primary" dismissible
                style={{ textAlign: "center" }}
                onClose={() => setAlertShow(false)}>
                <b>편집을 시작하려면 아래 파란 창을 클릭하세요!</b>
              </Alert>
              : ''
          }
          <CodeMirror
            value={localCode}
            options={{
              mode: 'xml',
              theme: 'material',
              lineNumbers: true,
            }}
            onBeforeChange={(_editor, _data, value) => {
              setLocalCode(value);
            }}
            onChange={(_editor, _data, _value) => { }}
          />
        </Tab>
        <Tab eventKey="show" title={<FontAwesomeIcon icon={faNewspaper} />}>
          <FormControl
            as="textarea"
            rows="3"
            placeholder="요약 (필수, 300자 이하)"
            value={summary}
            onChange={(event) => {
              setSummary(event.target.value)
            }}
          />
          {/* file input (thumbnail) */}
          <br />
          {/* TODO : ALERT THAT THUMBNAIL IS NOT EDITTABLE AFTERWARD,FOR NOW */}
          (선택)대표사진
          <input
            type="file"
            name="thumbnail"
            accept="image/jpeg, image/png"
            onChange={setFile.bind(this)} />
          <hr />
          {/* TODO : ArticleEntry preview */}
          preview
        </Tab>
        {
          edit ? '' :
            Object.keys(images).map(function (key) {
              return (
                <Tab eventKey={key} title={
                  <div><FontAwesomeIcon icon={faFileImage} />{key}</div>
                }>
                  <ImageEditor filename={key} />
                </Tab>
              )
            })}
      </Tabs>
    </div>
  )
}

const mapStateToProps = (state) => ({
  images: state.draft.images,
  code: state.draft.html,
  invalid: state.draft.invalid,
  articleID: state.draft.articleID,
});

const mapDispatchToProps = (dispatch) => ({
  getImages: (id) => dispatch(fetchImages(id)),
  getHTML: (id) => dispatch(fetchHTML(id)),
  postArticle: (
    id, boardname, title, summary, thumbnail, html, images,
  ) => dispatch(postArticle(
    id, boardname, title, summary, thumbnail, html, images,
  )),
  editArticle: (id, title, summary, thumbnail, html) => dispatch(
    editArticle(id, title, summary, thumbnail, html),
  ),
  fetchArticle: (id) => dispatch(fetchArticle(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ComplexWriter);

ComplexWriter.propTypes = {
  id: PropTypes.string.isRequired,
  edit: PropTypes.bool,
};

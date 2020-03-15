import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { useKeyPressEvent } from 'react-use';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Loading from '../component/Loading';
import Writer from '../component/Writer';
import { getRole } from '../action/user';

import { v1port, adminRole, staffRole, defaultRole } from '../settings';

function Draft(props) {
  const history = useHistory();
  const { role, getRole } = props;

  const [docx, setDocx] = useState(null);
  const [firstStep, setFirstStep] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [id, setID] = useState("");
  const [inputDraftID, setInputDraftID] = useState('');

  const [searchFail, setSearchFail] = useState(false);

  // get role on startup
  useEffect(() => {
    getRole();
  }, [getRole]);
  // check role
  useEffect(() => {
    const staff = (role === adminRole || role === staffRole);
    if (role !== defaultRole && !staff) {
      history.push('/');
    }
  }, [role, history]);

  useKeyPressEvent('Enter', handleDraftIDSubmit);

  function setFile(e) {
    setDocx(e.target.files[0]);
  }

  function postFile() {
    const formData = new FormData();
    formData.append('file', docx);

    axios.post(v1port + '/draft', formData).then(res => {
      setIsUploaded(true)
      setID(res.data.message)
    }).catch(err => {
      alert('에러 발생: 다시 시도해보세요');
    })
  }

  const isValidDraftID = () => {
    return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/g
      .test(inputDraftID);
  }

  function handleDraftIDSubmit() {
    setSearchFail(false);
    if (!isValidDraftID()) {
      setSearchFail(true);
      return;
    }
    axios.put(v1port + '/draft', { 'draftID': inputDraftID })
      .then(() => {
        // good to go
        setID(inputDraftID);
        setFirstStep(false);
      }).catch(() => {
        // no good
        setSearchFail(true);
      });
  }

  function DraftIDModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            발급된 draft ID입니다
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>문제가 생길 경우를 대비해서 복사해두세요</p>
          <p>draft ID를 가지고 있으면 원본을 다시 업로드하지 않아도 됩니다</p>
          <code><b>{id}</b></code>
          <p>창을 닫으면 글쓰기창으로 이동됩니다</p>
        </Modal.Body>
      </Modal>
    );
  }

  const onlyDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (role === defaultRole) {
    return (
      <Loading />
    )
  } else {
    return (
      <div>
        {
          firstStep
            ? <div>
              <br />
              <br />
              <h3>워드 파일을 업로드하거나,</h3>
              <input
                type="file"
                name="docx"
                accept={onlyDocx}
                onChange={setFile.bind(this)} />
              <input type="button" onClick={postFile} value="Upload" />
              <hr />
              <br />
              <h3>draft ID를 입력해주세요 (<code><b>-</b></code> 포함)</h3>
              <Container><Row>
                <Col></Col>
                <Col xs={12} md={10}>
                  <InputGroup>
                    <FormControl
                      value={inputDraftID}
                      onChange={(event) => {
                        setInputDraftID(event.target.value)
                      }}
                    />
                    <InputGroup.Append>
                      <Button variant="danger"
                        onClick={() => handleDraftIDSubmit()}
                      >
                        {/* TODO : search on enter */}
                        <FontAwesomeIcon icon={faSearch} />
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                  {
                    searchFail
                      ? <p style={{
                        fontSize: 'small',
                        color: 'red',
                        marginBottom: '5px',
                      }}>잘못된 draft ID입니다</p>
                      : <br />
                  }
                </Col>
                <Col></Col>
              </Row></Container>

              <DraftIDModal
                show={isUploaded}
                onHide={() => {
                  setIsUploaded(false);
                  setFirstStep(false);
                }}
              />
            </div>
            : <Writer complex id={id} />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  role: state.user.role,
});

const mapDispatchToProps = (dispatch) => ({
  getRole: () => dispatch(getRole()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Draft);

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import Writer from '../component/Writer';
import { getRole } from '../action/user';

import { v1port, adminRole, staffRole } from '../settings';

function Draft(props) {
  const history = useHistory();
  const { role, getRole } = props;

  const [docx, setDocx] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [staff, setStaff] = useState(false);
  const [id, setId] = useState("");

  // TODO : redux on draft HTML and images, using `id`
  useEffect(() => {
    getRole();
    setStaff(role === adminRole || role === staffRole);
  }, [setStaff, role, getRole])

  useEffect(() => {
    if (isUploaded) {
      history.push('/write')
    }
  }, [isUploaded, history])

  // if not staff or admin, redirect to `/`
  if (!staff) {
    history.push('/');
  }

  function setFile(e) {
    setDocx(e.target.files[0])
  }

  function postFile() {
    const formData = new FormData();
    formData.append('file', docx);

    axios.post(v1port + '/draft', formData).then(res => {
      setIsUploaded(true)
      setId(res.data.message)
    }).catch(err => {
      console.log(err)
      alert('에러 발생: 다시 시도해보세요')
    })
  }

  return (
    <div>
      {
        !isUploaded
          ? <div>
            <input
              type="file"
              name="docx"
              accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={setFile.bind(this)} />
            <input type="button" onClick={postFile} value="Upload" />
          </div>
          : <Writer complex id={id} />
      }
    </div>
  )
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

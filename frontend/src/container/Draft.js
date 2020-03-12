import React, { useState } from 'react';
import axios from 'axios';

import { v1port } from '../settings';

export default function Draft() {
  const [docx, setDocx] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [id, setId] = useState("")

  // TODO : redux on draft HTML and images, using `id`

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
      {/* TODO : requires authentication! */}
      {/*        if not, redirect to /admin */}
      {/*        how to check if user is logged in or not? */}
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
          : <br />
      }
    </div>
  )
}

import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactCrop from 'react-image-crop';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut, faUndo } from '@fortawesome/free-solid-svg-icons';

import { updateImage } from '../action/draft';
import PropTypes from 'prop-types';

import 'react-image-crop/dist/ReactCrop.css';

function ImageEditor(props) {
  const { filename, images, updateImage } = props;
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100 });
  const [origBase64, _] = useState(prefix(filename) + images[filename]);

  function onCropChange(crop, _percentCrop) {
    setCrop({ ...crop });
  }

  function onCropComplete(crop, _percentCrop) {
    setCrop({ ...crop });
  }

  function extToMIME(ext) {
    const prefix = 'image/';
    switch (ext) {
      case "png":
        return prefix + ext;
      case 'jpg':
      case 'jpeg':
        return prefix + 'jpeg';
      default:
        return ext;
    }
  }

  function getExt(filename) {
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex < 0) {
      return;
    } else {
      return filename.slice(dotIndex + 1);
    }
  }

  function prefix(filename) {
    const mime = extToMIME(getExt(filename));
    if (mime.includes('/')) {
      return "data:" + extToMIME(getExt(filename)) + ";base64,";
    } else {
      return mime;
    }
  }

  function getCroppedImg(crop) {
    const image = document.getElementById(filename);
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    // As Base64 string
    return canvas.toDataURL(extToMIME(getExt(filename)));
  }

  const encodedOrig = origBase64;
  const [encodedImage, setEncodedImage] = useState(
    prefix(filename) + images[filename],
  );

  function cutHandler() {
    const cropped = getCroppedImg(crop);
    updateImage(filename, cropped.slice(cropped.indexOf(',') + 1));
    // updateImage(filename, cropped);
    setEncodedImage(prefix(filename) + images[filename]);
  }

  function undoHandler() {
    updateImage(filename, origBase64.slice(origBase64.indexOf(',') + 1));
    setEncodedImage(origBase64);
  }
  return (
    <div>
      <br />
      <h3>자르기</h3>
      <ReactCrop
        src={encodedOrig}
        crop={crop}
        onChange={onCropChange}
        onComplete={onCropComplete}
      />
      <hr />
      <Container><Row>
        <Col><h3>미리보기</h3></Col>
        <Col xs="auto"><Button onClick={() => { cutHandler() }}>
          <FontAwesomeIcon icon={faCut} />
        </Button></Col>
        <Col xs="auto">
          <Button onClick={() => { undoHandler() }}>
            <FontAwesomeIcon icon={faUndo} />
          </Button>
        </Col>
      </Row></Container>
      {/* required hidden img for document.getElementById(filename) */}
      <img src={encodedOrig} alt={'original'} id={filename} style={{
        display: "none"
      }} />
      <img src={encodedImage} alt={filename} style={{ maxWidth: "100%" }} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  images: state.draft.images,
});

const mapDispatchToProps = (dispatch) => ({
  updateImage: (filename, encoded) => dispatch(updateImage(filename, encoded)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageEditor);

ImageEditor.propTypes = {
  images: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  invalidExt: PropTypes.func.isRequired,
};

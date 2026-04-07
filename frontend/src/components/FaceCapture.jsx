import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const FaceCapture = ({ onCapture, label = 'Capture Face Photo' }) => {
  const webcamRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | capturing | captured

  const capture = () => {
    setStatus('capturing');
    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setPreview(imageSrc);
        setStatus('captured');
        onCapture(imageSrc); // pass base64 dataURL to parent
      } else {
        setStatus('idle');
      }
    }, 200);
  };

  const retake = () => {
    setPreview(null);
    setStatus('idle');
    onCapture(null);
  };

  return (
    <div className="flex-col gap-12">
      <div className="webcam-wrap" style={{ maxWidth: 400, margin: '0 auto' }}>
        {!preview ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: 'user', width: 400, height: 300 }}
            style={{ width: '100%' }}
          />
        ) : (
          <img src={preview} alt="Captured face" style={{ width: '100%', borderRadius: 12 }} />
        )}
        {/* Scanning overlay */}
        {!preview && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 140, height: 140,
            border: '2px solid rgba(88,166,255,0.7)',
            borderRadius: 8,
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {!preview ? (
        <button id="btn-capture-face" className="btn btn-primary btn-full" onClick={capture} disabled={status === 'capturing'}>
          {status === 'capturing' ? '📸 Capturing...' : `📸 ${label}`}
        </button>
      ) : (
        <div className="flex gap-12">
          <button id="btn-retake-face" className="btn btn-ghost" style={{ flex: 1 }} onClick={retake}>
            🔄 Retake
          </button>
          <div className="alert alert-success" style={{ flex: 2, margin: 0 }}>
            ✅ Face captured successfully
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceCapture;

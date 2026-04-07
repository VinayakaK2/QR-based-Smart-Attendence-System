import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { markAttendance } from '../services/api';
import { getGeolocation } from '../utils/geolocation';

const REASONS = {
  face_mismatch: '❌ Face did not match your registered photo.',
  out_of_range: '📍 You are not within 50 metres of the classroom.',
  session_expired: '⏰ Session has expired. Ask your lecturer to restart.',
  duplicate: '⚠️ You have already marked attendance for this session.',
  invalid_qr: '❌ Invalid or tampered QR code.',
  session_not_found: '❌ Session not found.',
  face_processing_error: '🔧 Face processing failed. Try again in better lighting.',
};

const MarkAttendance = ({ token, sessionId, onDone, onBack }) => {
  const webcamRef = useRef(null);
  const [faceImage, setFaceImage] = useState(null);
  const [step, setStep] = useState('capture'); // 'capture' | 'confirm' | 'submitting' | 'done' | 'error'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [locStatus, setLocStatus] = useState('');

  const capturePhoto = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) { setFaceImage(img); setStep('confirm'); }
  };

  const submit = async () => {
    setStep('submitting');
    setError('');

    // Capture location
    setLocStatus('📍 Getting your location...');
    let lat, lng;
    try {
      const pos = await getGeolocation();
      lat = pos.latitude;
      lng = pos.longitude;
      setLocStatus(`✅ ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch (err) {
      setError(`Location required: ${err.message}`);
      setStep('capture');
      return;
    }

    try {
      const res = await markAttendance({
        session_id: sessionId,
        qr_token: token,
        face_image_base64: faceImage,
        lat,
        lng,
      });
      setResult(res.data);
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed. Try again.');
      setStep('confirm');
    }
  };

  return (
    <div className="flex-col gap-24 items-center fade-in-up" style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
      <div className="card w-full">
        <div className="flex items-center justify-between mb-24">
          <h2>📸 Mark Attendance</h2>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        </div>

        {/* Steps */}
        <div className="steps mb-24">
          <div className={`step ${step !== 'capture' ? 'done' : 'active'}`} />
          <div className={`step ${step === 'confirm' || step === 'submitting' ? 'active' : step === 'done' ? 'done' : ''}`} />
          <div className={`step ${step === 'done' ? 'done' : ''}`} />
        </div>

        {error && <div className="alert alert-error mb-16">{error}</div>}

        {/* STEP 1: Face Capture */}
        {(step === 'capture') && (
          <div className="flex-col gap-16">
            <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
              📸 Look directly at the camera for face verification
            </div>
            <div className="webcam-wrap">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user', width: 400, height: 300 }}
                style={{ width: '100%' }} />
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 140, height: 140,
                border: '2px solid rgba(88,166,255,0.7)', borderRadius: 8,
                pointerEvents: 'none',
              }} />
            </div>
            <button id="btn-capture-attendance" className="btn btn-primary btn-full btn-lg" onClick={capturePhoto}>
              📸 Capture & Continue
            </button>
          </div>
        )}

        {/* STEP 2: Confirm + Location */}
        {step === 'confirm' && (
          <div className="flex-col gap-16">
            <img src={faceImage} alt="Captured" style={{ borderRadius: 12, width: '100%' }} />
            {locStatus && <div className="alert alert-info" style={{ fontSize: '0.83rem' }}>{locStatus}</div>}
            <div className="alert alert-warning" style={{ fontSize: '0.82rem' }}>
              📍 Your location will be verified. You must be within <strong>50m</strong> of your lecturer.
            </div>
            <div className="flex gap-12">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep('capture')}>🔄 Retake</button>
              <button id="btn-submit-attendance" className="btn btn-success" style={{ flex: 2 }} onClick={submit}>
                ✓ Submit Attendance
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Submitting */}
        {step === 'submitting' && (
          <div className="flex-col gap-16 items-center" style={{ padding: '32px 0' }}>
            <div className="spinner" />
            <p>Verifying face and location...</p>
          </div>
        )}

        {/* DONE */}
        {step === 'done' && result && (
          <div className="flex-col gap-24 items-center text-center" style={{ padding: '16px 0' }}>
            {result.status === 'PRESENT' ? (
              <>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <div>
                  <h2 style={{ color: 'var(--accent-green)' }}>Attendance Marked!</h2>
                  <p style={{ marginTop: 8 }}>You have been marked <strong>PRESENT</strong> for this session.</p>
                </div>
                <div className="badge badge-present pulse-green" style={{ padding: '10px 20px', fontSize: '1rem' }}>
                  PRESENT
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '4rem' }}>❌</div>
                <div>
                  <h2 style={{ color: 'var(--accent-red)' }}>Attendance Rejected</h2>
                  <p style={{ marginTop: 8 }}>{REASONS[result.reason] || result.reason}</p>
                </div>
                <div className="badge badge-rejected" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                  {result.reason}
                </div>
              </>
            )}
            <button id="btn-done" className="btn btn-primary btn-full" onClick={onDone}>
              ← Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;

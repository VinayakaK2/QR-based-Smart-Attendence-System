import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().catch(() => {});
        },
        (err) => {
          // Ignore frequent scanning errors
        }
      )
      .catch((err) => {
        if (onError) onError(err);
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="flex-col gap-16 items-center">
      <div style={{
        background: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        border: '2px solid rgba(88,166,255,0.4)',
        width: '100%',
        maxWidth: 360,
      }}>
        <div id="qr-reader" style={{ width: '100%' }} />
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
        📷 Point camera at the QR code displayed by your Lecturer
      </p>
    </div>
  );
};

export default QRScanner;

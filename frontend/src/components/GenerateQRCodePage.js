import React, { useRef } from "react";
import "../styles/GenerateQRCode.css";

const GenerateQRCodePage = ({ hotelId = 123 }) => {
  // Fix: Use window.location.origin to generate correct QR code URL for your deployed frontend
  const menuUrl = `${window.location.origin}/menu`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(menuUrl)}&size=200x200`;
  const imgRef = useRef(null);

  const handleDownload = async () => {
    // Fetch the image as a blob and trigger download
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "menu-qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download QR code.");
    }
  };

  return (
    <div className="qrcode-section">
      <h3>Generate QR Code</h3>
      <p>
        <strong>QR Code for your menu:</strong>
      </p>
      <img ref={imgRef} src={qrUrl} alt="QR Code" id="qrimage" />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleDownload}>Download QR Code</button>
      </div>
      <p>
        <small>
          Customers can scan this QR code to view your menu and place orders.
        </small>
      </p>
    </div>
  );
};

export default GenerateQRCodePage;
import { useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(true);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/process_image/", {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        const data = await response.json();
        setResult(data);
        setShowUploadButton(false);
      } else {
        const errorData = await response.json();
        setResult({ error: errorData.error });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setShowUploadButton(true);
  };

  return (
    <div className="app-container">
      <div className="App">
        <h1 className="app-title">License Plate Detection</h1>
        {showUploadButton && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <button onClick={handleUpload} className="upload-button">
              Upload Image
            </button>
          </>
        )}
        {result && (
          <div className="result-container">
            {result.error ? (
              <p className="error-message">Error: {result.error}</p>
            ) : (
              <div className="result-section">
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Image"
                  />
                </div>

                <span className="arrow">➜</span>
                <div className="image-preview">
                  <img
                    src={result.cropped_im_url}
                    alt="Cropped License Plate"
                  />
                </div>
                <span className="arrow">➜</span>
                <div className="result-details">
                  <p className="success-message">{result.sucess}</p>
                  <p>License Plate Number: {result.license_plate_number}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {result && (
          <button onClick={handleReset} className="reset-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

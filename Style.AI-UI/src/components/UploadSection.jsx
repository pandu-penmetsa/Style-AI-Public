import React, { useRef } from "react";
import { Card, Button, Dropdown } from "react-bootstrap";


function UploadSection({ userImage, onImageSelected, apiMode,
    onApiModeChange, onStyleTypeChange, styleType }) {
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];

      onImageSelected({
        preview,
        base64,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="app-card mb-3">

      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
            <h3 className="fw-bold mb-1">Style.AI Studio</h3>
            {!userImage &&
            <p className="text-muted mb-0">
                Upload or capture your photo and try different styles using AI.
            </p>
            }
        </div>

    <Dropdown align="end">
        <Dropdown.Toggle    variant="light"   className="border-0 shadow-none p-2"  >
            <i className="bi bi-gear-fill me-1"></i>{styleType === "hair" ? "Hair Style" : "Dress Try-on"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Header><b>Style</b>
            </Dropdown.Header>
            <Dropdown.Item active={styleType === "hair"} onClick={() => onStyleTypeChange("hair")} >
                {styleType === "hair" && <i className="bi bi-check-lg me-1"></i>}Hair Style
            </Dropdown.Item>
            <Dropdown.Item active={styleType === "dress"}  onClick={() => onStyleTypeChange("dress")} >
                {styleType === "dress" && <i className="bi bi-check-lg me-1"></i>}Dress Try-on
            </Dropdown.Item>

            {styleType === "hair" &&
              <>
              <hr></hr>
              <Dropdown.Header> <b>Backend</b> </Dropdown.Header>
                  <Dropdown.Item active={apiMode === "mock"} onClick={() => onApiModeChange("mock")} >
                      {apiMode === "mock" && <i className="bi bi-check-lg me-1"></i>}Mock
                  </Dropdown.Item>
                  <Dropdown.Item active={apiMode === "bfl"}  onClick={() => onApiModeChange("bfl")} >
                      {apiMode === "bfl" && <i className="bi bi-check-lg me-1"></i>}BFL
                </Dropdown.Item>   
              </>
            }
        </Dropdown.Menu> 
        
    </Dropdown>
</div>

        {!userImage ? (
          <>
            <div className="text-center"> 
              <div
                className="upload-box"
                onClick={openFilePicker}
              >
                <div>

                  <div className="upload-icon">
                    <i className="bi bi-camera"></i>
                  </div>

                  <h5 className="mt-3">
                    Upload Photo
                  </h5>

                  <p className="text-muted small mb-0">
                    Tap to open Camera or Gallery
                  </p>

                </div>

              </div>

              <Button
                variant="primary"
                className="w-100 rounded-pill mt-3"
                onClick={openFilePicker}
              >
                Upload Photo
              </Button>

            </div>
          </>
        ) : (
          <>         
            <div className="d-flex align-items-center">
              <img
                src={userImage}
                alt="Uploaded"
                className="uploaded-thumb"
              />

              <div className="ms-3 flex-grow-1">

                <div className="fw-semibold mb-1">
                  Your Photo
                </div>

                <div className="text-muted small mb-3">
                  Ready to generate styles
                </div>

                <Button
                  variant="outline-primary"
                  className="w-100 rounded-pill"
                  onClick={openFilePicker}
                >
                  <i className="bi bi-camera me-1"></i>Change Photo
                </Button>

              </div>

            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />

      </Card.Body>

    </Card>
  );
}

export default UploadSection;

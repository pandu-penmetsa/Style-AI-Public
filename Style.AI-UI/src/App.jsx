import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import styleCatalog from "./data/styleCatalog.json";
import dressImages from "./data/dressTryOn.json";


import UploadSection from "./components/UploadSection";
import StylePopup from "./components/StylePopup";
import ResultCard from "./components/ResultCard";
import ResultCard2 from "./components/ResultCard2";


import { changeStyle } from "./services/styleApi";
import { base64ToImageSrc } from "./utils/imageUtils";

function App() {
  const [userImage, setUserImage] = useState(null);
  const [userImageBase64, setUserImageBase64] = useState("");
  const [apiMode, setApiMode] = useState("mock");  //mock, bfl
  const [styleType, setStyleType] = useState("hair");  //hair, dress  
  const [showStylePopup, setShowStylePopup] = useState(false);

  // Master data only
  const [styles, setStyles] = useState([]);

  // Runtime data
  const [results, setResults] = useState([]);

  useEffect(() => {
    const _styles = styleType !== "dress" ? styleCatalog.styles : dressImages.styles;
    const styleList = Object.entries(_styles).map(([key, url]) => ({
      id: key,
      name: key.replace(/style/i, "Style "),
      image: url
    }));

    setStyles(styleList);
  }, [styleType]);

  const onStyleTypeChange = (type) =>{
    setApiMode(type === "hair" ? "mock" : "bfl")
    setStyleType(type)
    resetStyles(type)
  }

  const resetStyles = (_styleType) =>{
     const _styles = _styleType !== "dress" ? styleCatalog.styles : dressImages.styles
     const styleList = Object.entries(_styles).map(([key, url]) => ({
      id: key,
      name: key.replace(/style/i, "Style "),
      image: url,
      isSelected: false
    }));
    setStyles(styleList);
    setUserImage(null);
    setResults([]);
  }

  /**
   * User uploaded image
   */
  const handleImageSelected = ({ preview, base64 }) => {
    setUserImage(preview);
    setUserImageBase64(base64);

    // New image = clear previous results
    setResults([]);

    // Automatically open popup
    setShowStylePopup(true);
  };

  /**
   * Generate style
   */
  const generateStyle = async (resultId, style) => {
    const endpoint = apiMode === "mock" ? "/change-hairstyle-mock" : "/change-style-bfl";
    try {
      const response = await changeStyle(
        userImageBase64,
        style.image,
        endpoint,
        styleType
      );

      setResults((prev) =>
        prev.map((item) =>
          item.id === resultId
            ? {
                ...item,
                status: "completed",
                generatedImage: base64ToImageSrc(
                  response.result_image_base64
                ),
                processingTime: response.processing_time,
                matchScore: response.match_score,
                restorationApplied:
                  response.face_restoration_applied,
              }
            : item
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((item) =>
          item.id === resultId
            ? {
                ...item,
                status: "failed",
                error: error.message,
              }
            : item
        )
      );
    }
  };

  /**
   * Style selected
   */
  const handleStyleSelected = (style) => {
    setShowStylePopup(false);

    const result = {
      id: Date.now(),

      styleId: style.id,

      styleName: style.name,

      referenceImage: style.image,

      generatedImage: null,

      status: "generating",

      currentStep: 0,

      processingTime: null,

      matchScore: null,

      restorationApplied: false,

      error: null
    };

    setResults((prev) => [result, ...prev]); 

    setStyles((prev) =>
      prev.map((item) =>
        item.id === style.id
          ? {
              ...item,
              status: "generating",
            }
          : item
      )
    );
    

    generateStyle(result.id, style);
  };

  return (
    <div className="app-container">
      <div className="mobile-container">

        <UploadSection
          userImage={userImage}
          onImageSelected={handleImageSelected}
          apiMode={apiMode}
          onApiModeChange={setApiMode}
          onStyleTypeChange= {onStyleTypeChange}
          styleType = {styleType}
        />

        {styleType === "hair" ?
          results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
          />
        ))
        :
        results.length > 0 && 
         <ResultCard2 
            results={results}
          />
        }
        
         
        {userImage && (
          <button
            className="btn btn-primary floating-button rounded-pill"
            onClick={() => setShowStylePopup(true)}
          >
            Try Another Style
          </button>
        )}

      </div>

      <StylePopup
        show={showStylePopup}
        styles={styles}
        onClose={() => setShowStylePopup(false)}
        onSelect={handleStyleSelected}
      />
    </div>
  );
}

export default App;

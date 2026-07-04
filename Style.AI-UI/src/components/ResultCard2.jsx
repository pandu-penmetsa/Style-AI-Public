import React, { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import ProgressSteps from "./ProgressSteps";
import "./ResultCard2.css";

function ResultCard2({ results }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (results && results.length > 0) {
      setCurrentIndex(0);
    }
  }, [results]);

  if (!results || results.length === 0) {
    return null;
  }

  const current = results[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < results.length - 1;

  return (
    <Card className="result-card border-0 shadow-sm">
      <div className="position-relative">
        <div className="result-counter">
          {currentIndex + 1} / {results.length}
        </div>

        {hasPrevious && (
          <button
            className="nav-arrow left-arrow"
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            &#8249;
          </button>
        )}

        {hasNext && (
          <button
            className="nav-arrow right-arrow"
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            &#8250;
          </button>
        )}

        {current.status === "completed" && (
          <img src={current.generatedImage} alt="" className="generated-image" />
        )}

        {current.status === "generating" && (
          <div className="result-placeholder">
            <Spinner animation="border" variant="primary" className="mb-4" />
            <ProgressSteps />
          </div>
        )}

        {current.status === "failed" && (
          <div className="result-placeholder">
            <div className="text-center px-4">
              <i className="bi bi-exclamation-triangle text-warning display-3"></i>
              <h5 className="fw-bold mt-3">Generation Failed</h5>
              <p className="text-muted mb-0">
                {current.error || "Something went wrong while generating the image."}
              </p>
            </div>
          </div>
        )}

        <div className="reference-wrapper">
          <img
            src={current.referenceImage}
            alt="Reference"
            className="reference-image2"
          />
          <div className="reference-label">
            {current.feature === "dress" ? "Dress" : "Style"}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ResultCard2;

import React from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import ProgressSteps from "./ProgressSteps";

function ResultCard({ result }) {
  const {
    styleName,
    generatedImage,
    referenceImage,
    status
  } = result;

  const getStatusBadge = () => {
    switch (status) {
      case "generating":
        return (
          <Badge bg="warning" text="dark">
            Generating
          </Badge>
        );

      case "completed":
        return (
          <Badge bg="success">
            Completed
          </Badge>
        );

      case "failed":
        return (
          <Badge bg="danger">
            Failed
          </Badge>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="app-card mb-3">

      <Card.Body>

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>

            <h6 className="fw-bold mb-1">
              {styleName}
            </h6>

            {getStatusBadge()}

          </div>

        </div>

        {/* Image */}

        <div className="position-relative">

          {
            status === "generating" ? (

              <div
                className="d-flex flex-column justify-content-center align-items-center rounded-4"
                style={{
                  height: 320,
                  background: "#F5F5F5"
                }}
              >

                <Spinner
                  animation="border"
                  className="mb-3"
                />

                <ProgressSteps />

              </div>

            ) : (

              <img
                src={generatedImage}
                alt={styleName}
                className="img-preview"
              />

            )
          }

          {/* Reference Image */}

          <img
            src={referenceImage}
            alt="Reference"
            className="reference-image position-absolute"
            style={{
              right: 15,
              bottom: 15
            }}
          />

        </div>

      </Card.Body>

    </Card>
  );
}

export default ResultCard;

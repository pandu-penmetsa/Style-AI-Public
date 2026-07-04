import React from "react";
import { ListGroup } from "react-bootstrap";

const steps = [
  "Detecting Face",
  "Aligning Face",
  "Applying Style",
  "Enhancing Image",
];

function ProgressSteps({ currentStep = 2 }) {
  return (
    <div className="mt-3 w-100">
      <ListGroup variant="flush">
        {steps.map((step, index) => {
          let icon = "bi-circle";
          let color = "text-muted";

          if (index < currentStep) {
            icon = "bi-check-circle-fill";
            color = "text-success";
          } else if (index === currentStep) {
            icon = "bi-hourglass-split";
            color = "text-warning";
          }

          return (
            <ListGroup.Item
              key={step}
              className="border-0 px-0 py-2 bg-transparent"
            >
              <i className={`bi ${icon} ${color} me-2`}></i>
              <span className={color}>{step}</span>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}

export default ProgressSteps;

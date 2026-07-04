import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Row, Col, Card, Badge } from "react-bootstrap";

function StylePopup({
  show,
  styles,
  onClose,
  onSelect
}) {

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (show) {
      setSearch("");
    }
  }, [show]);

  const filteredStyles = useMemo(() => {

    if (!search.trim()) return styles;

    return styles.filter((style) =>
      style.name.toLowerCase().includes(search.toLowerCase())
    );

  }, [search, styles]);

  const getBadge = (status) => {

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
            Generated
          </Badge>
        );

      default:
        return null;

    }

  };

  return (

    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
    >

      <Modal.Header closeButton>

        <Modal.Title>
          Choose Style
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <Form.Control
          placeholder="Search style..."
          className="mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Row xs={2} className="g-3">

          {
            filteredStyles.map((style) => {

              const disabled =
                style.status === "generating" ||
                style.status === "completed";

              return (

                <Col key={style.id}>

                  <Card
                    className={`h-100 shadow-sm ${disabled ? "opacity-50" : ""
                      }`}
                    style={{
                      cursor: disabled ? "not-allowed" : "pointer",
                      borderRadius: "18px"
                    }}
                    onClick={() => {

                      if (disabled) return;

                      onSelect(style);

                    }}
                  >

                    <Card.Img
                      variant="top"
                      src={style.image}
                      style={{
                        height: 150,
                        objectFit: "cover"
                      }}
                    />

                    <Card.Body
                      className="text-center p-2"
                    >

                      <div
                        className="fw-semibold small"
                      >
                        {style.name}
                      </div>

                      <div className="mt-2">

                        {getBadge(style.status)}

                      </div>

                    </Card.Body>

                  </Card>

                </Col>

              );

            })
          }

        </Row>

      </Modal.Body>

    </Modal>

  );

}

export default StylePopup;

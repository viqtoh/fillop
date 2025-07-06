// WelcomeMessage.js
import React from "react";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";

const WelcomeMessage = ({ studentName, totalCourses, completedCourses, image }) => {
  const completionRate = totalCourses ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row>
          <Col md={8}>
            <h4>
              Welcome back, <span className="text-primary">{studentName}</span>!
            </h4>
            <p className="mb-1">
              You have enrolled in <strong>{totalCourses}</strong> course{totalCourses !== 1 && "s"}
              .
            </p>
            <p className="mb-2">
              You've completed <strong>{completedCourses}</strong> so far.
            </p>
            <ProgressBar now={completionRate} label={`${completionRate}%`} />
          </Col>
          <Col md={4} id="welcomeImage" className="d-flex align-items-center justify-content-end">
            <img
              src={image}
              alt="Student Avatar"
              className="img-fluid rounded-circle"
              style={{ width: "80px", height: "80px" }}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WelcomeMessage;

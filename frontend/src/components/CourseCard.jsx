import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import { faBookOpen, faLineChart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ progress = 0, id, title, date, type, image, due = false }) => {
  const navigate = useNavigate();
  const navigator = () => {
    if (type == "Course") {
      navigate("/content-library/course/" + id);
    } else {
      navigate("/content-library/path/" + id);
    }
  };
  return (
    <div
      className="card shadow-sm courseCard"
      style={{ borderRadius: "12px" }}
      onClick={() => navigator()}
    >
      {/* Image Section */}
      <div
        className=" text-center CcardImage"
        style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
      >
        {image ? (
          <img src={image} alt={title} className="img-fluid" />
        ) : (
          <img
            src="/images/course_default.png"
            alt="{title}"
            className="img-fluid"
            style={{ objectFit: "contain" }}
          />
        )}
      </div>
      <ProgressBar now={progress} style={{ borderRadius: "0px", height: "5px" }} />
      {/* Content Section */}
      <div className="cardBody">
        <div className="cardBodyTitle">
          <h5 className="card-title text-dark">{title}</h5>
        </div>
        <div className="d-flex justify-content-between text-muted small">
          <span>
            {type === "Learning Path" ? (
              <FontAwesomeIcon icon={faLineChart} className="cardSvg" />
            ) : (
              <FontAwesomeIcon icon={faBookOpen} className="cardSvg" />
            )}
            {type}
          </span>
          {progress > 0 ? <span>{progress}%</span> : null}
        </div>
      </div>
      {due ? (
        <div className="cardFooter2">
          <p>Finished - {date}</p>
        </div>
      ) : (
        <div className="cardFooter">
          <p>Started - {date}</p>
        </div>
      )}
    </div>
  );
};

export default CourseCard;

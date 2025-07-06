import { useState } from "react";
import {
  faAngleDoubleUp,
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faCheckCircle,
  faCirclePlay,
  faEye,
  faLock,
  faPen,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

export const ModuleCollapsible = ({
  title,
  description = "",
  id,
  courseId,
  is_published,
  content_type = "",
  onMoveUp,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="collapsible">
      <div className="collapsible-header">
        <button onClick={() => setIsOpen(!isOpen)} className="colbtn">
          <div>
            <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} />
          </div>
          <span className="sectionTitle">{title}</span>
        </button>

        <div className="d-flex gap-2 align-items-center">
          {content_type === "assessment" && (
            <button
              className="bg-danger text-white py-1 px-3 rounded"
              onClick={() => {
                window.location.href = `/admin/content-management/course/module/${id}/assessment`;
              }}
            >
              Set Assessment
            </button>
          )}
          <button
            className="btn btn-danger sm-btn"
            onClick={() => {
              onDelete(id);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button
            className="btn btn-primary sm-btn"
            onClick={() => {
              window.location.href = `/admin/content-management/course/${courseId}/module/edit/${id}`;
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>

          <button
            className="btn btn-primary sm-btn"
            onClick={() => {
              onMoveUp(id);
            }}
          >
            <FontAwesomeIcon icon={faAngleDoubleUp} />
          </button>
        </div>
      </div>

      <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
        <div className="w-100">
          <div className="collapseIcon">
            <FontAwesomeIcon icon={faCirclePlay} size="lg" />
          </div>
          <div className="collapseText flex flex-row justify-content-between w-100">
            <div className="collapseTextL">
              <p>{description}</p>
            </div>
            <div className={`collapseTextR ${is_published ? "text-success" : "text-danger"}`}>
              {is_published ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <FontAwesomeIcon icon={faTimesCircle} />
              )}
              <span className={`${is_published ? "text-success" : "text-danger"}`}>Published </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseCollapsible = ({
  title,
  description = "",
  id,
  is_published,
  learnPathId,
  onMoveUp
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="collapsible">
      <div className="collapsible-header">
        <button onClick={() => setIsOpen(!isOpen)} className="colbtn">
          <div>
            <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} />
          </div>
          <span className="sectionTitle">{title}</span>
        </button>

        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-primary sm-btn"
            onClick={() => {
              if (learnPathId) {
                window.location.href = `/admin/content-management/path/${learnPathId}/course/${id}`;
              } else {
                window.location.href = `/admin/content-management/course/${id}`;
              }
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button
            className="btn btn-primary sm-btn"
            onClick={() => {
              onMoveUp(id);
            }}
          >
            <FontAwesomeIcon icon={faAngleDoubleUp} />
          </button>
        </div>
      </div>

      <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
        <div className="w-100">
          <div className="collapseIcon">
            <FontAwesomeIcon icon={faCirclePlay} size="lg" />
          </div>
          <div className="collapseText flex flex-row justify-content-between w-100">
            <div className="collapseTextL">
              <p>{description}</p>
            </div>

            <div className={`collapseTextR ${is_published ? "text-success" : "text-danger"}`}>
              {is_published ? (
                <FontAwesomeIcon icon={faCheckCircle} />
              ) : (
                <FontAwesomeIcon icon={faTimesCircle} />
              )}
              <span className={`${is_published ? "text-success" : "text-danger"}`}>Published </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

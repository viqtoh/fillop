import { useState } from "react";
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faCheckCircle,
  faCirclePlay,
  faLock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

export const CourseCollapsible = ({
  title,
  percentage = 0,
  description = "",
  score = 0,
  isLocked = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible">
      <div className="collapsible-header">
        {!isLocked ? (
          <button onClick={() => setIsOpen(!isOpen)} className="colbtn">
            <div>
              <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} />
            </div>
            <span className="sectionTitle">{title}</span>
          </button>
        ) : (
          <button className="colbtn">
            <div>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <span className="sectionTitle">{title}</span>
          </button>
        )}

        <div className="circular-progress"></div>
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            strokeWidth="2"
          />
          {percentage > 0 && (
            <path
              className="circle"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4caf50"
              strokeWidth="2"
              strokeDasharray={`${percentage}, 100`}
            />
          )}

          <text x="17" y="20" textAnchor="middle" fontSize="8" fill="#000">
            {percentage}%
          </text>
        </svg>
      </div>

      <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
        <div>
          <div className="collapseIcon">
            {percentage === 100 ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" size="lg" />
            ) : (
              <FontAwesomeIcon icon={faCirclePlay} size="lg" />
            )}
          </div>
          <div className="collapseText">
            <p>{description}</p>
            <span>{score}% My Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ModuleCollapsible = ({
  title,
  percentage = 0,
  description = "",
  score = 0,
  isLocked = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapsible">
      <div className="collapsible-header">
        {!isLocked ? (
          <button onClick={() => setIsOpen(!isOpen)} className="colbtn">
            <div>
              <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} />
            </div>
            <span className="sectionTitle">{title}</span>
          </button>
        ) : (
          <button className="colbtn">
            <div>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <span className="sectionTitle">{title}</span>
          </button>
        )}
      </div>

      <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
        <div>
          <div className="collapseIcon">
            {percentage === 100 ? (
              <FontAwesomeIcon icon={faCheckCircle} color="green" size="lg" />
            ) : (
              <FontAwesomeIcon icon={faCirclePlay} size="lg" />
            )}
          </div>
          <div className="collapseText">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

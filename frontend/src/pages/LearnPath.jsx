import React from "react";
import NavBar from "../components/UserNavBar";
import "../styles/home.css";
import {useState, useEffect} from "react";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate, useParams} from "react-router-dom";
import {CourseCollapsible} from "../components/Collapsible";
import SmallCircleProgress from "../components/SmallCircleProgress";
import CircleProgress from "../components/CircleProgress";

const LearnPath = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [learningPath, setLearningPath] = useState(null);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);

    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const navigate = useNavigate();

  const {id} = useParams();
  useEffect(() => {
    const fetchLearningPath = async () => {
      try {
        const response = await fetch(`${API_URL}/api/learning-path-full/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch learning path");
        }
        const data = await response.json();
        setLearningPath(data);
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [id, token]); // Refetch when id or token changes

  return (
    <div>
      <div className="navHeader">
        <NavBar title="Content Library" subTitle="Learning Path" />
      </div>
      <div className="main-body main-body5 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : learningPath !== null ? (
          <div className="sub-body">
            <div className="courseHeader">
              <div className="headerContent">
                <div className="headerImageCon">
                  <img
                    src={
                      learningPath.image != null
                        ? `${IMAGE_HOST}${learningPath.image}`
                        : "/images/sample_image.png"
                    }
                    alt="course-image"
                    className="headerImage"
                  />
                </div>

                <div className="headerContent">
                  <div className="headerTitle">
                    <div>
                      <span>{learningPath.title}</span>
                    </div>

                    <div className="headerDesc">
                      <span>{learningPath.description}</span>
                    </div>
                    <button
                      className="btn continueBtn"
                      onClick={() => {
                        navigate(`/content-library/path/${learningPath.id}/read`);
                      }}
                    >
                      <span>
                        {learningPath.progress === 100
                          ? "Restart this learning path"
                          : learningPath.progress === 0
                          ? "Start this learning path"
                          : "Continue this learning path"}
                      </span>
                    </button>
                  </div>

                  <div className="circleProgress">
                    <CircleProgress progress={learningPath.progress} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mobileCourseHeader">
              <div className="mheaderContent">
                <div className="mheaderImageCon">
                  <img
                    src={
                      learningPath.image != null
                        ? `${IMAGE_HOST}${learningPath.image}`
                        : "/images/sample_image.png"
                    }
                    alt="course-image"
                    className="mheaderImage"
                  />
                </div>

                <div className="mheaderContent">
                  <div className="mheaderTitle">
                    <div>
                      <span>{learningPath.title}</span>
                    </div>

                    <div className="headerDesc">
                      <span>{learningPath.description}</span>
                    </div>
                    <button
                      className="btn continueBtn"
                      onClick={() => {
                        navigate(`/content-library/path/${learningPath.id}/read`);
                      }}
                    >
                      <span>
                        {learningPath.progress === 100
                          ? "Restart this learning path"
                          : learningPath.progress === 0
                          ? "Start this learning path"
                          : "Continue this learning path"}
                      </span>
                    </button>
                  </div>

                  <div className="mcircleProgress">
                    <SmallCircleProgress progress={learningPath.progress} />
                  </div>
                </div>
              </div>
            </div>

            <div className="courseBody">
              {!learningPath ? (
                <div className="noObjects noObjects100 mt-4">Learning path not found</div>
              ) : learningPath.courses.length === 0 ? (
                <div className="noObjects noObjects100 mt-4">No Courses here</div>
              ) : (
                learningPath.courses.map((section, index) => (
                  <CourseCollapsible key={index} {...section} />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="noObjects">Learning Path not Found!</div>
        )}
      </div>
    </div>
  );
};

export default LearnPath;

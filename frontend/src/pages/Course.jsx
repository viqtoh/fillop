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
import {ModuleCollapsible} from "../components/Collapsible";
import CircleProgress from "../components/CircleProgress";
import SmallCircleProgress from "../components/SmallCircleProgress";

const Course = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);

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
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/api/course-full/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const data = await response.json();
        setCourse(data);
        setModules(data.modules);
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]); // Refetch when id or token changes

  return (
    <div>
      <div className="navHeader">
        <NavBar title="Content Library" subTitle="Course" />
      </div>
      <div className="main-body main-body5 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : course !== null ? (
          <div className="sub-body">
            <div className="courseHeader">
              <div className="headerContent">
                <div className="headerImageCon">
                  <img
                    src={
                      course.image != null
                        ? `${IMAGE_HOST}${course.image}`
                        : "/images/sample_image.png"
                    }
                    alt="course-image"
                    className="headerImage"
                  />
                </div>

                <div className="headerContent">
                  <div className="headerTitle">
                    <div>
                      <span>{course.title}</span>
                    </div>

                    <div className="headerDesc">
                      <span>{course.description}</span>
                    </div>
                    <button
                      className="btn continueBtn"
                      onClick={() => {
                        navigate(`/content-library/course/${course.id}/read`);
                      }}
                    >
                      <span>
                        {course.progress === 100
                          ? "Restart this course"
                          : course.progress === 0
                          ? "Start this course"
                          : "Continue this course"}
                      </span>
                    </button>
                  </div>
                  <div className="circleProgress">
                    <CircleProgress progress={course.progress} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mobileCourseHeader">
              <div className="mheaderContent">
                <div className="mheaderImageCon">
                  <img
                    src={
                      course.image != null
                        ? `${IMAGE_HOST}${course.image}`
                        : "/images/sample_image.png"
                    }
                    alt="course-image"
                    className="mheaderImage"
                  />
                </div>

                <div className="mheaderContent">
                  <div className="mheaderTitle">
                    <div>
                      <span>{course.title}</span>
                    </div>

                    <div className="headerDesc">
                      <span>{course.description}</span>
                    </div>
                    <button
                      className="btn continueBtn"
                      onClick={() => {
                        navigate(`/content-library/course/${course.id}/read`);
                      }}
                    >
                      <span>
                        {course.progress === 100
                          ? "Restart this course"
                          : course.progress === 0
                          ? "Start this course"
                          : "Continue this course"}
                      </span>
                    </button>
                  </div>

                  <div className="mcircleProgress">
                    <SmallCircleProgress progress={course.progress} />
                  </div>
                </div>
              </div>
            </div>

            <div className="courseBody">
              {!course ? (
                <div className="noObjects noObjects100 mt-4">Course not found</div>
              ) : (
                modules.map((module) => <ModuleCollapsible key={module.id} {...module} />)
              )}
              {course && modules.length === 0 && (
                <div className="noObjects noObjects100 mt-4">
                  There are no Modules in this Course yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="noObjects">Course not Found!</div>
        )}
      </div>
    </div>
  );
};

export default Course;

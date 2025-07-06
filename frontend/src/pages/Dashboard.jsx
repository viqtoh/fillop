import React, {useState, useEffect} from "react";
import NavBar from "../components/UserNavBar";
import "../styles/home.css";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {faSearch, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import CourseCard from "../components/CourseCard";
import WelcomeMessage from "../components/WelcomeMessage";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [student, setStudent] = useState(null);
  const [incompleteCourses, setIncompleteCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setIncompleteCourses(data.inCompletedCourses);
        setCompletedCourses(data.completedCourses);
        setStudent(data.user);
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="navHeader">
        <NavBar />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div
            className="sub-body"
            onScroll={(e) => {
              const button = document.querySelector(".returnUp");
              if (e.target.scrollTop > 500) {
                button.style.opacity = "1";
                button.style.visibility = "visible";
              } else {
                button.style.opacity = "0";
                button.style.visibility = "hidden";
              }
            }}
          >
            <button
              className="btn returnUp"
              onClick={() => {
                const subBody = document.querySelector(".sub-body");
                if (subBody) {
                  subBody.scrollTo({top: 0, behavior: "smooth"});
                }
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </button>
            <div className="searchContainer">
              <div className="searchBarContainer">
                <FontAwesomeIcon icon={faSearch} />
                <input
                  type="text"
                  className="searchBar2"
                  placeholder="Search content by title or description"
                  onChange={(e) => {}}
                />
              </div>
            </div>

            {student && (
              <WelcomeMessage
                studentName={student.first_name}
                image={
                  student.image ? `${IMAGE_HOST}${student.image}` : "/images/default_profile.png"
                }
                totalCourses={completedCourses.length + incompleteCourses.length}
                completedCourses={completedCourses.length}
              />
            )}

            <div className="dashboardContainer row">
              <div className="dConDiv  nobar">
                <div className="dCon">
                  <div className="learnProgressCon">
                    <div className="dashTitle">
                      <svg width="20" height="20" viewBox="0 0 36 36" className="circular-chart">
                        <path
                          className="circle-bg"
                          d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0057d222"
                          strokeWidth="4"
                        />
                        <path
                          className="circle"
                          d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#0057d2"
                          strokeWidth="4"
                          strokeDasharray={`${35}, ${100 - 35}`} // Replace 35 with a dynamic progress value
                        />
                      </svg>
                      <span>
                        In Progress ({incompleteCourses ? incompleteCourses.length : "0"})
                      </span>
                    </div>
                    <div className="dashBody mt-2">
                      {incompleteCourses.length !== 0 &&
                        incompleteCourses.map((course, index) => (
                          <CourseCard
                            key={`incCard${course.id}-${index}`}
                            id={course.id}
                            image={course.image ? `${IMAGE_HOST}${course.image}` : null}
                            title={course.title}
                            date={course.started}
                            type={course.type}
                            progress={course.progress}
                          />
                        ))}
                      {incompleteCourses.length === 0 && (
                        <div
                          className="noCourses d-flex align-items-center justify-content-center"
                          style={{height: "232px", width: "100%"}}
                        >
                          <span style={{height: 20}}>No Incomplete courses to show</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dCon">
                  <div className="notStartedCon">
                    <div className="dashTitle">
                      <svg
                        fill="#0057ff"
                        width="20px"
                        height="20px"
                        viewBox="0 0 512.00 512.00"
                        id="icons"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#0057ff"
                        transform="rotate(90)"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="#CCCCCC"
                          strokeWidth="1.024"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M208,512,155.62,372.38,16,320l139.62-52.38L208,128l52.38,139.62L400,320,260.38,372.38Z"></path>
                          <path
                            d="M88,176,64.43,111.57,0,88,64.43,64.43,88,0l23.57,64.43L176,88l-64.43,23.57Z"
                            fill="#0057ff77"
                          ></path>
                          <path
                            d="M400,256l-31.11-80.89L288,144l80.89-31.11L400,32l31.11,80.89L512,144l-80.89,31.11Z"
                            fill="#0057ff77"
                          ></path>
                        </g>
                      </svg>
                      <span>Completed ({completedCourses.length})</span>
                    </div>
                    <div className="dashBody mt-2">
                      {completedCourses.length !== 0 &&
                        completedCourses.map((course) => (
                          <CourseCard
                            key={`comCard${course.id}`}
                            id={course.id}
                            image={course.image ? `${IMAGE_HOST}${course.image}` : null}
                            title={course.title}
                            date={course.started}
                            type={course.type}
                            progress={course.progress}
                            due={true}
                          />
                        ))}
                      {completedCourses.length === 0 && (
                        <div
                          className="noCourses d-flex align-items-center justify-content-center"
                          style={{height: "232px", width: "100%"}}
                        >
                          <span style={{height: 20}}>No completed courses yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import { API_URL, IMAGE_HOST } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import { faSearch, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import {
  FaUsers,
  FaBook,
  FaUserGraduate,
  FaUserFriends,
  FaChartLine,
  FaCheckCircle,
  FaBookOpen,
  FaUser
} from "react-icons/fa";
import CourseCard from "../components/CourseCard";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [stats, setStats] = React.useState([]);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);
  const extendDescriptions = (courses) => {
    return courses.map((course) => ({
      ...course,
      description: `${course.description} This course provides in-depth knowledge and practical examples to help you master the subject effectively.`
    }));
  };

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setData(data);
        setStats([
          {
            title: "Total Users",
            value: data.totalUsers,
            icon: <FaUsers className="text-primary fs-3" />,
            bg: "bg-light"
          },
          {
            title: "Total Courses",
            value: data.totalCourses,
            icon: <FaBook className="text-success fs-3" />,
            bg: "bg-light"
          },
          {
            title: "Enrolled Students",
            value: data.totalStudents,
            icon: <FaUserGraduate className="text-info fs-3" />,
            bg: "bg-light"
          },
          {
            title: "Total Staffs",
            value: data.totalStaffs,
            icon: <FaUserFriends className="text-warning fs-3" />,
            bg: "bg-light"
          }
        ]);
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
        <AdminNavBar />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <button
              className="btn returnUp"
              onClick={() => {
                const subBody = document.querySelector(".sub-body");
                if (subBody) {
                  subBody.scrollTo({ top: 0, behavior: "smooth" });
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

            <div className="row g-4">
              {stats.map((stat, index) => (
                <div className="col-md-6 col-xl-3" key={index}>
                  <div className={`card shadow-sm ${stat.bg}`}>
                    <div className="card-body d-flex align-items-center">
                      <div className="me-3">{stat.icon}</div>
                      <div>
                        <h6 className="mb-0">{stat.title}</h6>
                        <h4 className="fw-bold">{stat.value}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4 mt-4">
              {/* Logins Overview */}
              <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <FaChartLine className="me-2 text-primary" /> User Logins
                    </h6>
                    <p className="text-muted small">Last 7 days</p>

                    {data.loginActivity && (
                      <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Today</span>
                          <span>{data.loginActivity.today}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Yesterday</span>
                          <span>{data.loginActivity.yesterday}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <span>This Week</span>
                          <span>{data.loginActivity.thisWeek}</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {/* Course Completion Rate */}
              <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <FaCheckCircle className="me-2 text-success" /> Course Completion Rate
                    </h6>
                    <p className="text-muted small">Across all active courses</p>

                    <div className="mb-2">
                      <span className="d-block">Overall Completion</span>
                      {data.totalProgresses && data.totalProgresses !== 0 ? (
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            style={{
                              width: `${((data.completedProgresses / data.totalProgresses) * 100).toFixed(2)}%`
                            }}
                          >
                            {((data.completedProgresses / data.totalProgresses) * 100).toFixed(2)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">No data to show</span>
                      )}
                    </div>

                    <div>
                      <span className="d-block">Active Students Completing Courses</span>
                      {data.totalStudents && data.totalStudents !== 0 ? (
                        <div className="progress">
                          <div
                            className="progress-bar bg-info"
                            style={{
                              width: `${((data.completedUsers / data.totalStudents) * 100).toFixed(2)}%`
                            }}
                          >
                            {((data.completedUsers / data.totalStudents) * 100).toFixed(2)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">No data to show</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Most Active Courses */}
              <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <FaBookOpen className="me-2 text-info" /> Most Active Courses
                    </h6>
                    <ul className="list-group list-group-flush mt-2">
                      {data.topCompletedCourses && data.topCompletedCourses.length !== 0 ? (
                        data.topCompletedCourses.map((course) => (
                          <li
                            key={`topCourse-${course.id}`}
                            className="list-group-item d-flex justify-content-between"
                          >
                            <span>{course.title}</span>
                            <span>📘 {course.completions} views</span>
                          </li>
                        ))
                      ) : (
                        <span className="text-muted small">No data to show</span>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              {/* Most Active Students */}
              <div className="col-md-12 col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="card-title">
                      <FaUser className="me-2 text-warning" /> Most Active Students
                    </h6>
                    {data.activeUsers && (
                      <ul className="list-group list-group-flush mt-2">
                        {data.activeUsers.map((user) => (
                          <li
                            key={`activeUser-${user.name}`}
                            className="list-group-item d-flex justify-content-between"
                          >
                            <span>{user.name}</span>
                            <span>
                              🔥 {user.logins} {user.logins == 1 ? "login" : "logins"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
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

export default AdminDashboard;

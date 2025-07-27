import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/navbar.css";
import {API_URL, IMAGE_HOST} from "../constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBuilding,
  faFolderClosed,
  faFolderOpen,
  faNewspaper
} from "@fortawesome/free-regular-svg-icons";
import {useEffect} from "react";
import {
  faCog,
  faSignOutAlt,
  faHouse,
  faSearch,
  faCarSide,
  faBoltLightning,
  faCrown,
  faUser,
  faBriefcase,
  faTag
} from "@fortawesome/free-solid-svg-icons";
import {faServicestack} from "@fortawesome/free-brands-svg-icons";

const AdminNavBar = ({title = "Dashboard", subTitle = "", context = ""}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uimage, setUimage] = useState("");
  const [isloaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const isAdmin = localStorage.getItem("isAdmin");
      if (isAdmin === "false") {
        window.location.href = `/admin?next=${window.location.pathname}`;
        localStorage.setItem("error", "Login as an Admin");
        localStorage.removeItem("token");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/user/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();

        if (data.error) {
          if (data.error === "Invalid token") {
            localStorage.setItem("error", "session expired");
            localStorage.removeItem("token");
            window.location.href = `/admin?next=${window.location.pathname}`;
          } else if (data.error === "User not found" || data.error === "Account Disabled") {
            localStorage.setItem("error", data.error);
            localStorage.removeItem("token");
            window.location.href = `/admin?next=${window.location.pathname}`;
          } else {
            setFirstName(localStorage.getItem("first_name"));
            setLastName(localStorage.getItem("last_name"));
            setUimage(localStorage.getItem("image"));
          }
          throw new Error("Failed to fetch user details");
        }

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUimage(data.image);
        localStorage.setItem("image", data.image);
        localStorage.setItem("first_name", data.first_name);
        localStorage.setItem("last_name", data.last_name);
      } catch (error) {
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin";
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>

        <div className="adminSidebarIcon">
          <div className="sidebarIcon">
            <img src="/images/ailms_icon.png" id="logoIcon" alt="AILMS" />
            <img src="/images/ai-lms.png" alt="AI-LMS" />
          </div>
          <p className="admin-badge">
            <FontAwesomeIcon icon={faCrown} className="admin-badge-noti" />
            Admin
          </p>
        </div>
        <ul>
          <li className={`${title === "Dashboard" ? "active" : ""}`}>
            <a onClick={() => navigate("/admin/dashboard")} className="d-flex align-items-center">
              {title === "Dashboard" ? (
                <div className="homeIconDiv">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
              ) : (
                <FontAwesomeIcon icon={faHouse} />
              )}
              Dashboard
            </a>
          </li>
          <li className={`${title === "Content Management" ? "active" : ""}`}>
            <a onClick={() => navigate("/admin/content-management")} href="#">
              {title === "Content Management" ? (
                <FontAwesomeIcon icon={faFolderOpen} />
              ) : (
                <FontAwesomeIcon icon={faFolderClosed} />
              )}
              Content Management
            </a>
          </li>
          <li className={`${title === "Category Management" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/category-management")}
              href="#"
              className="d-flex align-items-center"
            >
              {title !== "Category Management" ? (
                <FontAwesomeIcon icon={faTag} />
              ) : (
                <div className="tagIconDiv">
                  <FontAwesomeIcon icon={faTag} />
                </div>
              )}
              Category Management
            </a>
          </li>
          <li className={`${title === "User Management" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/user-management")}
              href="#"
              className="d-flex align-items-center"
            >
              {title !== "User Management" ? (
                <FontAwesomeIcon icon={faUser} />
              ) : (
                <div className="userIconDiv">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              User Management
            </a>
          </li>
          {title !== "Staff Management" ? (
            <li>
              <a onClick={() => navigate("/admin/staff-management")} href="#">
                <FontAwesomeIcon icon={faBriefcase} />
                Staff Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/staff-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                Staff Management
              </a>
            </li>
          )}
          {title !== "News Management" ? (
            <li>
              <a onClick={() => navigate("/admin/news-management")} href="#">
                <FontAwesomeIcon icon={faNewspaper} />
                News Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/news-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faNewspaper} />
                </div>
                News Management
              </a>
            </li>
          )}
          {title !== "Service Management" ? (
            <li>
              <a onClick={() => navigate("/admin/service-management")} href="#">
                <FontAwesomeIcon icon={faServicestack} />
                Service Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/service-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faServicestack} />
                </div>
                Service Management
              </a>
            </li>
          )}{" "}
          <li className={`${title === "Profile" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/account/settings")}
              href="#"
              className="d-flex align-items-center"
            >
              {title === "Profile" ? (
                <div className="cogIconDiv">
                  <FontAwesomeIcon icon={faCog} />
                </div>
              ) : (
                <FontAwesomeIcon icon={faCog} />
              )}
              Profile
            </a>
          </li>
          <li className="navlogout">
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} id="logoutIcon" /> <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      <div className={`desktop-sidebar`}>
        <div className="adminSidebarIcon">
          <div className="sidebarIcon">
            <img src="/images/logo.png" alt="Logo" class="img-fluid" />
          </div>
          <p className="admin-badge">
            <FontAwesomeIcon icon={faCrown} className="admin-badge-noti" />
            Admin
          </p>
        </div>
        <ul>
          <li className={`${title === "Dashboard" ? "active" : ""}`}>
            <a onClick={() => navigate("/admin/dashboard")} className="d-flex align-items-center">
              {title === "Dashboard" ? (
                <div className="homeIconDiv">
                  <FontAwesomeIcon icon={faHouse} />
                </div>
              ) : (
                <FontAwesomeIcon icon={faHouse} />
              )}
              Dashboard
            </a>
          </li>
          <li className={`${title === "Content Management" ? "active" : ""}`}>
            <a onClick={() => navigate("/admin/content-management")} href="#">
              {title === "Content Management" ? (
                <FontAwesomeIcon icon={faFolderOpen} />
              ) : (
                <FontAwesomeIcon icon={faFolderClosed} />
              )}
              Content Management
            </a>
          </li>
          <li className={`${title === "Category Management" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/category-management")}
              href="#"
              className="d-flex align-items-center"
            >
              {title !== "Category Management" ? (
                <FontAwesomeIcon icon={faTag} />
              ) : (
                <div className="tagIconDiv">
                  <FontAwesomeIcon icon={faTag} />
                </div>
              )}
              Category Management
            </a>
          </li>
          <li className={`${title === "User Management" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/user-management")}
              href="#"
              className="d-flex align-items-center"
            >
              {title !== "User Management" ? (
                <FontAwesomeIcon icon={faUser} />
              ) : (
                <div className="userIconDiv">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              User Management
            </a>
          </li>

          {title !== "Staff Management" ? (
            <li>
              <a onClick={() => navigate("/admin/staff-management")} href="#">
                <FontAwesomeIcon icon={faBriefcase} />
                Staff Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/staff-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                Staff Management
              </a>
            </li>
          )}

          {title !== "News Management" ? (
            <li>
              <a onClick={() => navigate("/admin/news-management")} href="#">
                <FontAwesomeIcon icon={faNewspaper} />
                News Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/news-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faNewspaper} />
                </div>
                News Management
              </a>
            </li>
          )}

          {title !== "Service Management" ? (
            <li>
              <a onClick={() => navigate("/admin/service-management")} href="#">
                <FontAwesomeIcon icon={faServicestack} />
                Service Management
              </a>
            </li>
          ) : (
            <li className="active">
              <a
                onClick={() => navigate("/admin/service-management")}
                href="#"
                className="d-flex align-items-center"
              >
                <div className="staffIconDiv">
                  <FontAwesomeIcon icon={faServicestack} />
                </div>
                Service Management
              </a>
            </li>
          )}

          <li className={`${title === "Profile" ? "active" : ""}`}>
            <a
              onClick={() => navigate("/admin/account/settings")}
              href="#"
              className="d-flex align-items-center"
            >
              {title === "Profile" ? (
                <div className="cogIconDiv">
                  <FontAwesomeIcon icon={faCog} />
                </div>
              ) : (
                <FontAwesomeIcon icon={faCog} />
              )}
              Profile
            </a>
          </li>
          <li className="navlogout">
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} id="logoutIcon" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="preNav">
        <div className="NavBar">
          <div className="nav-left">
            <div className="nav-search-bar">
              <FontAwesomeIcon icon={faSearch} id="navBarIcon" />
              <input type="text" placeholder="Search..." className="search-input" />
            </div>
          </div>
          <div className="nav-right">
            <a onClick={() => navigate("/admin")} href="#" className="nav-noti">
              <FontAwesomeIcon icon={faBell} />
            </a>
            <div className="nav-divider">
              <span className="vertical-line"></span>
            </div>
            <a
              onClick={() => navigate("/admin/account/settings")}
              href="#"
              className="d-flex text-decoration-none align-items-center"
            >
              {firstName && lastName ? (
                <span>
                  Hi, {firstName} <span className="nameForTab">{lastName}</span>
                </span>
              ) : null}

              {uimage ? (
                <div className="adminProfileImage mx-2 s-35">
                  <div className="adminProfileIconDiv">
                    <FontAwesomeIcon icon={faCrown} className="adminProfileIcon2" />
                  </div>
                  <img src={`${IMAGE_HOST}${uimage}`} className="s-31" alt="Profile" />
                </div>
              ) : isloaded ? (
                <div className="adminProfileImage mx-2 s-35">
                  <div className="adminProfileIconDiv">
                    <FontAwesomeIcon icon={faCrown} className="adminProfileIcon2" />
                  </div>
                  <img src="/images/default_profile.png" className="s-31" alt="Profile" />
                </div>
              ) : null}
            </a>
          </div>
        </div>
        <div className="navbar-title">
          <h3>{title}</h3> {subTitle !== "" ? <h5>/{subTitle}</h5> : null}
        </div>
        <div className="navbar-title2">
          <h5>{context}</h5>
        </div>
      </div>
      {/* Overlay when Sidebar is Open */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default AdminNavBar;

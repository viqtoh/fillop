import React from "react";
import NavBar from "../components/UserNavBar";
import "../styles/home.css";
import {useState, useEffect} from "react";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {faBookOpenReader, faRocket, faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams} from "react-router-dom";
import CourseRow from "../components/CourseRow";

const Achievements = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");
  const [data, setData] = useState({});
  const [search, setSearch] = useState("");
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setImageUrl(localStorage.getItem("image"));
    setUsername(localStorage.getItem("first_name") + " " + localStorage.getItem("last_name"));
  }, []);

  useEffect(() => {
    const filteredAchievements = data.achievements?.filter((achievement) =>
      achievement.title.toLowerCase().includes(search.toLowerCase())
    );
    setAchievements(filteredAchievements || []);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/achievements`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
        setAchievements(data.achievements);
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);

    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);
  return (
    <div>
      <div className="navHeader">
        <NavBar title="Achievements" />
      </div>
      <div className="main-body main-body5 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading || data === null ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <div className="archievementHeader">
              <div className="aheaderContent">
                <img
                  src={
                    data.user.image
                      ? `${IMAGE_HOST}${data.user.image}`
                      : "/images/default_profile.png"
                  }
                  alt="user-image"
                  className="aheaderImage"
                />

                <div className="AheaderContent">
                  <div className="headerTitle">
                    <div>
                      <span>
                        {data.user.first_name && `${data.user.first_name} `}
                        {data.user.last_name && `${data.user.last_name}`}
                      </span>
                    </div>

                    <div className="cardDiv">
                      <div className="aCard">
                        <FontAwesomeIcon icon={faRocket} className="aCardIcon" />
                        <div className="aCardText">
                          <p>Paths Completed</p>
                          <span>{data.finishedLearningPaths}</span>
                        </div>
                      </div>
                      <div className="aCard">
                        <FontAwesomeIcon icon={faBookOpenReader} className="aCardIcon" />
                        <div className="aCardText">
                          <p>Courses Completed</p>
                          <span>{data.finishedCourses}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mheaderContent">
                <div className="AheaderContent">
                  <div className="headerTitle">
                    <div className="mheadertitle">
                      <img
                        src={
                          data.user.image
                            ? `${IMAGE_HOST}${data.user.image}`
                            : "/images/default_profile.png"
                        }
                        alt="user-image"
                        className="mheaderImage"
                      />
                      <span>
                        {data.user.first_name && `${data.user.first_name} `}
                        {data.user.last_name && `${data.user.last_name}`}
                      </span>
                    </div>

                    <div className="cardDiv">
                      <div className="mCard">
                        <FontAwesomeIcon icon={faRocket} className="mCardIcon" />
                        <div className="mCardText">
                          <p>Paths Completed</p>
                          <span>{data.finishedLearningPaths}</span>
                        </div>
                      </div>
                      <div className="mCard">
                        <FontAwesomeIcon icon={faBookOpenReader} className="mCardIcon" />
                        <div className="mCardText">
                          <p>Courses Completed</p>
                          <span>{data.finishedCourses}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="achievementBody">
              <div className="achievementBodyContent">
                <div className="searchBar mb-5">
                  <div className="searchButton">
                    <FontAwesomeIcon icon={faSearch} id="searchIcon" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for an achievement..."
                    className="searchInput"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {achievements.map((course, index) => (
                  <CourseRow key={index} index={index} {...course} />
                ))}

                {achievements.length === 0 && (
                  <div className="noAchievements">
                    <p>No achievements found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;

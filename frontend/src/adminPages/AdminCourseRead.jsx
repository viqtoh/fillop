import React, {useRef, useState, useEffect, useCallback} from "react";
import "../styles/read.css";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {
  faAngleDown,
  faAngleRight,
  faList,
  faLock,
  faPlay,
  faRedo,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import DocRenderer from "../components/DocRenderer";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import "@videojs/themes/dist/city/index.css";

// Fantasy

// Custom hook to handle browser back button

import "@videojs/themes/dist/fantasy/index.css";

// Forest
import "@videojs/themes/dist/forest/index.css";

// Sea
import "@videojs/themes/dist/sea/index.css";
import AssessmentHandler from "../pages/AssessmentHandler";
import BotpressChat from "../components/BotPressChat";

const MemoizedDocRenderer = React.memo(({url}) => {
  return <DocRenderer url={url} style={{width: "100%", maxWidth: "100vw"}} />;
});

const AdminCourseRead = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [coursesState, setCoursesState] = useState({});
  const [learningPath, setLearningPath] = useState(null);

  const [activeCourse, setActiveCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const descriptionRef = useRef();

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const {id, pathId} = useParams();
  const navigate = useNavigate();
  const lastTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const location = useLocation();
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [mode, setMode] = useState("");

  useEffect(() => {
    const handlePopState = () => {
      const pathname = location.pathname;
      const search = location.search;

      if (pathname.endsWith("/read")) {
        const newPath = pathId
          ? `/admin/content-management/path/${pathId}`
          : `/admin/content-management/course/${id}`;

        // Jump forward to a new state, bypassing history
        window.history.pushState({}, "", "/temp-redirect");

        // Immediately replace it with a clean URL
        window.history.replaceState({}, "", `${newPath}`);

        // Then redirect to the actual content page
        navigate(`${newPath}`, {replace: true});
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathId, id, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (videoRef.current && activeModule && activeModule.content_type === "video") {
      const timeoutId = setTimeout(() => {
        if (videoRef.current) {
          if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
          }

          playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: false,
            preload: "auto",
            userActions: {
              hotkeys: false,
              doubleClick: false,
              click: false
            },
            sources: [
              {
                src: `${
                  activeModule.file ? `${IMAGE_HOST}${activeModule.file}` : activeModule.content_url
                }`,
                type: "video/mp4"
              }
            ]
          });

          const player = playerRef.current;

          player.ready(function () {
            if (currentTime > 0) {
              setIsVideoReady(true);
            }
            const pipButton = player.controlBar.getChild("PictureInPictureToggle");
            if (pipButton) {
              player.controlBar.removeChild(pipButton);
            }
          });

          player.on("timeupdate", function () {
            lastTimeRef.current = player.currentTime();
          });

          player.on("timeupdate", () => {
            const current = player.currentTime();
            const duration = player.duration();
            if (current != 0) {
              setCurrentTime(Math.floor(current));
              setCurrentProgress(duration ? current / duration : 0);
            }
          });

          player.ready(() => {
            const controlBar = playerRef.current.controlBar;
            if (controlBar?.progressControl) {
              controlBar.progressControl.disable();
              const progressEl = controlBar.progressControl.el();
              if (progressEl) {
                progressEl.style.pointerEvents = "none";
              }
            }
          });
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [activeModule]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 10000); // 10 seconds
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    if (activeModule && activeModule.content_type !== "video") {
      startProgress();
    }
  }, [activeModule]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();

        if (data.error) {
          let preurl;
          const isAdmin = localStorage.getItem("isAdmin");
          if (isAdmin === "true") {
            preurl = "/admin";
          } else {
            preurl = "/";
          }
          if (data.error === "Invalid token") {
            localStorage.setItem("error", "session expired");
            localStorage.removeItem("token");
            window.location.href = `${preurl}?next=${window.location.pathname}`;
          } else if (data.error === "User not found" || data.error === "Account Disabled") {
            localStorage.setItem("error", data.error);
            localStorage.removeItem("token");
            window.location.href = `${preurl}?next=${window.location.pathname}`;
          }
          throw new Error("Failed to fetch");
        }
      } catch (error) {
      } finally {
        setIsLoaded(true);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const moduleId = params.get("module");

    if (moduleId) {
      let foundModule = null;
      let foundCourse = null;

      for (const course of courses) {
        const match = course.modules.find((m) => m.id === parseInt(moduleId));

        if (match) {
          foundModule = match;
          foundCourse = course;
          break;
        }
      }

      if (foundModule) {
        if (!activeModule || activeModule.id !== foundModule.id) {
          setActiveModule(foundModule);
          setActiveCourse(foundCourse);
          setCurrentTime(foundModule.userProgress?.last_second || 0);
          setCurrentProgress(foundModule.userProgress?.progress || 0);
        }
      } else {
        // If there's no moduleId in the URL, clear activeModule to show overview (if needed)
        if (activeModule) {
          setActiveModule(null);
          // Optionally, reset activeCourse to the main course/first course in path
          if (id && courses.length > 0) {
            const currentCourseById = courses.find((c) => c.id === parseInt(id));
            if (currentCourseById) {
              setActiveCourse(currentCourseById);
            }
          } else if (pathId && courses.length > 0) {
            setActiveCourse(courses[0]); // Default to first course in path
          }
        }
      }
    }
  }, [location.search, courses]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        let response;
        let rmode;
        if (id) {
          response = await fetch(`${API_URL}/api/course-full/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          setMode("course");
          rmode = "course";
        } else {
          response = await fetch(`${API_URL}/api/learning-path-full/${pathId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          setMode("path");
          rmode = "path";
        }

        if (!response.ok) {
          throw new Error("Failed to fetch object");
        }
        const data = await response.json();

        let datas;
        if (rmode === "course") {
          setCourses([data]);
          setActiveCourse(data);
          datas = [data];
        } else {
          setCourses(data.courses);
          setActiveCourse(data.courses[0]);
          datas = data.courses;
          setLearningPath(data);
        }

        for (let index = 0; index < datas.length; index++) {
          setCoursesState((prevData) => ({
            ...prevData,
            [datas[index].id]: true
          }));
        }
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, token, pathId, showToast]);

  useEffect(() => {
    if (activeModule) {
      const updateProgress = async () => {
        try {
          let response;
          if (id) {
            response = await fetch(`${API_URL}/api/set/active/module`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({courseId: id, moduleId: activeModule.id})
            });
          } else {
            response = await fetch(`${API_URL}/api/set/active/module`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                learningPathId: pathId,
                courseId: activeCourse.id,
                moduleId: activeModule.id
              })
            });
          }
          const data = await response.json();
        } catch (err) {
          showToast(err.message, false);
        } finally {
          setIsLoading(false);
        }
      };

      updateProgress();
    }
  }, [activeModule]);

  const updateProgress = async () => {
    const newCurrentTime = playerRef.current.currentTime();
    const totalTime = playerRef.current.duration();
    if (newCurrentTime > 3) {
      try {
        const response = await fetch(`${API_URL}/api/module-progress/${activeModule.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "in_progress",
            progress: (newCurrentTime / totalTime) * 100,
            last_second: Math.floor(newCurrentTime)
          })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch object");
        }
        const data = await response.json();
      } catch (err) {
        showToast(err.message, false);
      }
    }
  };

  const startProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/module-progress/${activeModule.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "in_progress"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch object");
      }
      const data = await response.json();
    } catch (err) {
      showToast(err.message, false);
    }
  };

  const endProgress = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/module-progress/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: "completed"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch object");
      }
      const data = await response.json();
    } catch (err) {
      showToast(err.message, false);
    }
  };

  const activateModule = (module) => {
    if (activeModule) {
      setCourses((prevCourses) =>
        prevCourses.map((course) => ({
          ...course,
          modules: course.modules.map((module) =>
            module.id === activeModule.id
              ? {
                  ...module,
                  userProgress: {
                    ...module.userProgress,
                    progress: 100
                  }
                }
              : module
          )
        }))
      );
    }

    setActiveModule(module);
    navigate(`?module=${module.id}`);
  };

  const toggleCourse = (courseId) => {
    setCoursesState((prevState) => ({
      ...prevState,
      [courseId]: !prevState[courseId] // Toggle the state for the specific course by its id
    }));
  };

  const startVideo = () => {
    playerRef.current.currentTime(0);
    setCurrentTime(0);
    playerRef.current.play();
    updateProgress();
    setIsVideoReady(false);
  };

  const resumeVideo = () => {
    playerRef.current.currentTime(currentTime);
    playerRef.current.play();
    updateProgress();
    setIsVideoReady(false);
  };

  const startCourse = () => {
    setActiveCourse(courses[0]);
    activateModule(courses[0].modules[0]);
  };

  const iniActivateModule = (course) => {
    setActiveCourse(course);
    const progress = course.progress;
    let index = (progress / 100) * course.modules.length;
    if (progress === 0) {
      index = 0;
    } else {
      index = Math.floor(index);
    }
    setActiveCourse(course);
    activateModule(course.modules[index]);
  };

  const resumeCourse = () => {
    if (mode === "course") {
      const progress = courses[0].progress;
      let index = (progress / 100) * courses[0].modules.length;
      if (progress === 0) {
        index = 0;
      } else {
        index = Math.floor(index);
      }
      setActiveCourse(courses[0]);
      activateModule(courses[0].modules[index]);
    } else {
      const progress = learningPath.progress;
      let index = (progress / 100) * learningPath.courses.length;
      if (progress === 0) {
        index = 0;
      } else {
        index = Math.floor(index);
      }
      iniActivateModule(learningPath.courses[index]);
    }
  };

  const checkPermissionModule = (courseId, moduleId) => {
    return true;
  };

  const checkPermissionCourse = (courseId) => {
    return true;
  };

  const checkLast = () => {
    const foundCourse = courses.find((course) =>
      course.modules.some((module) => module.id === activeModule.id)
    );

    if (foundCourse) {
      const isLastCourse = courses[courses.length - 1].id === foundCourse.id;
      const isLastModule =
        foundCourse.modules[foundCourse.modules.length - 1].id === activeModule.id;
      return isLastCourse && isLastModule;
    }
    return false;
  };

  const checkNext = () => {
    if (playerRef.current) {
      const newCurrentTime = playerRef.current.currentTime();
      const totalTime = playerRef.current.duration();

      if (newCurrentTime >= totalTime - 10) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const goNext = () => {
    const foundCourse = courses.find((course) =>
      course.modules.some((module) => module.id === activeModule.id)
    );
    const nextModuleIndex =
      foundCourse.modules.findIndex((module) => module.id === activeModule.id) + 1;
    if (nextModuleIndex < foundCourse.modules.length) {
      activateModule(foundCourse.modules[nextModuleIndex]);
    } else {
      const nextCourseIndex = courses.findIndex((course) => course.id === foundCourse.id) + 1;
      if (nextCourseIndex < courses.length) {
        const nextCourse = courses[nextCourseIndex];
        const firstModule = nextCourse.modules[0];
        activateModule(firstModule);
        setActiveCourse(nextCourse);
      } else {
        setIsEnded(true);
      }
    }
  };

  const nextModule = async () => {
    const foundCourse = courses.find((course) =>
      course.modules.some((module) => module.id === activeModule.id)
    );
    const body = {
      moduleId: activeModule.id,
      courseId: foundCourse.id,
      end: false
    };

    if (learningPath) {
      body.learningPathId = learningPath.id;
    }
    // Check if activeModule is the last module in foundCourse.modules
    const isLastModule = foundCourse.modules[foundCourse.modules.length - 1].id === activeModule.id;
    if (isLastModule) {
      body.end = true;
    }

    try {
      goNext();
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        {/* Top Navbar */}
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <div className="readLearnPath headerRead align-items-center w-100 justify-content-between">
              <div className="d-flex">
                <button
                  className={`btn btn-outline-light hamburger2  ${
                    sidebarOpen ? "" : "hamburgerclosed"
                  }`}
                  onClick={toggleSidebar}
                >
                  &#9776;
                </button>
                {learningPath && <p>{learningPath.title}</p>}
              </div>
              {activeModule &&
                (checkLast() && !isEnded ? (
                  <button className="nextbtn" onClick={() => setShowNextModal(true)}>
                    End
                  </button>
                ) : activeModule.content_type === "video" ? (
                  checkNext() ? (
                    <button className="nextbtn" onClick={nextModule}>
                      Next Module
                    </button>
                  ) : (
                    <button className="nextbtn" disabled>
                      Next Module
                    </button>
                  )
                ) : (
                  <button className="nextbtn" onClick={() => setShowNextModal(true)}>
                    Next Module
                  </button>
                ))}
            </div>
          </div>
        </nav>
        <div className="readerHouse">
          {/* Sidebar */}
          <div className={`sidebar2 ${sidebarOpen ? "open" : ""}`}>
            <button
              className={`btn  hamburger3  ${sidebarOpen ? "" : "hamburgerclosed"}`}
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faTimes} color="#fff" />
            </button>
            <span className="menu">menu</span>
            {learningPath && (
              <div className="readLearnPath">
                <span>{learningPath.title}</span>
              </div>
            )}
            {courses &&
              courses.map(
                (course, index) =>
                  course.modules.length > 0 && (
                    <div
                      key={course.title}
                      className={`sideCourse ${learningPath && "learnPresent"}`}
                    >
                      <div className="sideCourseSub">
                        <div className="d-flex gap-2 w-100 align-items-center">
                          <button onClick={() => toggleCourse(course.id)} className="text-white">
                            <FontAwesomeIcon
                              icon={coursesState[course.id] ? faAngleDown : faAngleRight}
                            />
                          </button>
                          <p>{course.title}</p>
                        </div>
                      </div>

                      {/* Only show the modules if the state is true */}

                      <div className="sideModules">
                        {course.modules.map((module) => (
                          <div
                            key={module.updatedAt}
                            onClick={() => {
                              if (
                                checkPermissionCourse(course.id) &&
                                checkPermissionModule(course.id, module.id)
                              ) {
                                activateModule(module);
                              }
                            }}
                            className={`sideModule ${
                              coursesState[course.id] ? "" : "h-0"
                            } d-flex gap-3 justify-content-between align-items-center`}
                          >
                            <div className="d-flex gap-2 align-items-center">
                              {checkPermissionCourse(course.id) &&
                              checkPermissionModule(course.id, module.id) ? (
                                <FontAwesomeIcon icon={faPlay} />
                              ) : (
                                <FontAwesomeIcon icon={faLock} />
                              )}{" "}
                              <span>{module.title}</span>
                            </div>
                            <span>{module.userProgress.progress}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
          </div>
          <div className="" id="mainReader">
            {toast && (
              <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />
            )}
            {isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : courses !== null ? (
              <div className="readerBody bg-dark">
                {!activeModule && activeCourse && (
                  <div className="w-100" style={{height: "100%"}}>
                    <div className="activeCourseBanner">
                      <img src="/images/default_course_banner.png" />
                      <div className="activeCourseTitle">
                        <h1>{activeCourse.title}</h1>
                        <div className="activeCourseButtons">
                          {courses.length !== 0 &&
                            (courses[0].courseProgress === "in_progress" ? (
                              <button onClick={() => resumeCourse()}>RESUME COURSE</button>
                            ) : (
                              <button onClick={() => startCourse()}>START COURSE</button>
                            ))}
                          <span
                            style={{cursor: "pointer"}}
                            onClick={() =>
                              descriptionRef.current?.scrollIntoView({behavior: "smooth"})
                            }
                          >
                            Details <FontAwesomeIcon icon={faAngleDown} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="activeCourseBody">
                      <div className="activeCourseDescription" ref={descriptionRef}>
                        <span>{activeCourse.description}</span>
                      </div>
                      <div className="activeCourseMenu">
                        <p>Module Menu</p>
                      </div>
                      <div className="activeCourseModules">
                        {activeCourse.modules.map((module) => (
                          <div
                            className="activeIntroModule"
                            key={`momdule-${module.title}`}
                            onClick={() => {
                              if (checkPermissionModule(activeCourse.id, module.id)) {
                                activateModule(module);
                              }
                            }}
                          >
                            <div>
                              {checkPermissionModule(activeCourse.id, module.id) ? (
                                <FontAwesomeIcon icon={faList} />
                              ) : (
                                <FontAwesomeIcon icon={faLock} />
                              )}
                              <span>{module.title}</span>
                            </div>

                            <div className="activeModuleCircle"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {isLoading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : isEnded ? (
                  <div>
                    <div
                      className="course-end-message d-flex flex-column align-items-center justify-content-center"
                      style={{minHeight: "60vh"}}
                    >
                      <img
                        src="/images/course_completed.png"
                        alt="Course Completed"
                        style={{width: 120, marginBottom: 24}}
                      />
                      <h2 className="text-success mb-3">Congratulations!</h2>
                      <p className="mb-2">You have completed this course.</p>
                      {pathId && (
                        <p className="mb-0 text-info">
                          You have also completed this learning path.
                        </p>
                      )}
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          if (pathId) {
                            navigate(`/admin/content-management/path/${pathId}`);
                          } else {
                            navigate(`/admin/content-management/course/${id}`);
                          }
                        }}
                      >
                        {" "}
                        Back to {pathId ? "Learning Path" : "Course"}{" "}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-100 w-100">
                    {activeModule && activeCourse && activeModule.content_type !== "assessment" && (
                      <div className="chatDiv">
                        <BotpressChat />
                      </div>
                    )}

                    {activeModule &&
                      activeCourse &&
                      activeModule.content_type !== "video" &&
                      activeModule.content_type !== "assessment" && (
                        <div style={{width: "100%", maxWidth: "100vw", overflowX: "auto"}}>
                          <MemoizedDocRenderer url={`${API_URL}${activeModule.file}`} />
                        </div>
                      )}

                    {activeModule && activeModule.content_type === "video" ? (
                      <div className="videoReaderDiv">
                        {isVideoReady && currentTime > 0 ? (
                          <div className="startdiv">
                            <button onClick={() => resumeVideo()}>
                              <FontAwesomeIcon icon={faPlay} />

                              <span>Resume</span>
                            </button>
                            <button onClick={() => startVideo()}>
                              <FontAwesomeIcon icon={faRedo} />
                              <span>Start Over</span>
                            </button>
                          </div>
                        ) : null}

                        {isVideoReady && currentTime === 0 ? (
                          <div className="startdiv">
                            <button onClick={() => startVideo()}>
                              <FontAwesomeIcon icon={faPlay} />
                              <span>Start</span>
                            </button>
                          </div>
                        ) : null}

                        <div className="d-flex justify-content-center align-items-center h-100 w-100 ">
                          <div data-vjs-player>
                            <video
                              className="video-js vjs-theme-fantasy"
                              ref={videoRef}
                              onLoadedMetadata={() => setIsVideoReady(true)}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                              onEnded={() => setIsPlaying(false)}
                              controls
                              disablePictureInPicture
                              controlsList="nodownload nofullscreen noremoteplayback"
                            />
                            <style>
                              {`
          .vjs-big-play-button {
            visibility: ${!isVideoReady ? "visible" : "hidden"} !important;
          }
        `}
                            </style>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {activeModule && activeModule.content_type === "assessment" && (
                      <AssessmentHandler iniAssessment={activeModule} />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="noObjects">Object not Found!</div>
            )}
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {activeModule && (
        <div
          className="modal fade show"
          style={{
            display: sidebarOpen ? "none" : "block",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh"
          }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          hidden={!showNextModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{pointerEvents: "auto"}}
          >
            <div className="modal-content areyousure">
              <div className="modal-body">
                <p>Are you sure you want to move to the next module?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowNextModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4"
                  onClick={() => {
                    setShowNextModal(false);
                    nextModule();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseRead;

import React from "react";
import NavBar from "../components/LecturerNavBar";
import "../styles/home.css";
import {useState, useEffect} from "react";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {
  faStar,
  faRotateLeft,
  faSearch,
  faAngleDown,
  faAngleUp
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faHeart} from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import {useNavigate} from "react-router-dom";

const LecturerLibrary = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [type, setType] = useState("both");
  const [contents, setContents] = useState([]);
  const [isRefetching, setIsRefetching] = useState(false);
  const [canRefetch, setCanRefetch] = useState(true);
  const [categories, setCategories] = useState([]);
  const [fCategories, setFcategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isPublished, setIsPublished] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const navigate = useNavigate();
  const [limited, setLimited] = useState(true);
  const [lecturer, setLecturer] = useState(0);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setCanRefetch(true);
        setContents([]);
        const queryParams = new URLSearchParams({
          start: 0,
          limit: 10,
          type,
          isPublished,
          categories: selectedCategories.join(","),
          search,
          sort,
          limited: limited
        });

        const response = await fetch(`${API_URL}/api/lecturer/contents?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setLecturer(data.lecturer);
        setContents(Array.isArray(data.contents) ? data.contents : []);
      } catch (err) {
        showToast(err.response?.data?.error || "Failed to fetch contents", false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [type, isPublished, selectedCategories, search, sort, limited]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/category`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        setFcategories(data);
        setIsLoading(false);
      } catch (error) {
        showToast("Failed to load categories", false);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [token, showToast]);

  const resetFilter = () => {
    setType("both");
    setIsPublished("");
    setSelectedCategories([]);
    setSearch("");
    setSort("asc");
    document.getElementById("learnCheck").checked = false;
    document.getElementById("courseCheck").checked = false;
    document.getElementById("publishedRad").checked = false;
    document.getElementById("NoPublishedRad").checked = false;
    document.querySelectorAll(".catCheck").forEach((checkbox) => {
      checkbox.checked = false;
    });
  };

  const makeType = () => {
    let ck = document.getElementById("learnCheck");
    let ch2 = document.getElementById("courseCheck");
    if (ck.checked && ch2.checked) {
      setType("both");
    } else if (ck.checked && !ch2.checked) {
      setType("learningpath");
    } else if (!ck.checked && ch2.checked) {
      setType("course");
    } else {
      setType("both");
    }
  };

  const makeCategory = (value) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== value));
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  const makeLimit = () => {
    let limitCheck = document.getElementById("limitCheck");
    if (limitCheck.checked) {
      setLimited(true);
    } else {
      setLimited(false);
    }
  };

  const makePublished = () => {
    let publishedRad = document.getElementById("publishedRad");
    let NoPublishedRad = document.getElementById("NoPublishedRad");
    if (publishedRad.checked) {
      setIsPublished("yes");
    } else if (NoPublishedRad.checked) {
      setIsPublished("no");
    } else {
      setIsPublished("");
    }
  };

  const reFetchContents = async () => {
    setIsRefetching(true);
    try {
      const queryParams = new URLSearchParams({
        start: contents.length,
        limit: 10,
        type,
        isPublished,
        categories: selectedCategories.join(","),
        search,
        sort,
        limited: true
      });

      const response = await fetch(`${API_URL}/api/lecturer/contents?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setContents([...contents, ...(Array.isArray(data.contents) ? data.contents : [])]);
      if (data.contents.length === 0) {
        setCanRefetch(false);
      }
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to fetch contents", false);
    } finally {
      setIsRefetching(false);
    }
  };

  useEffect(() => {
    const handleScroll = async (e) => {
      if (canRefetch) {
        const {scrollTop, scrollHeight, clientHeight} = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isRefetching) {
          await reFetchContents();

          setTimeout(() => setIsRefetching(false), 500); // Prevent rapid refetching
        }
      }
    };

    const subBody = document.querySelector(".sub-body");
    if (subBody) {
      subBody.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (subBody) {
        subBody.removeEventListener("scroll", handleScroll);
      }
    };
  }, [contents.length, isRefetching]);

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "#dfdfdf",
      color: "#000",
      borderRadius: "8px",
      height: "3px",
      fontSize: "12px",
      boxShadow: "none",
      height: "42px",

      "&:hover": {borderColor: "#8c8c8c", backgroundColor: "#eaeaea"}
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#333"
    }),
    option: (base, {isFocused, isSelected}) => ({
      ...base,
      backgroundColor: isSelected ? "#4a90e2" : isFocused ? "#cce4ff" : "white",
      color: isSelected ? "white" : "#333",
      padding: "5px",
      cursor: "pointer"
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
    }),
    indicatorSeparator: () => ({
      display: "none"
    }),

    // Optional: Style the dropdown arrow container if needed
    indicatorsContainer: (base) => ({
      ...base,
      padding: "0px",
      color: "#333",
      height: "28px",
      width: "24px"
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "8px 4px 0px 0px" // Adjust this value
    })
  };

  const sortOptions = [
    {value: "a-z", label: "Title A-Z"},
    {value: "z-a", label: "Title Z-A"}
  ];

  const handleChange = (selectedOption) => {
    if (selectedOption.value === "z-a") {
      setSort("desc");
    } else {
      setSort("asc");
    }
  };

  return (
    <div>
      <div className="navHeader">
        <NavBar title="Content Library" />
      </div>
      <div className="main-body2 main-body main-body3">
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
                <FontAwesomeIcon
                  icon={faSearch}
                  onClick={() => {
                    const searchInput = document.querySelector(".searchBar2");
                    if (searchInput) {
                      setSearch(searchInput.value);
                    }
                  }}
                  style={{cursor: "pointer"}}
                />
                <input
                  type="text"
                  className="searchBar2"
                  placeholder="Search content by title or description"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearch(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="sortContainer">
                <button
                  className="btn btn-reset"
                  onClick={() => {
                    resetFilter();
                  }}
                >
                  <FontAwesomeIcon icon={faRotateLeft} />
                  <span className="ms-1">Reset Filters</span>
                </button>
                <Select
                  styles={customStyles}
                  options={sortOptions}
                  placeholder={"Sort: Default"}
                  onChange={handleChange}
                />

                <button
                  className="btn btn-reset showFilterBtn"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <span className="ms-1">Show Filters</span>
                </button>
                <a className="cContentLink" href="/lecturer/content-library/create">
                  <button className="btn btn-theme h-100">Create Content</button>
                </a>
              </div>
            </div>
            <div className="desktopSeperator">
              <div className="desktopFilterMain" style={showFilter ? {display: "block"} : {}}>
                <div className="filterSeperator" style={!cisCollapsed ? {maxHeight: "300px"} : {}}>
                  <div>
                    <div
                      className="header d-flex justify-content-between"
                      onClick={() => setCisCollapsed(!cisCollapsed)}
                      style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    >
                      <h5 className="filterHeading">Content Filter</h5>
                      <FontAwesomeIcon
                        icon={cisCollapsed ? faAngleDown : faAngleUp}
                        style={{marginLeft: "8px"}}
                      />
                    </div>

                    <ul className="collapsed-list nobar">
                      <li>
                        <input
                          type="checkbox"
                          id="limitCheck"
                          onClick={() => {
                            makeLimit();
                          }}
                          checked={limited}
                        />
                        <span>Created Content</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="filterSeperator" style={!cisCollapsed ? {maxHeight: "300px"} : {}}>
                  <div>
                    <div
                      className="header d-flex justify-content-between"
                      onClick={() => setCisCollapsed(!cisCollapsed)}
                      style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    >
                      <h5 className="filterHeading">Content Type</h5>
                      <FontAwesomeIcon
                        icon={cisCollapsed ? faAngleDown : faAngleUp}
                        style={{marginLeft: "8px"}}
                      />
                    </div>

                    <ul className="collapsed-list nobar">
                      <li>
                        <input
                          type="checkbox"
                          id="learnCheck"
                          onClick={() => {
                            makeType();
                          }}
                        />
                        <span>Learning Paths</span>
                      </li>
                      <li>
                        <input
                          type="checkbox"
                          id="courseCheck"
                          onClick={() => {
                            makeType();
                          }}
                        />
                        <span>Courses</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="filterSeperator" style={!risCollapsed ? {maxHeight: "300px"} : {}}>
                  <div>
                    <div
                      className="header d-flex justify-content-between"
                      onClick={() => setRisCollapsed(!risCollapsed)}
                      style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    >
                      <h5 className="filterHeading">Categories</h5>
                      <FontAwesomeIcon
                        icon={risCollapsed ? faAngleDown : faAngleUp}
                        style={{marginLeft: "8px"}}
                      />
                    </div>

                    <div className="categorySearchCon">
                      <FontAwesomeIcon icon={faSearch} />
                      <input
                        type="text"
                        className="categorySearch"
                        placeholder="Search categories"
                        onChange={(e) => {
                          const searchValue = e.target.value.toLowerCase();
                          const filtered = categories.filter((category) =>
                            category.name.toLowerCase().includes(searchValue)
                          );
                          setFcategories(filtered);
                        }}
                      />
                    </div>

                    <ul className="collapsed-list collapsed-list2">
                      {fCategories.map((category) => (
                        <li key={category.name}>
                          <input
                            type="checkbox"
                            className="catCheck"
                            onClick={() => {
                              makeCategory(category.name);
                            }}
                          />
                          <span>{category.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="filterSeperator" style={!fisCollapsed ? {maxHeight: "300px"} : {}}>
                  <div>
                    <div
                      className="header d-flex justify-content-between"
                      onClick={() => setFisCollapsed(!fisCollapsed)}
                      style={{cursor: "pointer", display: "flex", alignItems: "center"}}
                    >
                      <h5 className="filterHeading">Published</h5>
                      <FontAwesomeIcon
                        icon={fisCollapsed ? faAngleDown : faAngleUp}
                        style={{marginLeft: "8px"}}
                      />
                    </div>

                    <ul className="collapsed-list nobar">
                      <li>
                        <input
                          type="radio"
                          name="published"
                          id="publishedRad"
                          onClick={() => {
                            if (isPublished === "yes") {
                              document.getElementById("publishedRad").checked = false;
                            }
                            makePublished();
                          }}
                          value="yes"
                        />
                        <span>Yes</span>
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="published"
                          id="NoPublishedRad"
                          onClick={() => {
                            if (isPublished === "no") {
                              document.getElementById("NoPublishedRad").checked = false;
                            }
                            makePublished();
                          }}
                          value="no"
                        />
                        <span>No</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="searchBody greyScroll">
                {contents && contents.length > 0 ? (
                  contents.map((content, index) => (
                    <div
                      className="searchResult"
                      key={index}
                      onClick={() => {
                        if (content.type == "Course") {
                          navigate(`/lecturer/content-library/course/${content.id}`);
                        } else {
                          navigate(`/lecturer/content-library/path/${content.id}`);
                        }
                      }}
                    >
                      <div className="searchImage">
                        <img
                          src={
                            content.image == null
                              ? "/images/course_default.png"
                              : `${IMAGE_HOST}${content.image}`
                          }
                          className={content.image == null ? "courseDefault" : `courseImage`}
                          alt="Course"
                        />
                      </div>
                      <div className="searchContent">
                        <div className="searchBadge">
                          <span className="badge course-badge">{content.type}</span>
                        </div>
                        <div className="searchTitle">
                          <span>{content.title}</span>
                        </div>
                        <div className="searchDesc">
                          <span>{content.description}</span>
                        </div>
                      </div>
                      {lecturer && lecturer > 0 && content.lecturer === lecturer && (
                        <div className="ms-auto  madeBatch">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 90 90"
                          >
                            <path
                              d="M60.879 31.299c-6.173 5.123-11.7 10.614-16.569 16.37h-.021c-2.531-4.833-5.459-9.591-8.752-14.248l-14.077 4.832c6.182 6.566 11.571 13.473 16.011 20.67l6.243 10.118 4.665-9.973c4.161-8.895 9.903-17.532 17.283-25.655 7.361-8.13 13.293-13.679 23.373-20.676-11.879 4.183-19.417 8.986-28.656 16.662z"
                              fill="#0057ff"
                            />
                            <path
                              d="M76.876 29.21c2.368 4.761 3.708 10.121 3.708 15.79 0 19.62-15.964 35.584-35.584 35.584S9.416 64.62 9.416 45 25.379 9.416 45 9.416c9.278 0 17.734 3.572 24.075 9.409 2.586-1.794 5.273-3.557 8.057-5.287C68.958 5.192 57.576 0 45 0 20.187 0 0 20.187 0 45s20.187 45 45 45 45-20.188 45-45c0-8.039-2.129-15.586-5.838-22.125-2.57 1.964-4.989 4.079-7.286 6.21z"
                              fill="#0057ff"
                            />
                          </svg>
                          Made by You
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="noObjects">
                    <p>No results found</p>
                  </div>
                )}
                {isRefetching ? (
                  <div className="loader-container2">
                    <div className="loader2"></div>
                  </div>
                ) : null}
                {!canRefetch ? (
                  <div className="noData">
                    <span>No more data</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerLibrary;

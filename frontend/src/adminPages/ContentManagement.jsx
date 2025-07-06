import React from "react";
import NavBar from "../components/AdminNavBar";
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
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import AdminNavBar from "../components/AdminNavBar";
import {useNavigate} from "react-router-dom";

const ContentManagement = () => {
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
          sort
        });

        const response = await fetch(`${API_URL}/api/admin/contents?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setContents(Array.isArray(data.contents) ? data.contents : []);
      } catch (err) {
        showToast(err.response?.data?.error || "Failed to fetch contents", false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [type, isPublished, selectedCategories, search, sort]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/category`, {
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
        sort
      });

      const response = await fetch(`${API_URL}/api/admin/contents?${queryParams.toString()}`, {
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
        <AdminNavBar title="Content Management" />
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
                <a className="cContentLink" href="/admin/content-management/create">
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
                          navigate(`/admin/content-management/course/${content.id}`);
                        } else {
                          navigate(`/admin/content-management/path/${content.id}`);
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

export default ContentManagement;

import React, { useState, useEffect, useRef } from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import { API_URL, IMAGE_HOST } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import { faSearch, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const CreateContent = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const [pathFormData, setPathFormData] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    estimated_time: "",
    is_published: true,
    image: ""
  });

  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    show_outside: true,
    image: "",
    is_published: true
  });

  const handlePathChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_published") {
      let val = false;
      if (e.target.checked) {
        val = true;
      }
      setPathFormData((prevData) => ({
        ...prevData,
        [name]: val
      }));
    } else {
      setPathFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleCourseChange = (e) => {
    const { name, value } = e.target;

    if (name === "show_outside" || name === "is_published") {
      let val = false;
      if (e.target.checked) {
        val = true;
      }
      setCourseFormData((prevData) => ({
        ...prevData,
        [name]: val
      }));
    } else {
      setCourseFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

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

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategories2, setSelectedCategories2] = useState([]);

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
        setIsLoading(false);
      } catch (error) {
        showToast("Failed to load categories", false);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [token, showToast]);

  const formRef = useRef(null);

  const handleLearningPathSubmit = async (e) => {
    e.preventDefault();

    const formData = pathFormData;

    // Append selected categories as a JSON string
    formData["categoryIds"] = JSON.stringify(selectedCategories);

    try {
      const response = await fetch(`${API_URL}/api/admin/learningpath`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || "Failed to create learning path", false);
        return;
      }

      const result = await response.json();
      showToast("Learning path created successfully!", true);
      navigate(`/admin/content-management/path/${result.learningPath.id}`);
    } catch (error) {
      showToast("Internal Server Error", false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    const formData = courseFormData;
    formData["categoryIds"] = JSON.stringify(selectedCategories2);

    try {
      const response = await fetch(`${API_URL}/api/admin/course`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.error || "Failed to create course", false);
        return;
      }

      const result = await response.json();
      showToast("Course created successfully!", true);
      navigate(`/admin/content-management/course/${result.course.id}`);
    } catch (error) {
      showToast("Internal Server Error", false);
    }
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title="Content Management" subTitle="create" />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <div className="tab-container">
              <div className="tab-header">
                <button
                  className={`tab-button1 tab-button ${!showFilter ? "active" : ""}`}
                  onClick={() => setShowFilter(false)}
                >
                  <span className="unshow-mobile">Create </span>Learning Path
                </button>
                <button
                  className={`tab-button2 tab-button ${showFilter ? "active" : ""}`}
                  onClick={() => setShowFilter(true)}
                >
                  <span className="unshow-mobile">Create </span>Course
                </button>
              </div>
              <div className="tab-content">
                {!showFilter ? (
                  <div className="learning-path-tab">
                    <form
                      id="learningPathForm"
                      ref={(el) => (formRef.current = el)}
                      onSubmit={handleLearningPathSubmit}
                    >
                      <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <div className="uploadImageCon">
                          <div className="image-preview-container">
                            <img
                              src="/images/course_default.png"
                              alt="Preview"
                              id="image-preview"
                              className="image-preview"
                            />
                          </div>
                          <input
                            type="file"
                            id="image"
                            name="image"
                            className="form-control"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const preview = document.getElementById("image-preview");
                                  preview.src = event.target.result;
                                  setPathFormData((prevData) => ({
                                    ...prevData,
                                    image: event.target.result
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-theme"
                            onClick={() => document.getElementById("image").click()}
                          >
                            Upload Image
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          className="form-control"
                          placeholder="Enter title"
                          value={pathFormData.title}
                          onChange={handlePathChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          className="form-control"
                          placeholder="Enter description"
                          value={pathFormData.description}
                          onChange={handlePathChange}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                          id="difficulty"
                          name="difficulty"
                          className="form-control"
                          value={pathFormData.difficulty}
                          onChange={handlePathChange}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="path-category">Category</label>
                        <Select
                          isMulti
                          isSearchable
                          value={categories
                            .filter((category) => selectedCategories.includes(category.id))
                            .map((category) => ({
                              value: category.id,
                              label: category.name
                            }))}
                          onChange={(selectedOptions) =>
                            setSelectedCategories(selectedOptions.map((option) => option.value))
                          }
                          options={categories.map((category) => ({
                            value: category.id,
                            label: category.name
                          }))}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          id="path-category"
                          styles={{ container: (base) => ({ ...base, width: "100%" }) }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="estimated_time">Estimated Time</label>
                        <input
                          type="text"
                          id="estimated_time"
                          name="estimated_time"
                          className="form-control"
                          placeholder="Enter estimated time"
                          value={pathFormData.estimated_time}
                          onChange={handlePathChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="is_published">Publish</label>
                        <input
                          type="checkbox"
                          id="is_published"
                          name="is_published"
                          className="form-check-input"
                          checked={pathFormData.is_published}
                          onChange={handlePathChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="course-tab">
                    <form id="courseForm" onSubmit={handleCourseSubmit}>
                      <div className="form-group">
                        <label htmlFor="image">Image</label>
                        <div className="uploadImageCon">
                          <div className="image-preview-container">
                            <img
                              src="/images/course_default.png"
                              alt="Preview"
                              id="Cimage-preview"
                              className="image-preview"
                            />
                          </div>
                          <input
                            type="file"
                            id="Cimage"
                            name="image"
                            className="form-control"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const preview = document.getElementById("Cimage-preview");
                                  preview.src = event.target.result;
                                  setCourseFormData((prevData) => ({
                                    ...prevData,
                                    image: event.target.result
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-theme"
                            onClick={() => document.getElementById("Cimage").click()}
                          >
                            Upload Image
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="course-title">Course Title</label>
                        <input
                          type="text"
                          id="course-title"
                          className="form-control"
                          name="title"
                          placeholder="Enter course title"
                          value={courseFormData.title}
                          onChange={handleCourseChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="course-description">Course Description</label>
                        <textarea
                          id="course-description"
                          className="form-control"
                          placeholder="Enter course description"
                          name="description"
                          value={courseFormData.description}
                          onChange={handleCourseChange}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label htmlFor="course-category">Category</label>
                        <Select
                          isMulti
                          isSearchable
                          value={categories
                            .filter((category) => selectedCategories2.includes(category.id))
                            .map((category) => ({
                              value: category.id,
                              label: category.name
                            }))}
                          onChange={(selectedOptions) =>
                            setSelectedCategories2(selectedOptions.map((option) => option.value))
                          }
                          options={categories.map((category) => ({
                            value: category.id,
                            label: category.name
                          }))}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          id="course-category"
                          styles={{ container: (base) => ({ ...base, width: "100%" }) }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="show-outside">Show Outside</label>
                        <input
                          type="checkbox"
                          id="show-outside"
                          name="show_outside"
                          className="form-check-input"
                          checked={courseFormData.show_outside}
                          onChange={handleCourseChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="cis_published">Publish</label>
                        <input
                          type="checkbox"
                          id="cis_published"
                          name="is_published"
                          className="form-check-input"
                          checked={courseFormData.is_published}
                          onChange={handleCourseChange}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </form>
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

export default CreateContent;

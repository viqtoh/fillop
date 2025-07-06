import React from "react";
import "../styles/home.css";
import {useState, useEffect} from "react";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {
  faAngleDown,
  faCircleCheck,
  faCircleXmark,
  faSearch,
  faUserMinus,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate, useParams} from "react-router-dom";
import {CourseCollapsible} from "../components/AdminCollapsible";
import LecturerNavBar from "../components/LecturerNavBar";
import Select from "react-select";

const LecturerLearnPath = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);
  const [learningPath, setLearningPath] = useState(null);
  const [acourses, setAcourses] = useState([]);
  const [acourse, setAcourse] = useState(null);

  const {id} = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    image: "",
    show_outside: false,
    is_published: false
  });
  const [isModalInviteOpen, setIsModalInviteOpen] = useState(false);
  const [filInvited, setFilInvited] = useState([]);
  const [filNotInvited, setFilNotInvited] = useState([]);
  const [invitedSearch, setInvitedSearch] = useState("");
  const [invitingIds, setInvitingIds] = useState([]);
  const [canInvitingIds, setCanInvitingIds] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [pathFormData, setPathFormData] = useState({
    title: "",
    description: "",
    image: "",
    difficulty: "Beginner",
    estimated_time: "",
    is_published: false
  });

  const [selectedCategories2, setSelectedCategories2] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inviteDueDate, setInviteDueDate] = useState(null);
  const navigate = useNavigate();

  const handleInvite = async (ivstat) => {
    setInvitingIds((prevIds) => [...prevIds, ivstat.student.id]);
    setFilInvited([]);
    setFilNotInvited([]);
    try {
      // Add dueDate to the request body if set
      const requestBody = {
        student_id: ivstat.student.id,
        content_id: id,
        type: "learning_path",
        search: invitedSearch || "~"
      };
      if (inviteDueDate) {
        requestBody.dueDate = inviteDueDate;
      }
      const response = await fetch(`${API_URL}/api/lecturer/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error, false);
      } else {
        showToast(data.message, true);
        setFilInvited(data.invited);
        setFilNotInvited(data.notInvited);
      }
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setInvitingIds((prevIds) => prevIds.filter((id) => id !== ivstat.student.id));
    }
  };

  const handleCancelInvite = async (ivstat) => {
    setCanInvitingIds((prevIds) => [...prevIds, ivstat.student.id]);
    try {
      // Add dueDate to the request body if set
      const requestBody = {
        student_id: ivstat.student.id,
        content_id: id,
        type: "learning_path",
        search: invitedSearch || "~"
      };
      if (inviteDueDate) {
        requestBody.dueDate = inviteDueDate;
      }
      const response = await fetch(`${API_URL}/api/lecturer/cancel/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error, false);
      } else {
        showToast(data.message, true);
        setFilInvited(data.invited);
        setFilNotInvited(data.notInvited);
      }
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setCanInvitingIds((prevIds) => prevIds.filter((id) => id !== ivstat.student.id));
    }
  };

  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading3(true);
      try {
        const response = await fetch(
          `${API_URL}/api/lecturer/content/invite/${id}/learning_path/${invitedSearch || "~"}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setFilInvited(data.invited);
        setFilNotInvited(data.notInvited);
      } catch (error) {
        showToast("Failed to load invitations", false);
        setIsLoading(false);
      } finally {
        setIsLoading3(false);
      }
    };
    fetchInvitations();
  }, [invitedSearch]);

  const deleteLearningPath = async () => {
    try {
      setIsLoading2(true);
      const response = await fetch(`${API_URL}/api/admin/learning-path/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete learning path");
      }
      showToast("Learning path deleted successfully", true);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setIsLoading2(false);
      setIsDeleteModalOpen(false);
      navigate("/admin/content-management");
    }
  };

  const fetchLearningPath = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lecturer/learning-path-full/${id}`, {
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
      setSelectedCategories(data.categories.map((category) => category.id));

      setPathFormData((prevData) => ({
        ...prevData,
        title: data.title,
        description: data.description,
        image: data.image,
        difficulty: data.difficulty,
        estimated_time: data.estimated_time,
        is_published: data.is_published
      }));
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLearningPath();
  }, [id, token]); // Refetch when id or token changes

  const fetchLearningPathCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lecturer/learning-path-full/${id}/acourses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch learning path courses");
      }
      const data = await response.json();

      if (data.courses) {
        setAcourses(data.courses);
      }
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLearningPathCourses();
  }, [id, token]);

  const handlePathChange = (e) => {
    const {name, value} = e.target;

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
    const {name, value, type, checked} = e.target;
    setCourseFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const moveUp = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/lecturer/learning-path/${learningPath.id}/move-up/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.error) {
        showToast(data.error, false);
      }
      if (data.message) {
        showToast(data.message, true);
      }
      setIsLoading(false);
      fetchLearningPath();
    } catch (error) {
      showToast("Failed to move course", false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/lecturer/category`, {
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

  const handleLearningPathSubmit = async (e) => {
    e.preventDefault();

    const formData = pathFormData;

    // Append selected categories as a JSON string
    formData["categoryIds"] = JSON.stringify(selectedCategories);

    try {
      const response = await fetch(`${API_URL}/api/admin/learningpath/${id}`, {
        method: "PUT",
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
      setLearningPath((prevData) => ({...prevData, ...result.learningPath}));
      setIsEditModalOpen(false);
      showToast("Learning path updated successfully!", true);
    } catch (error) {
      showToast("Internal Server Error", false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading2(true);
    const formData = courseFormData;
    formData["categoryIds"] = JSON.stringify(selectedCategories2);
    formData["learningPathId"] = id;

    try {
      const response = await fetch(`${API_URL}/api/admin/learningpath/course/create`, {
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
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      showToast("Internal Server Error", false);
    } finally {
      setIsLoading2(false);
    }
  };

  const handleFormSubmitAdd = async (e) => {
    e.preventDefault();
    setIsLoading2(true);
    const formData = courseFormData;
    formData["categoryIds"] = JSON.stringify(selectedCategories2);
    formData["learningPathId"] = id;
    formData["courseId"] = acourse.value;
    try {
      const response = await fetch(`${API_URL}/api/admin/learningpath/course/add`, {
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
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      showToast("Internal Server Error", false);
    } finally {
      setIsLoading2(false);
    }
  };

  const handleFormSubmitInvite = async (e) => {
    e.preventDefault();
    setIsLoading2(true);
    const formData = courseFormData;
    formData["categoryIds"] = JSON.stringify(selectedCategories2);
    formData["learningPathId"] = id;
    formData["courseId"] = acourse.value;
    try {
      const response = await fetch(`${API_URL}/api/admin/learningpath/course/add`, {
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
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      showToast("Internal Server Error", false);
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <div>
      <div className="navHeader">
        <LecturerNavBar title="Content Management" subTitle="Learning Path" />
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
                      learningPath.image
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
                    {learningPath.lecturer === learningPath.userId && (
                      <button className="btn continueBtn" onClick={() => setIsEditModalOpen(true)}>
                        <span>Edit learning path</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mobileCourseHeader">
              <div className="mheaderContent">
                <div className="mheaderImageCon">
                  <img
                    src={
                      learningPath.image
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
                    {learningPath.lecturer === learningPath.userId && (
                      <button className="btn continueBtn" onClick={() => setIsEditModalOpen(true)}>
                        <span>Edit learning path</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="courseBody">
              <div className="courseBodyHeader">
                <button className="btn btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete Learning Path
                </button>
                <div className="d-flex gap-1">
                  {learningPath.lecturer === learningPath.userId && (
                    <button className="btn btn-theme" onClick={() => setIsModalInviteOpen(true)}>
                      Invite Student
                    </button>
                  )}
                  <button className="btn btn-theme" onClick={() => setIsModalAddOpen(true)}>
                    Add Course
                  </button>
                  <button className="btn btn-theme" onClick={() => setIsModalOpen(true)}>
                    Create Course
                  </button>
                </div>
              </div>

              {!learningPath ? (
                <div className="noObjects noObjects100 mt-4">Learning path not found</div>
              ) : learningPath.courses.length === 0 ? (
                <div className="noObjects noObjects100 mt-4">No Courses here</div>
              ) : (
                learningPath.courses.map((section, index) => (
                  <CourseCollapsible key={index} {...section} learnPathId={id} onMoveUp={moveUp} />
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="noObjects">Learning Path not Found!</div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <form id="learningPathForm" onSubmit={handleLearningPathSubmit}>
              <div className="mheader">
                <span>Edit Learning Path</span>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <div className="uploadImageCon MuploadImageCon">
                  <div className="image-preview-container">
                    <img
                      src={
                        learningPath.image
                          ? `${IMAGE_HOST}${learningPath.image}`
                          : "/images/course_default.png"
                      }
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
                    style={{display: "none"}}
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
                  styles={{container: (base) => ({...base, width: "100%"})}}
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

              <div className="modal-buttons w-100">
                <button type="submit" className="btn btn-theme">
                  {isLoading2 ? (
                    <div className="spinner-border text-light btnspinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isLoading2}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <form id="courseForm mt-1" onSubmit={handleFormSubmit}>
              <div className="mheader">
                <span>Create Course</span>
              </div>
              <div className="form-group">
                <label htmlFor="image">Image</label>
                <div className="uploadImageCon row">
                  <div className="image-preview-container">
                    <img
                      src={courseFormData.image || "/images/course_default.png"}
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
                    style={{display: "none"}}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
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
                    className="btn btn-theme mt-2"
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
                  styles={{container: (base) => ({...base, width: "100%"})}}
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

              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {isLoading2 ? (
                    <div className="spinner-border text-light btnspinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  disabled={isLoading2}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalInviteOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="mheader">
              <span>Invite student</span>
            </div>

            <div className="form-group">
              <div className="inviteCon">
                <div className="inviteSearchDiv">
                  <input value={invitedSearch} onChange={(e) => setInvitedSearch(e.target.value)} />
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <div className="form-group">
                  <label htmlFor="course-category" className="mt-3">
                    Invited Students
                  </label>
                  <div className="inviteSearch">
                    {filInvited &&
                      filInvited.map((ivstat, index) => (
                        <div className="unInvitedDiv">
                          <div className={`inviteDiv inviteDiv2  ${index !== 0 && "btop"}`}>
                            <p>
                              {ivstat.student.first_name} {ivstat.student.last_name}
                            </p>
                            {ivstat.status !== "accepted" ? (
                              <button
                                onClick={() => handleCancelInvite(ivstat)}
                                disabled={canInvitingIds.includes(ivstat.student.id)}
                              >
                                {canInvitingIds.includes(ivstat.student.id) ? (
                                  <span>
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                      style={{marginRight: "5px"}}
                                    ></span>
                                    Loading...
                                  </span>
                                ) : (
                                  <>
                                    Cancel invite <FontAwesomeIcon icon={faUserMinus} size="sm" />
                                  </>
                                )}{" "}
                              </button>
                            ) : (
                              <div>
                                <div className="comStatus">
                                  <p>
                                    {ivstat.status} <FontAwesomeIcon icon={faCircleCheck} />
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          {ivstat.status !== "accepted" && (
                            <p>
                              {ivstat.status} - Due{" "}
                              {ivstat.dueDate ? (
                                <>
                                  {new Date(ivstat.dueDate).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                  {new Date(ivstat.dueDate) < new Date() && (
                                    <span style={{color: "red", marginLeft: 6}}>(past)</span>
                                  )}
                                </>
                              ) : (
                                "N/A"
                              )}
                            </p>
                          )}
                        </div>
                      ))}

                    {!isLoading3 &&
                      filInvited.length === 0 &&
                      (invitedSearch ? (
                        <p>No results found</p>
                      ) : (
                        <p>Search by email or full name </p>
                      ))}

                    {isLoading3 && <p>Loading...</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="course-category">Not Invited</label>
              <div className="inviteCon">
                <label htmlFor="invite-due-date" className="dueLabel">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  id="invite-due-date"
                  className="form-control"
                  value={
                    inviteDueDate ||
                    (() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      d.setSeconds(0, 0);
                      return d.toISOString().slice(0, 16);
                    })()
                  }
                  onChange={(e) => setInviteDueDate(e.target.value)}
                  min={(() => {
                    const d = new Date();
                    d.setSeconds(0, 0);
                    return d.toISOString().slice(0, 16);
                  })()}
                />

                <div className="inviteSearch">
                  {filNotInvited &&
                    filNotInvited.map((ivstat, index) => (
                      <div className={`inviteDiv  ${index !== 0 && "btop"}`}>
                        <p>
                          {ivstat.student.first_name} {ivstat.student.last_name}
                        </p>
                        <button
                          onClick={() => handleInvite(ivstat)}
                          disabled={invitingIds.includes(ivstat.student.id)}
                        >
                          {invitingIds.includes(ivstat.student.id) ? (
                            <span>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                                style={{marginRight: "5px"}}
                              ></span>
                              Inviting...
                            </span>
                          ) : (
                            <>
                              invite <FontAwesomeIcon icon={faUserPlus} size="sm" />
                            </>
                          )}{" "}
                        </button>
                      </div>
                    ))}

                  {!isLoading3 &&
                    filNotInvited.length === 0 &&
                    (invitedSearch ? (
                      <p>No results found</p>
                    ) : (
                      <p>Search by email or full name </p>
                    ))}

                  {isLoading3 && <p>Loading...</p>}
                </div>
              </div>
            </div>

            <div className="modal-buttons">
              <div></div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsModalInviteOpen(false);
                }}
                disabled={isLoading2}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalAddOpen && (
        <div className="modal">
          <div className="modal-content">
            <form id="courseForm mt-1" onSubmit={handleFormSubmitAdd}>
              <div className="mheader">
                <span>Add Course</span>
              </div>

              <div className="form-group">
                <label htmlFor="course-category">Select Course</label>
                <Select
                  isSearchable
                  value={acourse ? acourse : ""}
                  onChange={(selectedOption) => setAcourse(selectedOption)}
                  options={acourses.map((acourse) => ({
                    value: acourse.id,
                    label: acourse.title
                  }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  id="course-category"
                  styles={{container: (base) => ({...base, width: "100%"})}}
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {isLoading2 ? (
                    <div className="spinner-border text-light btnspinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsModalAddOpen(false);
                  }}
                  disabled={isLoading2}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="mheader mheaderred">
              <h3>Delete Learning Path</h3>
            </div>

            <div className="modal-body text-center">
              <h4>Are you sure you want to delete this learning path?</h4>
              <span>
                Note: this will also delete all course not displayed outside this learning path and
                not linked to other learning paths
              </span>
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-secondary px-5"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                }}
                disabled={isLoading2}
              >
                No
              </button>
              <button className="btn btn-danger px-5" onClick={deleteLearningPath}>
                {isLoading2 ? (
                  <div className="spinner-border text-light btnspinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Yes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerLearnPath;

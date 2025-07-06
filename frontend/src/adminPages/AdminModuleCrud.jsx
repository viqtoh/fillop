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
import { useParams } from "react-router-dom";

const AdminModuleCrud = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { moduleId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [course, setCourse] = useState(null);
  const [contentType, setContentType] = useState("");
  const [iniContentType, setIniContentType] = useState("");
  const [showFile, setShowFile] = useState(true);

  const [method, setMethod] = useState("");

  const [file, setFile] = useState("");

  const customStyles = {
    container: (base) => ({
      ...base,
      width: "100%"
    }),
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "#dfdfdf",
      color: "#000",
      borderRadius: "8px",
      fontSize: "12px",
      boxShadow: "none",
      height: "42px",
      width: "100%",

      "&:hover": { borderColor: "#8c8c8c", backgroundColor: "#eaeaea" }
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#333"
    }),
    option: (base, { isFocused, isSelected }) => ({
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

  const typeOptions = [
    { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" },
    { value: "ppt", label: "PPT" },
    { value: "docx", label: "DOCX" },
    { value: "assessment", label: "Assessment" }
  ];

  const uploadOptions = [
    { value: "", label: "Method of Upload" },
    { value: "link", label: "Link to Content" },
    { value: "file", label: "Upload File from local" }
  ];

  useEffect(() => {
    setIsLoading(true);
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/course-full/${id}`, {
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
        for (let i = 0; i < data.modules.length; i++) {
          if (data.modules[i].id === parseInt(moduleId)) {
            setModuleFormData(data.modules[i]);
            setIniContentType(data.modules[i].content_type);
            const matchedOption = typeOptions.find(
              (opt) => opt.value === data.modules[i].content_type
            );
            if (data.modules[i].file) {
              setFile(data.modules[i].file);
            }
            setContentType(matchedOption || null);
            if (data.modules[i].content_type === "video") {
              if (!data.modules[i].content_url) {
                setMethod("file");
              } else {
                setMethod("link");
              }
            }
          }
        }
      } catch (err) {
        showToast(err.message, false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]);

  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: "",
    content_type: "",
    content_url: "",
    duration: "",
    file: "",
    is_published: true
  });

  const fileInputRef = useRef(null);

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleContentChange = (e) => {
    const matchedOption = typeOptions.find((opt) => opt.value === e.value);
    if (e.value !== iniContentType) {
      setShowFile(false);
    } else {
      setShowFile(true);
    }
    setContentType(matchedOption || null);
    setModuleFormData((prevData) => ({
      ...prevData,
      content_type: e.value
    }));
    setMethod("");
    clearFile();
  };

  const handleUploadOption = (e) => {
    setMethod(e.value);
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_published") {
      let val = false;
      if (e.target.checked) {
        val = true;
      }
      setModuleFormData((prevData) => ({
        ...prevData,
        [name]: val
      }));
    } else {
      setModuleFormData((prevData) => ({
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

  const handleModuleSubmit = async (e) => {
    e.preventDefault();

    const formData = moduleFormData;
    let response;
    setIsLoading(true);

    try {
      if (moduleId) {
        response = await fetch(`${API_URL}/api/admin/course/${course.id}/module/${moduleId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`${API_URL}/api/admin/course/${course.id}/module`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (moduleId) {
          showToast(errorData.error || "Error updating Module", false);
        } else {
          showToast(errorData.error || "Error creating Module", false);
        }
        return;
      }

      const result = await response.json();
      if (moduleId) {
        showToast("Module updated successfully!", true);
      } else {
        showToast("Module created successfully!", true);
      }

      window.location.href = `/admin/content-management/course/${id}`;
    } catch (error) {
      showToast("Internal Server Error", false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar
          title="Content Management"
          subTitle={`course/module/${moduleId ? "edit" : "create"}`}
        />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <div className="tab-container h-100">
              <h2 className="tab-title">{moduleId ? "Edit" : "Create"} Module</h2>
              <div className="tab-content">
                <div className="course-tab">
                  <form id="courseForm" onSubmit={handleModuleSubmit}>
                    <div className="form-group">
                      <label htmlFor="course-title">Module Title</label>
                      <input
                        type="text"
                        id="course-title"
                        className="form-control"
                        name="title"
                        placeholder="Enter module title"
                        value={moduleFormData.title}
                        onChange={handleModuleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course-title">Module Description</label>

                      <textarea
                        className="form-control"
                        name="description"
                        value={moduleFormData.description}
                        onChange={handleModuleChange}
                        placeholder="Enter module description"
                      ></textarea>
                    </div>
                    <div className="row mx-0 w-100">
                      <div className="col-md-6 ps-0 pe-md-2 px-sm-0">
                        <div className="form-group">
                          <label htmlFor="content_type">Module Type</label>
                          <Select
                            id="content_type"
                            styles={customStyles}
                            options={typeOptions}
                            placeholder={"Select Type"}
                            onChange={handleContentChange}
                            value={contentType}
                            name="content_type"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 pe-0 ps-md-2 px-sm-0">
                        {moduleFormData.content_type === "video" ? (
                          <div className="form-group">
                            <label htmlFor="course-title">Method of Upload</label>
                            <Select
                              styles={customStyles}
                              options={uploadOptions}
                              placeholder={"Method of Upload"}
                              onChange={handleUploadOption}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="row mx-0 w-100">
                      {(moduleFormData.content_type &&
                        moduleFormData.content_type === "video" &&
                        method === "file") ||
                      (moduleFormData.content_type &&
                        moduleFormData.content_type !== "video" &&
                        moduleFormData.content_type !== "assessment" &&
                        moduleFormData.content_type !== "text") ? (
                        <div className="col-md-6 ps-0 pe-md-2 px-sm-0">
                          <div className="form-group">
                            <label htmlFor="module-file">
                              {file !== "" ? "Change" : "Upload"} File
                            </label>
                            {file !== "" && showFile && <p className="text-success m-0">{file}</p>}
                            <input
                              type="file"
                              id="module-file"
                              ref={fileInputRef}
                              className="form-control"
                              name="file"
                              accept={
                                moduleFormData.content_type === "pdf"
                                  ? ".pdf"
                                  : moduleFormData.content_type === "video"
                                    ? "video/*"
                                    : moduleFormData.content_type === "ppt"
                                      ? ".ppt,.pptx"
                                      : moduleFormData.content_type === "docx"
                                        ? ".doc,.docx"
                                        : ""
                              }
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // 100MB = 104857600 bytes
                                  if (file.size > 104857600) {
                                    showToast("File size must be less than 100MB", false);
                                    clearFile();
                                    return;
                                  }
                                  const reader = new FileReader();

                                  reader.onload = () => {
                                    setModuleFormData((prevData) => ({
                                      ...prevData,
                                      file: reader.result // base64 string or data URL
                                    }));
                                  };

                                  // Choose appropriate read method
                                  if (
                                    moduleFormData.content_type === "pdf" ||
                                    moduleFormData.content_type === "ppt" ||
                                    moduleFormData.content_type === "docx"
                                  ) {
                                    reader.readAsDataURL(file); // base64
                                  } else if (moduleFormData.content_type === "video") {
                                    reader.readAsDataURL(file); // also works for video preview
                                  } else {
                                    reader.readAsText(file); // fallback
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      ) : moduleFormData.content_type &&
                        moduleFormData.content_type === "video" &&
                        method === "link" ? (
                        <div className="col-md-12 px-0">
                          <div className="form-group">
                            <label htmlFor="module-link">Link to File</label>
                            <input
                              type="text"
                              id="module-link"
                              className="form-control"
                              name="content_url"
                              value={moduleFormData.link}
                              placeholder=""
                              onChange={handleModuleChange}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {moduleFormData.content_type === "video" && (
                      <div className="col-md-6 ps-0 pe-md-2 px-sm-0">
                        <div className="form-group">
                          <label htmlFor="module-duration">Duration (mins)</label>
                          <input
                            type="number"
                            id="module-duration"
                            className="form-control"
                            name="duration"
                            onChange={handleModuleChange}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="cis_published">Publish</label>
                      <input
                        type="checkbox"
                        id="cis_published"
                        name="is_published"
                        className="form-check-input"
                        checked={moduleFormData.is_published}
                        onChange={handleModuleChange}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? "Saving..." : moduleId ? "Update Module" : "Create Module"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModuleCrud;

import React, {useState, useEffect, useCallback} from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import {API_URL, IMAGE_HOST} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Toast from "../components/Toast";
import {
  faSearch,
  faAngleUp,
  faSortAlphaAsc,
  faSortAlphaDesc,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // The default theme stylesheet

const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ServiceManagement = () => {
  const token = localStorage.getItem("token");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [fisLoading, setFisLoading] = useState(false); // Used for form submission loading
  const [isReloading, setIsReloading] = useState(false); // Used for table data loading

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState("false"); // "true" or "false" string for URL param
  const [reload, setReload] = useState(false); // Trigger for re-fetching data

  // Toast notification states
  const [isSuccess, setIsSuccess] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // For edit/disable/delete modals
  const [totalServices, setTotalServices] = useState(0);

  // Modals visibility states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // <--- NEW STATE FOR DELETE MODAL

  // Form data states
  const [editFormData, setEditFormData] = useState({
    title: "",
    fullDescription: "",
    imageUrl: "",
    targetClients: "",
    competitiveAdvantage: "",
    visitLink: "",
    removeImage: false
  });
  const [editError, setEditError] = useState("");

  const [addFormData, setAddFormData] = useState({
    title: "",
    fullDescription: "",
    imageUrl: "",
    targetClients: "",
    competitiveAdvantage: "",
    visitLink: ""
  });
  const [addError, setAddError] = useState("");

  const quillRef = React.useRef(null);
  const quillRef2 = React.useRef(null);

  // --- useEffect for fetching services ---
  useEffect(() => {
    setIsReloading(true); // Indicate table is reloading
    setServices([]); // Clear previous data
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/admin/services?page=${page}&limit=9&search=${search}&sort=${sort}&order=${order}&include_inactive=${includeInactive}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await response.json();

        if (response.ok) {
          setServices(data.results);
          setLastPage(data.total_pages);
          setTotalServices(data.total_services);
        } else {
          showToast(data.error || "Failed to fetch services", false);
        }
      } catch (error) {
        showToast("Failed to fetch services. Network error.", false);
        console.error("Fetch services error:", error);
      } finally {
        setIsLoading(false); // Initial load complete
        setIsReloading(false); // Reload complete
      }
    };

    fetchServices();
  }, [token, showToast, page, sort, order, search, includeInactive, reload]); // Dependencies

  // --- Helper Functions ---

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    let date = new Date(dateString).toLocaleDateString(undefined, options);
    if (date === "Invalid Date") {
      return "--";
    } else {
      return date;
    }
  };

  const toggleSortOrder = (field) => {
    if (sort === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(field);
      setOrder("asc"); // Default to asc when changing sort field
    }
    setPage(1); // Reset to first page on sort change
  };

  // --- Form Handlers ---

  const handleAddChange = (e) => {
    const {name, value} = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditChange = (e) => {
    const {name, value} = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- API Call Functions ---

  const handleAddService = async (e) => {
    e.preventDefault();
    setFisLoading(true); // Start form loading

    try {
      const response = await fetch(`${API_URL}/api/admin/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(addFormData)
      });
      const data = await response.json();

      if (response.ok) {
        showToast("Service added successfully!");
        setIsAddModalOpen(false); // Close modal
        setAddError("");
        setReload(!reload);
        setAddFormData({
          // Reset form
          title: "",
          fullDescription: "",
          imageUrl: "",
          targetClients: "",
          competitiveAdvantage: "",
          visitLink: ""
        });
      } else {
        setAddError(data.error || "Failed to add service.");
      }
    } catch (error) {
      setAddError("Failed to add service. Network error.");
      console.error("Add service error:", error);
    } finally {
      setFisLoading(false); // End form loading
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setFisLoading(true); // Start form loading

    if (!selectedService) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/services/${selectedService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();

      if (response.ok) {
        showToast("Service updated successfully!");
        setIsEditModalOpen(false);
        setEditError("");
        setReload(!reload);
      } else {
        if (data.error === "Invalid token") {
          // Corrected comparison operator
          window.location.reload();
        }
        setEditError(data.error || "Failed to update service.");
      }
    } catch (error) {
      setEditError("Failed to update service. Network error.");
      console.error("Edit service error:", error);
    } finally {
      setFisLoading(false);
    }
  };

  const handleToggleServiceActiveStatus = async () => {
    if (!selectedService) return;

    setFisLoading(true); // Start form loading
    try {
      const response = await fetch(`${API_URL}/api/admin/services/${selectedService.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({isActive: !selectedService.is_active}) // Toggle status
      });
      const data = await response.json();

      if (response.ok) {
        showToast(`Service ${selectedService.is_active ? "disabled" : "enabled"} successfully!`);
        setReload(!reload); // Trigger data reload
      } else {
        showToast(data.error || "Failed to update service status.", false);
      }
    } catch (error) {
      showToast("Failed to update service status. Network error.", false);
      console.error("Toggle service status error:", error);
    } finally {
      setFisLoading(false);
      setIsToggleActiveModalOpen(false); // Close modal
    }
  };

  // <--- MODIFIED handleDeleteService and its call in the table ---
  const handleDeleteService = async () => {
    if (!selectedService) return;

    setFisLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/services/${selectedService.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        // 204 No Content for successful deletion
        showToast("Service deleted successfully!");
        setReload(!reload);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete service.", false);
      }
    } catch (error) {
      showToast("Failed to delete service. Network error.", false);
      console.error("Delete service error:", error);
    } finally {
      setFisLoading(false);
      setIsDeleteConfirmModalOpen(false); // <--- Close the delete confirmation modal
      setSelectedService(null); // Clear selected service after action
    }
  };

  // --- React-Quill specific setup (Original implementation, not altered) ---
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file); // 'file' is the expected field name on the backend

        try {
          // Use the same image upload endpoint as before (or a dedicated one for editor images)
          const response = await fetch(`${API_URL}/api/admin/upload-service-image`, {
            // Ensure this URL matches your backend
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload image.");
          }

          const data = await response.json();
          const imageUrl = `${IMAGE_HOST}${data.location}`; // Construct the full URL

          // Get the current Quill instance
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();

          // Insert the image at the current cursor position
          editor.insertEmbed(range.index, "image", imageUrl);
          // Move cursor to the end of the inserted image
          editor.setSelection(range.index + 1);

          showToast("Image uploaded successfully!");
        } catch (error) {
          console.error("Quill Image upload failed:", error);
          showToast("Image upload failed: " + error.message, false);
        }
      }
    };
  }, [token, showToast]); // Re-create if token or showToast changes

  const imageHandler2 = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file); // 'file' is the expected field name on the backend

        try {
          // Use the same image upload endpoint as before (or a dedicated one for editor images)
          const response = await fetch(`${API_URL}/api/admin/upload-service-image`, {
            // Ensure this URL matches your backend
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to upload image.");
          }

          const data = await response.json();
          const imageUrl = `${IMAGE_HOST}${data.location}`; // Construct the full URL

          // Get the current Quill instance
          const editor = quillRef2.current.getEditor();
          const range = editor.getSelection();

          // Insert the image at the current cursor position
          editor.insertEmbed(range.index, "image", imageUrl);
          // Move cursor to the end of the inserted image
          editor.setSelection(range.index + 1);

          showToast("Image uploaded successfully!");
        } catch (error) {
          console.error("Quill Image upload failed:", error);
          showToast("Image upload failed: " + error.message, false);
        }
      }
    };
  }, [token, showToast]); // Re-create if token or showToast changes

  const quillModules = React.useMemo(
    () => ({
      toolbar: {
        container: [
          [{header: "1"}, {header: "2"}, {font: []}],
          [{size: []}],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
          ["link", "image", "video"], // 'video' optional if you want to allow videos
          ["clean"]
        ],
        handlers: {
          image: imageHandler // Assign our custom image handler
        }
      },
      clipboard: {
        matchVisual: false
      }
    }),
    [imageHandler]
  ); // Re-create if imageHandler changes

  const quillModules2 = React.useMemo(
    () => ({
      toolbar: {
        container: [
          [{header: "1"}, {header: "2"}, {font: []}],
          [{size: []}],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
          ["link", "image", "video"], // 'video' optional if you want to allow videos
          ["clean"]
        ],
        handlers: {
          image: imageHandler2 // Assign our custom image handler
        }
      },
      clipboard: {
        matchVisual: false
      }
    }),
    [imageHandler2] // Changed dependency from imageHandler to imageHandler2 for clarity
  );

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video"
  ];

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title="Service Management" context="Add and Manage all services here." />
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
                  subBody.scrollTo({top: 0, behavior: "smooth"});
                }
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} />
            </button>
            <div className="userSearchContainer">
              <div className="totalUserCon">
                <span>All Services</span>
                <span className="ms-1 uTotal">{totalServices}</span>
              </div>
              <div className="searchBarContainerCon d-block">
                <div className="searchBarContainer">
                  <FontAwesomeIcon
                    icon={faSearch}
                    onClick={() => {
                      const searchInput = document.querySelector(".searchBar2");
                      if (searchInput) {
                        setSearch(searchInput.value);
                        setPage(1); // Reset page on new search
                      }
                    }}
                    style={{cursor: "pointer"}}
                  />
                  <input
                    type="text"
                    className="searchBar2"
                    placeholder="Search services by title or description"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(e.target.value);
                        setPage(1); // Reset page on new search
                      }
                    }}
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center relate">
                    <label className="me-2">Show Inactive:</label>
                    <input
                      type="checkbox"
                      checked={includeInactive === "true"}
                      onChange={(e) => {
                        setIncludeInactive(e.target.checked ? "true" : "false");
                        setPage(1); // Reset page when changing filter
                      }}
                      className="form-check-input me-3"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(true);
                    }}
                    className="btn btn-theme "
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>

            <div className="searchBody2">
              <div className="contentTable nobar">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th
                        className="text-start"
                        onClick={() => toggleSortOrder("title")}
                        style={{cursor: "pointer"}}
                      >
                        Title
                        {sort === "title" && (
                          <FontAwesomeIcon
                            icon={order === "asc" ? faSortAlphaAsc : faSortAlphaDesc}
                          />
                        )}
                      </th>
                      <th>Full Description</th>
                      <th>Target Clients</th>
                      <th>Competitive Advantage</th>
                      <th>Visit Link</th>
                      <th onClick={() => toggleSortOrder("isActive")} style={{cursor: "pointer"}}>
                        Status
                        {sort === "isActive" && (
                          <FontAwesomeIcon
                            icon={order === "asc" ? faSortAlphaAsc : faSortAlphaDesc}
                          />
                        )}
                      </th>
                      <th
                        onClick={() => toggleSortOrder("createdAt")}
                        style={{cursor: "pointer", minWidth: "110px"}}
                      >
                        Date Added
                        {sort === "createdAt" && (
                          <FontAwesomeIcon
                            icon={order === "asc" ? faSortAlphaAsc : faSortAlphaDesc}
                          />
                        )}
                      </th>
                      <th style={{minWidth: "120px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isReloading && (
                      <tr>
                        <td colSpan={9}>
                          <div className="d-flex justify-content-center align-items-center tableLoader">
                            <div className="loader"></div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!isReloading && services.length === 0 && (
                      <tr>
                        <td colSpan={9}>
                          <div className="d-flex justify-content-center align-items-center tableLoader">
                            No Services to display
                          </div>
                        </td>
                      </tr>
                    )}

                    {!isReloading &&
                      services.map((service, index) => (
                        <tr key={index}>
                          <td>
                            {service.image_url ? (
                              <div className="adminProfileImage mx-2 s-35">
                                <img
                                  src={`${IMAGE_HOST}${service.image_url}`}
                                  className="s-31"
                                  alt="Service"
                                />
                              </div>
                            ) : (
                              <div className="adminProfileImage mx-2 s-35">
                                <img
                                  src="/images/default_service.png"
                                  className="s-31"
                                  alt="Service"
                                />
                              </div>
                            )}
                          </td>
                          <td className="text-start">{service.title}</td>
                          <td>
                            {service.full_description
                              ? stripHtml(service.full_description).substring(0, 70) + "..."
                              : "--"}
                          </td>
                          <td>
                            {service.target_clients
                              ? `${service.target_clients.substring(0, 50)}...`
                              : "--"}
                          </td>
                          <td>
                            {service.competitive_advantage
                              ? `${service.competitive_advantage.substring(0, 50)}...`
                              : "--"}
                          </td>
                          <td>
                            {service.visit_link ? (
                              <a
                                href={service.visit_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Link
                              </a>
                            ) : (
                              "--"
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${service.is_active ? "bg-success" : "bg-danger"}`}
                            >
                              {service.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{formatDate(service.createdAt)}</td>{" "}
                          {/* Assuming createdAt from API */}
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-secondary btn-sm dropdown-toggle"
                                type="button"
                                id={`dropdownMenuButton-${index}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Actions
                              </button>
                              <ul
                                className="dropdown-menu"
                                aria-labelledby={`dropdownMenuButton-${index}`}
                              >
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      setSelectedService(service);
                                      // Populate edit form with current service data
                                      setEditFormData({
                                        title: service.title,
                                        fullDescription: service.full_description,
                                        imageUrl: service.image_url,
                                        targetClients: service.target_clients,
                                        competitiveAdvantage: service.competitive_advantage,
                                        visitLink: service.visit_link,
                                        removeImage: false
                                      });
                                      setIsEditModalOpen(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setIsToggleActiveModalOpen(true);
                                    }}
                                  >
                                    {service.is_active ? "Mark Inactive" : "Mark Active"}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setSelectedService(service);
                                      setIsDeleteConfirmModalOpen(true); // <--- OPEN DELETE CONFIRMATION MODAL
                                    }}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!isReloading && services.length !== 0 && (
                <div className="pagination-container">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({length: lastPage}, (_, i) => i + 1).map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-item ${page === pageNumber ? "active" : ""}`}
                        >
                          <button className="page-link" onClick={() => setPage(pageNumber)}>
                            {pageNumber}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Add New Service</h5>
            <form onSubmit={handleAddService}>
              <div className="form-group d-flex align-items-end mb-4">
                <div className="adminProfileImage me-2 s-125">
                  <img
                    src={addFormData.imageUrl || "/images/default_service.png"}
                    className="s-121"
                    id="addServiceImagePreview"
                    alt="Service Preview"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        document.getElementById("addServiceImagePreview").src = event.target.result;
                        setAddFormData((prevData) => ({
                          ...prevData,
                          imageUrl: event.target.result // This will be the new base64 for preview
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="form-control ms-2"
                  style={{display: "none"}}
                  id="addHiddenFileInput"
                />
                <button
                  type="button"
                  className="btn btn-theme ms-2"
                  onClick={() => document.getElementById("addHiddenFileInput").click()}
                >
                  Upload Image
                </button>
                {addFormData.imageUrl && ( // Only show if an image is currently set
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setAddFormData((prevData) => ({...prevData, imageUrl: ""}));
                      document.getElementById("addServiceImagePreview").src =
                        "/images/default_service.png"; // Reset preview image
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {addError !== "" ? (
                <div className="formErrorDiv">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p className="formError">{addError}</p>
                </div>
              ) : null}
              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={addFormData.title}
                  onChange={handleAddChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Description</label>
                <ReactQuill
                  ref={quillRef} // Assign ref to access editor instance
                  theme="snow"
                  value={addFormData.fullDescription}
                  onChange={(value) => setAddFormData({...addFormData, fullDescription: value})}
                  modules={quillModules}
                  formats={quillFormats}
                  // Optional: placeholder text
                  placeholder="Write your full description here..."
                />
              </div>
              <div className="form-group">
                <label>Target Clients</label>
                <textarea
                  name="targetClients"
                  value={addFormData.targetClients}
                  onChange={handleAddChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Competitive Advantage</label>
                <textarea
                  name="competitiveAdvantage"
                  value={addFormData.competitiveAdvantage}
                  onChange={handleAddChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Visit Link (URL)</label>
                <input
                  type="url"
                  name="visitLink"
                  value={addFormData.visitLink}
                  onChange={handleAddChange}
                  className="form-control"
                  placeholder="e.g., https://example.com/service"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {fisLoading ? (
                    <div className="spinner-border text-light btnspinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Add Service"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddError("");
                    setAddFormData({
                      // Reset form data on cancel
                      title: "",
                      fullDescription: "",
                      imageUrl: "",
                      targetClients: "",
                      competitiveAdvantage: "",
                      visitLink: ""
                    });
                  }}
                  disabled={fisLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isEditModalOpen && selectedService && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Edit Service</h5>
            <form onSubmit={handleEditService}>
              <div className="form-group d-flex align-items-end mb-4">
                <div className="adminProfileImage me-2 s-125">
                  <img
                    src={
                      editFormData.imageUrl
                        ? editFormData.imageUrl.startsWith("/media") // Check if it's a server path or base64
                          ? IMAGE_HOST + editFormData.imageUrl
                          : editFormData.imageUrl // If not a server path, assume it's a base64 from new upload
                        : "/images/default_service.png"
                    }
                    className="s-121"
                    id="editServiceImagePreview"
                    alt="Service Preview"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        document.getElementById("editServiceImagePreview").src =
                          event.target.result;
                        setEditFormData((prevData) => ({
                          ...prevData,
                          imageUrl: event.target.result, // This will be the new base64 for preview
                          removeImage: false // IF NEW IMAGE IS UPLOADED, CLEAR REMOVE FLAG
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="form-control ms-2"
                  style={{display: "none"}}
                  id="editHiddenFileInput"
                />
                <button
                  type="button"
                  className="btn btn-theme ms-2"
                  onClick={() => document.getElementById("editHiddenFileInput").click()}
                >
                  Upload Image
                </button>
                {editFormData.imageUrl && ( // Only show if an image is currently set
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => {
                      setEditFormData((prevData) => ({
                        ...prevData,
                        imageUrl: "", // Clear the image URL
                        removeImage: true // SET REMOVE FLAG TO TRUE
                      }));
                      document.getElementById("editServiceImagePreview").src =
                        "/images/default_service.png"; // Reset preview image
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {editError !== "" ? (
                <div className="formErrorDiv">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p className="formError">{editError}</p>
                </div>
              ) : null}
              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Description</label>
                <ReactQuill
                  ref={quillRef2} // Assign ref to access editor instance
                  theme="snow"
                  value={editFormData.fullDescription}
                  onChange={(value) => setEditFormData({...editFormData, fullDescription: value})}
                  modules={quillModules2}
                  formats={quillFormats}
                  // Optional: placeholder text
                  placeholder="Write your full description here..."
                />
              </div>
              <div className="form-group">
                <label>Target Clients</label>
                <textarea
                  name="targetClients"
                  value={editFormData.targetClients}
                  onChange={handleEditChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Competitive Advantage</label>
                <textarea
                  name="competitiveAdvantage"
                  value={editFormData.competitiveAdvantage}
                  onChange={handleEditChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Visit Link (URL)</label>
                <input
                  type="url"
                  name="visitLink"
                  value={editFormData.visitLink}
                  onChange={handleEditChange}
                  className="form-control"
                  placeholder="e.g., https://example.com/service"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {fisLoading ? (
                    <div className="spinner-border text-light btnspinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditError("");
                  }}
                  disabled={fisLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Active Status Modal */}
      {isToggleActiveModalOpen && selectedService && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>{selectedService.is_active ? "Mark Service Inactive" : "Mark Service Active"}</h5>

            <div className="">
              <span className="disableText">
                Are you sure you want to{" "}
                <span className={selectedService.is_active ? "text-danger" : "text-success"}>
                  {selectedService.is_active ? "mark inactive" : "mark active"}
                </span>{" "}
                the service "<span className="fw-bold">{selectedService.title}</span>"?
              </span>
            </div>
            <div className="modal-buttons">
              <button
                type="submit"
                className={`btn btn-theme2 ${
                  selectedService.is_active ? "btn-danger" : "btn-success"
                }`}
                onClick={handleToggleServiceActiveStatus}
              >
                {fisLoading ? (
                  <div className="spinner-border text-light btnspinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : selectedService.is_active ? (
                  "Mark Inactive"
                ) : (
                  "Mark Active"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsToggleActiveModalOpen(false);
                  setSelectedService(null); // Clear selected service on cancel
                }}
                disabled={fisLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <--- NEW Delete Confirmation Modal --- > */}
      {isDeleteConfirmModalOpen && selectedService && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Confirm Deletion</h5>

            <div className="mb-3">
              <span className="disableText">
                Are you sure you want to permanently{" "}
                <span className="text-danger fw-bold">delete</span> the service "
                <span className="fw-bold">{selectedService.title}</span>"? This action cannot be
                undone.
              </span>
            </div>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteService}
                disabled={fisLoading}
              >
                {fisLoading ? (
                  <div className="spinner-border text-light btnspinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Delete Permanently"
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDeleteConfirmModalOpen(false);
                  setSelectedService(null); // Clear selected service on cancel
                }}
                disabled={fisLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;

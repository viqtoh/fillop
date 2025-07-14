import React, {useState, useEffect, useRef, useCallback} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faSearch,
  faAngleUp,
  faSortAlphaAsc,
  faSortAlphaDesc
} from "@fortawesome/free-solid-svg-icons";

import {API_URL, IMAGE_HOST} from "../constants";
import AdminNavBar from "../components/AdminNavBar";
import Toast from "../components/Toast";

import "../styles/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-bootstrap";

const AddUserModal = ({isOpen, onClose, onSuccess, token}) => {
  const modalContentRef = useRef(null);

  const [addFormData, setAddFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    image: "",
    password: "",
    confirm_password: "",
    qualification: "",
    field: "",
    institute: "",
    specialization: ""
  });
  const [addError, setAddError] = useState("");
  const [addActiveTab, setAddActiveTab] = useState("student"); // Local state for this modal
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirmPassword, setShowAddConfirmPassword] = useState(false);
  const [fisLoading, setFisLoading] = useState(false); // Local loading state for submission

  // Reset form when modal opens
  useEffect(() => {
    // Changed React.useEffect to useEffect directly
    if (isOpen) {
      setAddFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        image: "",
        password: "",
        confirm_password: "",
        qualification: "",
        field: "",
        institute: "",
        specialization: ""
      });
      setAddActiveTab("student");
      setAddError("");
      setShowAddPassword(false);
      setShowAddConfirmPassword(false);
      setFisLoading(false);
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const handleAddChange = (e) => {
    setAddFormData((prevData) => ({...prevData, [e.target.name]: e.target.value}));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Important: Ensure the img element with id "addimage" exists
        // This is a DOM manipulation, which is usually avoided in React
        // Prefer using a ref for the img element if possible, or pass the image data directly.
        // For now, keeping as is, but be aware of potential issues if not careful.
        const imgElement = document.getElementById("addimage");
        if (imgElement) {
          imgElement.src = event.target.result;
        }
        setAddFormData((prevData) => ({
          ...prevData,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFisLoading(true);
    setAddError(""); // Clear previous errors

    const {
      email,
      first_name,
      last_name,
      password,
      confirm_password,
      phone,
      address,
      postal_code,
      city,
      qualification,
      field,
      institute,
      specialization,
      country,
      image
    } = addFormData;

    // Basic validation
    if (!email || !first_name || !last_name || !password || !confirm_password || !qualification) {
      setAddError(
        "Email, First Name, Last Name, Password, and Educational Qualification are required."
      );
      setFisLoading(false);
      return;
    }

    if (password !== confirm_password) {
      setAddError("Passwords do not match!");
      setFisLoading(false);
      return;
    }

    if (password.length < 8) {
      setAddError("Password must be at least 8 characters long!");
      setFisLoading(false);
      return;
    }

    // Specific field validation based on tab
    if (addActiveTab === "student" && !field) {
      setAddError("Field of Study is required for students!");
      setFisLoading(false);
      return;
    }
    if (addActiveTab === "lecturer" && (!institute || !specialization)) {
      setAddError("Institute and Specialization are required for lecturers!");
      setFisLoading(false);
      return;
    }

    const payload = {
      type: addActiveTab,
      email,
      first_name,
      last_name,
      password,
      phone,
      address,
      postal_code: postal_code,
      city,
      qualification,
      isLecturer: addActiveTab === "lecturer",
      ...(addActiveTab === "student" ? {field} : {institute, specialization}),
      country,
      image
    };

    try {
      const response = await fetch(`${API_URL}/api/admin/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) {
        setAddError(data.error);
      } else {
        onSuccess("User added successfully");
        onClose(); // Close modal on success
      }
    } catch (error) {
      setAddError("Failed to add user. Server error.");
    } finally {
      setFisLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <h5>Add User</h5>
        <form onSubmit={handleAddSubmit}>
          <div className="form-group d-flex align-items-end mb-4">
            <div className="profileImage me-2 s-125">
              <img
                src={addFormData.image || "/images/default_profile.png"}
                className="s-125"
                id="addimage" // Ensure this ID is unique across all potential modals if they can be open at same time (unlikely for this app)
                alt="Profile"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              className="form-control ms-2"
              style={{display: "none"}}
              id="hiddenFileInput" // Ensure this ID is unique
            />
            <button
              type="button"
              className="btn btn-theme ms-2"
              onClick={() => document.getElementById("hiddenFileInput").click()}
            >
              Upload Image
            </button>
          </div>
          {addError !== "" ? (
            <div className="formErrorDiv">
              <FontAwesomeIcon icon={faInfoCircle} />
              <p className="formError">{addError}</p>
            </div>
          ) : null}

          <div className="nav nav-tabs mb-3">
            <button
              type="button"
              className={`nav-link tabbtn ${addActiveTab === "student" ? "active" : ""}`}
              onClick={() => setAddActiveTab("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`nav-link tabbtn ${addActiveTab === "lecturer" ? "active" : ""}`}
              onClick={() => setAddActiveTab("lecturer")}
            >
              Lecturer
            </button>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={addFormData.email}
              className="form-control"
              onChange={handleAddChange}
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={addFormData.first_name}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={addFormData.last_name}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={addFormData.phone}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={addFormData.address}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>City/State</label>
            <input
              type="text"
              name="city"
              value={addFormData.city}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={addFormData.country}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={addFormData.postal_code}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Educational Qualification</label>
            <input
              type="text"
              name="qualification"
              value={addFormData.qualification}
              onChange={handleAddChange}
              className="form-control"
            />
          </div>

          {addActiveTab === "student" && (
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                name="field"
                value={addFormData.field}
                onChange={handleAddChange}
                className="form-control"
              />
            </div>
          )}
          {addActiveTab === "lecturer" && (
            <>
              <div className="form-group">
                <label>Institute</label>
                <input
                  type="text"
                  name="institute"
                  value={addFormData.institute}
                  onChange={handleAddChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Area of Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={addFormData.specialization}
                  onChange={handleAddChange}
                  className="form-control"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showAddPassword ? "text" : "password"}
                name="password"
                value={addFormData.password}
                onChange={handleAddChange}
                className="form-control"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowAddPassword(!showAddPassword)}
              >
                <i className={`bi ${showAddPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-group">
              <input
                type={showAddConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={addFormData.confirm_password}
                onChange={handleAddChange}
                className="form-control"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowAddConfirmPassword(!showAddConfirmPassword)}
              >
                <i className={`bi ${showAddConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn btn-theme" disabled={fisLoading}>
              {fisLoading ? (
                <div className="spinner-border text-light btnspinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Add User"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={fisLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditUserModal = ({isOpen, onClose, onSuccess, token, selectedUser}) => {
  const modalContentRef = useRef(null);

  const [editFormData, setEditFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    image: "",
    qualification: "",
    field: "",
    institute: "",
    specialization: ""
  });
  const [editError, setEditError] = useState("");
  const [editActiveTab, setEditActiveTab] = useState("student"); // Local state for this modal
  const [fisLoading, setFisLoading] = useState(false); // Local loading state for submission

  // Populate form data and tab when selectedUser changes or modal opens
  useEffect(() => {
    if (isOpen && selectedUser) {
      setEditFormData({
        email: selectedUser.email || "",
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        phone: selectedUser.phone || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        country: selectedUser.country || "",
        postal_code: selectedUser.postal_code || "",
        image: selectedUser.image || "",
        qualification: selectedUser.qualification || "",
        field: selectedUser.field || "",
        institute: selectedUser.institute || "",
        specialization: selectedUser.specialization || ""
      });

      // Corrected case sensitivity here for robustness:
      setEditActiveTab(selectedUser.role.toLowerCase() === "lecturer" ? "lecturer" : "student");

      setEditError(""); // Clear any previous errors when opening
      setFisLoading(false); // Ensure loading is false when modal opens
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    } else if (!isOpen) {
      // Optional: Reset state when modal closes
      setEditFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        image: "",
        qualification: "",
        field: "",
        institute: "",
        specialization: ""
      });
      setEditActiveTab("student");
      setEditError("");
      setFisLoading(false);
    }
  }, [isOpen, selectedUser]); // Dependencies are isOpen and selectedUser

  const handleEditChange = (e) => {
    const {name, value} = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgElement = document.getElementById("editimage");
        if (imgElement) {
          imgElement.src = event.target.result;
        }
        setEditFormData((prevData) => ({
          ...prevData,
          image: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFisLoading(true);
    setEditError("");

    const {
      first_name,
      last_name,
      phone,
      address,
      postal_code,
      city,
      qualification,
      field,
      institute,
      specialization,
      country,
      image
    } = editFormData;

    // Basic validation for common required fields
    if (!first_name || !last_name || !qualification) {
      setEditError("First Name, Last Name, and Educational Qualification are required.");
      setFisLoading(false);
      return;
    }

    // Specific field validation based on tab
    if (editActiveTab === "student" && !field) {
      setEditError("Field of Study is required for students!");
      setFisLoading(false);
      return;
    }
    if (editActiveTab === "lecturer" && (!institute || !specialization)) {
      setEditError("Institute and Specialization are required for lecturers!");
      setFisLoading(false);
      return;
    }

    const payload = {
      type: editActiveTab,
      first_name,
      last_name,
      phone,
      address,
      postal_code, // Corrected: send 'postal_code' directly, matching backend
      city,
      qualification,
      isLecturer: editActiveTab === "lecturer",
      ...(editActiveTab === "student" ? {field} : {institute, specialization}),
      country,
      image
    };

    try {
      const response = await fetch(`${API_URL}/api/admin/user/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.error) {
        setEditError(data.error);
      } else {
        onSuccess("User updated successfully");
        onClose(); // Close modal on success
      }
    } catch (error) {
      setEditError("Failed to update user. Server error.");
    } finally {
      setFisLoading(false); // Ensure loading state is reset
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <h5>Edit User</h5>
        <form onSubmit={handleEditSubmit}>
          <div className="form-group d-flex align-items-end mb-4">
            {/* Image display logic, now using editFormData.image for immediate preview */}
            <div className="profileImage me-2 s-125">
              <img
                src={
                  editFormData.image
                    ? editFormData.image.startsWith("/media/")
                      ? `${IMAGE_HOST}${editFormData.image}`
                      : editFormData.image
                    : "/images/default_profile.png"
                }
                className="s-125"
                id="editimage"
                alt="Profile"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              className="form-control ms-2"
              style={{display: "none"}}
              id="hiddenFileInput"
            />
            <button
              type="button"
              className="btn btn-theme ms-2"
              onClick={() => document.getElementById("hiddenFileInput").click()}
            >
              Upload Image
            </button>
          </div>
          {editError !== "" ? (
            <div className="formErrorDiv">
              <FontAwesomeIcon icon={faInfoCircle} />
              <p className="formError">{editError}</p>
            </div>
          ) : null}

          <div className="nav nav-tabs mb-3">
            <button
              type="button"
              className={`nav-link tabbtn ${editActiveTab === "student" ? "active" : ""}`}
              onClick={() => setEditActiveTab("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`nav-link tabbtn ${editActiveTab === "lecturer" ? "active" : ""}`}
              onClick={() => setEditActiveTab("lecturer")}
            >
              Lecturer
            </button>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={editFormData.email}
              className="form-control"
              disabled={true}
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={editFormData.first_name}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={editFormData.last_name}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={editFormData.phone}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={editFormData.address}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>City/State</label>
            <input
              type="text"
              name="city"
              value={editFormData.city}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={editFormData.country}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={editFormData.postal_code}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Educational Qualification</label>
            <input
              type="text"
              name="qualification"
              value={editFormData.qualification}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>

          {editActiveTab === "student" && (
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                name="field"
                value={editFormData.field}
                onChange={handleEditChange}
                className="form-control"
              />
            </div>
          )}
          {editActiveTab === "lecturer" && (
            <>
              <div className="form-group">
                <label>Institute</label>
                <input
                  type="text"
                  name="institute"
                  value={editFormData.institute}
                  onChange={handleEditChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Area of Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={editFormData.specialization}
                  onChange={handleEditChange}
                  className="form-control"
                />
              </div>
            </>
          )}

          <div className="modal-buttons">
            <button type="submit" className="btn btn-theme" disabled={fisLoading}>
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
              onClick={onClose}
              disabled={fisLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({isOpen, onClose, onSuccess, token, selectedUser}) => {
  const modalContentRef = useRef(null);

  const [passwordFormData, setPasswordFormData] = useState({
    new_password: "",
    confirm_new_password: ""
  });
  const [passError, setPassError] = useState("");
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showChangeConfirmNewPassword, setShowChangeConfirmNewPassword] = useState(false);
  const [fisLoading, setFisLoading] = useState(false); // Local loading state for submission

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPasswordFormData({
        new_password: "",
        confirm_new_password: ""
      });
      setPassError("");
      setShowChangeNewPassword(false);
      setShowChangeConfirmNewPassword(false);
      setFisLoading(false);
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const handlePasswordChange = (e) => {
    const {name, value} = e.target;
    setPasswordFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setFisLoading(true);

    if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
      setPassError("New password and confirm password do not match");
      setFisLoading(false);
      return;
    }
    if (passwordFormData.new_password.length < 8) {
      setPassError("Password must be at least 8 characters long!");
      setFisLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/admin/change/password/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordFormData)
      });
      const data = await response.json();
      if (data.error) {
        if (data.error === "Invalid token") {
          localStorage.setItem("error", "token expired");
          window.location.href = "/admin"; // Redirect to admin login if token expires
        }
        setPassError(data.error);
      } else {
        onSuccess("Password updated successfully", true);
        onClose(); // Close modal on success
      }
    } catch (error) {
      setPassError("Server error, please try again.");
    } finally {
      setFisLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <h5>Change Password</h5>
        <form onSubmit={handleChangePasswordSubmit}>
          {passError !== "" ? (
            <div className="formErrorDiv">
              <FontAwesomeIcon icon={faInfoCircle} />
              <p className="formError">{passError}</p>
            </div>
          ) : null}

          <div className="form-group">
            <label>New Password</label>
            <div className="input-group">
              <input
                type={showChangeNewPassword ? "text" : "password"}
                name="new_password"
                value={passwordFormData.new_password}
                onChange={handlePasswordChange}
                className="form-control"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowChangeNewPassword(!showChangeNewPassword)}
              >
                <i className={`bi ${showChangeNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-group">
              <input
                type={showChangeConfirmNewPassword ? "text" : "password"}
                name="confirm_new_password"
                value={passwordFormData.confirm_new_password}
                onChange={handlePasswordChange}
                className="form-control"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowChangeConfirmNewPassword(!showChangeConfirmNewPassword)}
              >
                <i className={`bi ${showChangeConfirmNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>
          <div className="modal-buttons">
            <button type="submit" className="btn btn-theme" disabled={fisLoading}>
              {fisLoading ? (
                <div className="spinner-border text-light btnspinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Change Password"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={fisLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DisableUserModal = ({isOpen, onClose, onSuccess, token, selectedUser}) => {
  const modalContentRef = useRef(null);
  const [fisLoading, setFisLoading] = useState(false); // Local loading state for submission

  const handleDisableUser = async () => {
    if (!selectedUser) return;

    setFisLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/user/${selectedUser.id}/disable`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.error) {
        onSuccess(data.error, false);
      } else {
        onSuccess("User status updated successfully!");
        onClose(); // Close modal on success
      }
    } catch (error) {
      onSuccess("Failed to update user status!", false);
    } finally {
      setFisLoading(false);
    }
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        {selectedUser.isActive ? <h5>Disable User</h5> : <h5>Enable User</h5>}

        <div className="">
          <span className="disableText">
            Are you sure you want to {selectedUser.isActive ? "disable" : "enable"}
            <span className={selectedUser.isActive ? "text-danger" : "text-success"}>
              {" "}
              {selectedUser.name}
            </span>
            ?
          </span>
        </div>
        <div className="modal-buttons">
          <button
            type="button"
            className={`btn btn-theme2 ${selectedUser.isActive ? "btn-danger" : "btn-success"}`}
            onClick={handleDisableUser}
            disabled={fisLoading}
          >
            {fisLoading ? (
              <div className="spinner-border text-light btnspinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : selectedUser.isActive ? (
              "Disable"
            ) : (
              "Enable"
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={fisLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [sort, setSort] = useState("email");
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false); // Trigger data refetch

  const [isSuccess, setIsSuccess] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // User currently selected for edit/disable/password change
  const [totalUsers, setTotalUsers] = useState(0);

  // States to control modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  // Function to refresh the user list
  const refreshUsers = useCallback(() => {
    setIsReloading(true);
    setUsers([]);
    fetch(`${API_URL}/api/admin/users?page=${page}&search=${search}&sort=${sort}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, false);
        } else {
          setUsers(data.users);
          setLastPage(data.totalPages);
          setTotalUsers(data.totalUsers);
        }
        setIsLoading(false);
        setIsReloading(false);
      })
      .catch((error) => {
        showToast("Failed to fetch users", false);
        setIsLoading(false);
        setIsReloading(false);
      });
  }, [token, showToast, page, sort, search]); // Dependencies for useCallback

  // Effect to fetch users on initial load or when dependencies change
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers, reload]); // Add reload to dependencies to trigger refetch when modals succeed

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

  // Callback to be passed to modals upon successful action
  const handleModalSuccess = (message, success = true) => {
    showToast(message, success);
    setReload((prev) => !prev); // Toggle reload to trigger useEffect and refresh data
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title="User Management" context="Add and Manage all user accounts here." />
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
                <span>All Users</span>
                <span className="ms-1 uTotal">{totalUsers}</span>
              </div>
              <div className="searchBarContainerCon">
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
                <button
                  onClick={() => {
                    setIsAddModalOpen(true); // This sets the state to true
                  }}
                  className="btn btn-theme addUserBtn"
                >
                  Add User
                </button>
              </div>
            </div>

            <div className="searchBody2">
              <div className="contentTable nobar">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th
                        className="text-start"
                        onClick={() => {
                          const newSort = sort === "email" ? "-email" : "email";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer"}}
                      >
                        Email
                        {sort === "email" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-email" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th
                        onClick={() => {
                          const newSort = sort === "name" ? "-name" : "name";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer"}}
                      >
                        Name
                        {sort === "name" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-name" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th
                        onClick={() => {
                          const newSort = sort === "role" ? "-role" : "role";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer"}}
                      >
                        Role
                        {sort === "role" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-role" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th
                        onClick={() => {
                          const newSort = sort === "lastActive" ? "-lastActive" : "lastActive";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer", minWidth: "100px"}}
                      >
                        Last Active
                        {sort === "lastActive" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-lastActive" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th
                        onClick={() => {
                          const newSort = sort === "status" ? "-status" : "status";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer"}}
                      >
                        Status
                        {sort === "status" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-status" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th
                        onClick={() => {
                          const newSort = sort === "dateAdded" ? "-dateAdded" : "dateAdded";
                          setSort(newSort);
                        }}
                        style={{cursor: "pointer", minWidth: "110px"}}
                      >
                        Date Added
                        {sort === "dateAdded" ? (
                          <FontAwesomeIcon icon={faSortAlphaAsc} />
                        ) : sort === "-dateAdded" ? (
                          <FontAwesomeIcon icon={faSortAlphaDesc} />
                        ) : (
                          ""
                        )}
                      </th>
                      <th style={{minWidth: "120px"}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isReloading && (
                      <tr>
                        <td colSpan={7}>
                          <div className="d-flex justify-content-center align-items-center tableLoader">
                            <div className="loader"></div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!isReloading && users.length === 0 && (
                      <tr>
                        <td colSpan={7}>
                          <div className="d-flex justify-content-center align-items-center tableLoader">
                            No Users to display
                          </div>
                        </td>
                      </tr>
                    )}

                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>
                          {user.image ? (
                            <div className="profileImage mx-2 s-35">
                              <img
                                src={`${IMAGE_HOST}${user.image}`}
                                className="s-35"
                                alt="Profile"
                              />
                            </div>
                          ) : (
                            <div className="profileImage mx-2 s-35">
                              <img
                                src="/images/default_profile.png"
                                className="s-35"
                                alt="Profile"
                              />
                            </div>
                          )}
                        </td>
                        <td className="text-start">{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.role}</td>
                        <td>{formatDate(user.lastActive)}</td>
                        <td>{user.status}</td>
                        <td>{formatDate(user.dateAdded)}</td>
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
                                    setSelectedUser(user);
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
                                    setSelectedUser(user);
                                    setIsDisableModalOpen(true);
                                  }}
                                >
                                  {user.isActive ? "Disable User" : "Enable User"}
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsPasswordModalOpen(true);
                                  }}
                                >
                                  Change Password
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
              {!isReloading && users.length !== 0 && (
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

      {/* Render Modals conditionally, passing necessary props */}
      {isAddModalOpen && (
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onSuccess={handleModalSuccess}
          token={token}
        />
      )}

      {isEditModalOpen && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleModalSuccess}
          token={token}
          selectedUser={selectedUser}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={handleModalSuccess}
          token={token}
          selectedUser={selectedUser}
        />
      )}

      {isDisableModalOpen && (
        <DisableUserModal
          isOpen={isDisableModalOpen}
          onClose={() => setIsDisableModalOpen(false)}
          onSuccess={handleModalSuccess}
          token={token}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagement;

import React from "react";
import "../styles/home.css";
import { useState, useEffect } from "react";
import { API_URL, IMAGE_HOST } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import { faCrown, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminNavBar from "../components/AdminNavBar";

const AdminProfile = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [editError, SetEditError] = useState("");
  const [passError, setPassError] = useState("");
  const [profileSrc, setProfileSrc] = useState("/images/default_profile.png");

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.error) {
          showToast(data.error, false);
        } else {
          setUser(data.user);
          setEditFormData(data.user);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, showToast]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    postal_code: "",
    city: "",
    tax_id: ""
  });

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: ""
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    SetEditError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();
      if (data.error) {
        SetEditError(data.error);
      } else {
        setUser(data.user);
        setIsEditModalOpen(false);
        SetEditError("");
        showToast("Profile updated successfully", true);
        if (data.user.image !== "") {
          setProfileSrc(`${IMAGE_HOST}${data.user.image}`);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setIsLoading(true);
    if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
      setPassError("New password and confirm password do not match");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/change/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordFormData)
      });
      const data = await response.json();
      if (data.error) {
        setPassError(data.error);
      } else {
        setIsChangePasswordModalOpen(false);
        setPassError("");
        showToast("Password updated successfully", true);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title="Profile" />
      </div>

      <div className="main-body">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading && user === null ? (
          <div className="h-100">
            <h5 className="postHead">My profile</h5>
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          </div>
        ) : (
          <div className="sub-body">
            <div className="postHead">
              <h5>My profile</h5>
            </div>
            <div className="profileInfoBody">
              <div className="borderedContainer mb-3">
                {user && user.image ? (
                  <div className="adminProfileImage me-2">
                    <div className="adminProfileIconDiv">
                      <FontAwesomeIcon icon={faCrown} className="adminProfileIcon" />
                    </div>
                    <img src={`${IMAGE_HOST}${user.image}`} alt="Profile" />
                  </div>
                ) : (
                  <div className="adminProfileImage me-2">
                    <div className="adminProfileIconDiv">
                      <FontAwesomeIcon icon={faCrown} className="adminProfileIcon" />
                    </div>
                    <img src={profileSrc} alt="Profile" />
                  </div>
                )}
                <div className="profileInfo">
                  <h5 className="profileName">
                    {user?.first_name || "N/A"} {user?.last_name || "N/A"}
                  </h5>
                  <p>{user?.address || "N/A"}</p>
                </div>
              </div>

              <div className="borderedContainer2 mb-3">
                <p className="borderedTitle">Personal Information</p>
                <div className="paddedInfo">
                  <div>
                    <p>First Name</p>
                    <p className="mb-3 fw-bold">{user?.first_name || "N/A"}</p>
                  </div>
                  <div>
                    <p>Email Address</p>
                    <p className="mb-3 fw-bold">{user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="paddedInfo">
                  <div>
                    <p>Last Name</p>
                    <p className="mb-3 fw-bold">{user?.last_name || "N/A"}</p>
                  </div>
                  <div>
                    <p>Phone</p>
                    <p className="mb-3 fw-bold">{user?.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="paddedInfo">
                  <div>
                    <p>City/State</p>
                    <p className="mb-3 fw-bold">{user?.city || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="buttonDiv">
              <button className="btn btn-theme me-2" onClick={() => setIsEditModalOpen(true)}>
                Edit Profile
              </button>
              <button className="btn btn-theme" onClick={() => setIsChangePasswordModalOpen(true)}>
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Edit Profile</h5>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group d-flex align-items-end mb-4">
                {user && user.image ? (
                  <div className="adminProfileImage me-2 s-125">
                    <div className="adminProfileIconDiv">
                      <FontAwesomeIcon icon={faCrown} className="adminProfileIcon3" />
                    </div>
                    <img
                      src={`${IMAGE_HOST}${user.image}`}
                      className="s-121"
                      id="editimage"
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <div className="adminProfileImage me-2 s-125">
                    <div className="adminProfileIconDiv">
                      <FontAwesomeIcon icon={faCrown} className="adminProfileIcon3" />
                    </div>
                    <img
                      src="/images/default_profile.png"
                      className="s-121"
                      id="editimage"
                      alt="Profile"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        document.getElementById("editimage").src = event.target.result;
                        setEditFormData((prevData) => ({
                          ...prevData,
                          image: event.target.result
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="form-control ms-2"
                  style={{ display: "none" }}
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

              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {isLoading ? (
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
                    SetEditError("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isChangePasswordModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Change Password</h5>
            <form onSubmit={handleChangePasswordSubmit}>
              {passError !== "" ? (
                <div className="formErrorDiv">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p className="formError">{passError}</p>
                </div>
              ) : null}
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordFormData.current_password}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordFormData.new_password}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={passwordFormData.confirm_new_password}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  {isLoading ? (
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
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    setPassError("");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

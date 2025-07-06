import React, { useState, useEffect } from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import { API_URL, IMAGE_HOST } from "../constants";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserManagement = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [fisLoading, setFisLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [sort, setSort] = useState("email");
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
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
  }, [token, showToast, page, sort, search, reload]);

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError("");
    setFisLoading(true);
    if (passwordFormData.new_password !== passwordFormData.confirm_new_password) {
      setPassError("New password and confirm password do not match");
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
          window.location.href = "/admin";
        }
        setPassError(data.error);
      } else {
        setIsEditModalOpen(false);
        setPassError("");
        showToast("Password updated successfully", true);
        setIsPasswordModalOpen(false);
        setReload(!reload);
      }
    } catch (error) {
    } finally {
      setFisLoading(false);
    }
  };

  const handleDisableUser = () => {
    if (!selectedUser) return;

    setFisLoading(true);
    fetch(`${API_URL}/api/admin/user/${selectedUser.id}/disable`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, false);
        } else {
          showToast("Success!");
          setReload(!reload);
        }
        setFisLoading(false);
        setIsDisableModalOpen(false);
      })
      .catch(() => {
        showToast("Failed!", false);
        setFisLoading(false);
        setIsDisableModalOpen(false);
      });
  };

  const [editFormData, setEditFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    tax_id: "",
    image: ""
  });
  const [editError, setEditError] = useState("");

  const [addFormData, setAddFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    tax_id: "",
    image: "",
    password: "",
    confirm_password: ""
  });
  const [addError, setAddError] = useState("");

  const [passwordFormData, setPasswordFormData] = useState({
    new_password: "",
    confirm_new_password: ""
  });
  const [passError, setPassError] = useState("");

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prevData) => ({
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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFisLoading(true);

    fetch(`${API_URL}/api/admin/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(addFormData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAddError(data.error);
        } else {
          showToast("User Added successfully");
          setIsAddModalOpen(false);
          setAddError("");
          setReload(!reload);
        }
        setFisLoading(false);
      })
      .catch(() => {
        setEditError("Failed to add user");
        setFisLoading(false);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setFisLoading(true);

    fetch(`${API_URL}/api/admin/user/${selectedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editFormData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setEditError(data.error);
        } else {
          showToast("User updated successfully");
          setIsEditModalOpen(false);
          setEditError("");
          setReload(!reload);
        }
        setFisLoading(false);
      })
      .catch(() => {
        setEditError("Failed to update user");
        setFisLoading(false);
      });
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
                  subBody.scrollTo({ top: 0, behavior: "smooth" });
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
                    style={{ cursor: "pointer" }}
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
                    setIsAddModalOpen(true);
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
                        style={{ cursor: "pointer" }}
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
                        style={{ cursor: "pointer" }}
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
                          const newSort = sort === "lastActive" ? "-lastActive" : "lastActive";
                          setSort(newSort);
                        }}
                        style={{ cursor: "pointer", minWidth: "100px" }}
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
                        style={{ cursor: "pointer" }}
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
                        style={{ cursor: "pointer", minWidth: "110px" }}
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
                      <th style={{ minWidth: "120px" }}>Actions</th>
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
                                    setEditFormData({
                                      email: user.email,
                                      first_name: user.first_name,
                                      last_name: user.last_name,
                                      phone: user.phone,
                                      address: user.address,
                                      city: user.city,
                                      country: user.country,
                                      postal_code: user.postal_code,
                                      tax_id: user.tax_id,
                                      image: user.image
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
                                    setPassError("");
                                    setPasswordFormData({
                                      new_password: "",
                                      confirm_new_password: ""
                                    });
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
                      {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNumber) => (
                        <li
                          key={pageNumber}
                          className={`page-i</li>tem ${page === pageNumber ? "active" : ""}`}
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

      {isAddModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Add User</h5>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group d-flex align-items-end mb-4">
                <div className="profileImage me-2 s-125">
                  <img
                    src="/images/default_profile.png"
                    className="s-125"
                    id="addimage"
                    alt="Profile"
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
                        document.getElementById("addimage").src = event.target.result;
                        setAddFormData((prevData) => ({
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
              {addError !== "" ? (
                <div className="formErrorDiv">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p className="formError">{addError}</p>
                </div>
              ) : null}
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
                <label>Tax ID</label>
                <input
                  type="text"
                  name="tax_id"
                  value={addFormData.tax_id}
                  onChange={handleAddChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={addFormData.password}
                  onChange={handleAddChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={addFormData.confirm_password}
                  onChange={handleAddChange}
                  className="form-control"
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
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
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setAddError("");
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

      {isEditModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h5>Edit User</h5>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group d-flex align-items-end mb-4">
                {selectedUser && selectedUser.image ? (
                  <div className="profileImage me-2 s-125">
                    <img
                      src={`${IMAGE_HOST}${selectedUser.image}`}
                      className="s-125"
                      id="editimage"
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <div className="profileImage me-2 s-125">
                    <img
                      src="/images/default_profile.png"
                      className="s-125"
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
                <label>Tax ID</label>
                <input
                  type="text"
                  name="tax_id"
                  value={editFormData.tax_id}
                  onChange={handleEditChange}
                  className="form-control"
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

      {isPasswordModalOpen && (
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
                    setIsPasswordModalOpen(false);
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

      {isDisableModalOpen && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            {selectedUser.isActive ? <h5>Disable User</h5> : <h5>Enable User</h5>}

            <div className="">
              <span className="disableText">
                Are you sure you want to {selectedUser.isActive ? "disable" : "enable"}
                <span className={selectedUser.isActive ? "text-danger" : "text-success"}>
                  {" "}
                  {selectedUser.name}
                </span>
              </span>
            </div>
            <div className="modal-buttons">
              <button
                type="submit"
                className={`btn btn-theme2 ${selectedUser.isActive ? "btn-danger" : "btn-success"}`}
                onClick={handleDisableUser}
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
                onClick={() => {
                  setIsDisableModalOpen(false);
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

export default UserManagement;

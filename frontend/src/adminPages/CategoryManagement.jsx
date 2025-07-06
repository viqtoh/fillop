import React, { useState, useEffect } from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import { API_URL, IMAGE_HOST } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import { faSearch, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";

const CategoryManagement = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [cisCollapsed, setCisCollapsed] = useState(false);
  const [risCollapsed, setRisCollapsed] = useState(false);
  const [fisCollapsed, setFisCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title="Category Management" />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <button className="btn btn-primary mb-3" onClick={() => setShowCreateModal(true)}>
              Create Category
            </button>

            {categories.length > 0 ? (
              <div className="category-list row">
                {categories.map((category) => (
                  <div className="categoryCardContainer mt-3" key={category.id}>
                    <div className="category-card">
                      <div className="category-header">
                        <div className="category-header-left">
                          <h3>{category.name}</h3>
                        </div>
                        <div className="category-header-right">
                          <button
                            className="edit-button"
                            onClick={() => {
                              setEditCategory(category);
                              setShowEditModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button className="merge-button">Merge</button>
                        </div>
                      </div>
                      <div className="category-details">
                        <p>{category.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noObjects">
                <span>No categories available</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h2>Create Category</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newCategory = {
                  name: formData.get("name"),
                  description: formData.get("description"),
                  image: formData.get("image")
                };

                try {
                  const response = await fetch(`${API_URL}/api/admin/category`, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newCategory)
                  });

                  if (!response.ok) {
                    throw new Error("Failed to create category");
                  }

                  const createdCategory = await response.json();
                  setCategories((prev) => [...prev, createdCategory]);
                  showToast("Category created successfully", true);
                  setShowCreateModal(false);
                } catch (error) {
                  showToast("Failed to create category", false);
                }
              }}
            >
              <div className="form-group mt-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  required
                  autoFocus
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editCategory && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h2>Edit Category</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedCategory = {
                  name: formData.get("name"),
                  description: formData.get("description"),
                  image: formData.get("image")
                };

                try {
                  const response = await fetch(`${API_URL}/api/admin/category/${editCategory.id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedCategory)
                  });

                  if (!response.ok) {
                    throw new Error("Failed to update category");
                  }

                  const updatedData = await response.json();
                  setCategories((prev) =>
                    prev.map((cat) => (cat.id === editCategory.id ? updatedData : cat))
                  );
                  showToast("Category updated successfully", true);
                  setShowEditModal(false);
                } catch (error) {
                  showToast("Failed to update category", false);
                }
              }}
            >
              <div className="form-group mt-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  defaultValue={editCategory.name}
                  required
                  autoFocus
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
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

export default CategoryManagement;

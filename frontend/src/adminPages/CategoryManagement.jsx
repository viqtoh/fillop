import React, {useState, useEffect} from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import {API_URL} from "../constants"; // Removed IMAGE_HOST as it's not used here
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import {faSearch, faAngleUp, faTrash} from "@fortawesome/free-solid-svg-icons"; // Added faTrash
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import Select from "react-select"; // Select is not used in the provided code, can be removed if not needed elsewhere

const CategoryManagement = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  const [mergedCategory, setMergedCategory] = useState(null);
  const [mergingCategory, setMergingCategory] = useState(null);

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
  const [showMergeModal, setShowMergeModal] = useState(false);

  // New states for delete functionality
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
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

  useEffect(() => {
    fetchCategories();
  }, [token, showToast]);

  // New function to handle category deletion
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return; // Should not happen if modal is properly displayed

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/category/${categoryToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
      showToast("Category deleted successfully", true);
      setShowDeleteModal(false); // Close modal
      setCategoryToDelete(null);
    } catch (error) {
      showToast("Failed to delete category", false);
    } finally {
      setIsLoading(false);
    }
  };

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
                          <button
                            className="merge-button"
                            onClick={() => {
                              setMergingCategory(category);
                              setShowMergeModal(true);
                            }}
                          >
                            Merge
                          </button>
                          {/* New Delete Button */}
                          <button
                            className="delete-button"
                            onClick={() => {
                              setCategoryToDelete(category);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="category-details">
                        <p>{category.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isLoading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="noObjects">
                <span>No categories available</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Category Modal */}
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
                setIsLoading(true);
                const formData = new FormData(e.target);
                const newCategory = {
                  name: formData.get("name"),
                  description: formData.get("description"), // Assuming 'description' is a valid field
                  image: formData.get("image") // Assuming 'image' is a valid field
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
                } finally {
                  setIsLoading(false);
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
              {/* You might want to add description/image fields here if they are part of create */}
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
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
                setIsLoading(true);
                const formData = new FormData(e.target);
                const updatedCategory = {
                  name: formData.get("name"),
                  description: formData.get("description"), // Assuming 'description' is a valid field
                  image: formData.get("image") // Assuming 'image' is a valid field
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
                } finally {
                  setIsLoading(false);
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
              {/* You might want to add description/image fields here if they are part of edit */}
              <div className="modal-buttons">
                <button type="submit" className="btn btn-theme" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merge Category Modal */}
      {showMergeModal && mergingCategory && (
        <div className="modal">
          <div
            className="modal-content"
            ref={(el) => {
              if (el) el.scrollTop = 0;
            }}
          >
            <h2>Merge Category</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true); // Set loading for merge operation

                try {
                  const response = await fetch(
                    `${API_URL}/api/admin/category/${mergingCategory.id}/merge`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({mergedCategoryId: mergedCategory})
                    }
                  );

                  if (response.ok) {
                    // Re-fetch categories to reflect changes (removed merged category)
                    setMergedCategory(null); // Clear mergedCategory state
                    showToast("Category merged successfully", true);
                    setShowMergeModal(false);
                    await fetchCategories(); // Re-fetch all categories
                  } else {
                    throw new Error("Failed to merge category"); // Throw error to catch block
                  }
                } catch (error) {
                  showToast("Failed to merge category", false);
                } finally {
                  setIsLoading(false); // Always set loading to false
                }
              }}
            >
              <div className="form-group mt-3">
                <label htmlFor="name">Select category to merge to {mergingCategory.name}</label>

                <select
                  className="form-control"
                  onChange={(e) => setMergedCategory(e.target.value)}
                  // Ensure default selected value for dropdown is correct if editing
                  value={mergedCategory || ""} // Set value prop for controlled component
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((category) => category.id !== mergingCategory.id)
                    .map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        // removed selected prop as value prop controls it
                      >
                        {category.name}
                      </option>
                    ))}
                  {categories.filter((category) => category.id !== mergingCategory.id).length ===
                    0 && (
                    <option value="" disabled>
                      No categories to merge
                    </option>
                  )}
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  type="submit"
                  className="merge-button"
                  disabled={isLoading || !mergedCategory}
                >
                  {isLoading ? "Loading..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMergeModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-danger">Confirm Deletion</h3>
            <p style={{fontSize: "1.2rem"}}>
              Are you sure you want to delete the category "<strong>{categoryToDelete.name}</strong>
              "?
            </p>
            <p className="text-danger">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteCategory}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null); // Clear category on cancel
                }}
                disabled={isLoading}
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

export default CategoryManagement;

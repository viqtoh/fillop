import React, {useState, useEffect, useCallback} from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css"; // Ensure this contains any custom table/layout styles
import "../styles/AdminNewsManagement.css"; // New custom styles for this component
import {API_URL, IMAGE_HOST} from "../constants"; // Make sure API_URL points to your Express backend root, e.g., "http://localhost:8000"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Required for Bootstrap JavaScript (modals, tooltips etc.)
import Toast from "../components/Toast";
import {
  faSearch,
  faAngleUp,
  faEdit,
  faTrash,
  faPlus,
  faFolderOpen,
  faSortAlphaDown,
  faSortAlphaUp
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal"; // Using react-bootstrap Modal component
import Form from "react-bootstrap/Form"; // Using react-bootstrap Form components
import Button from "react-bootstrap/Button"; // Using react-bootstrap Button components

// NEW: Import ReactQuill and its stylesheet
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // The default theme stylesheet
import {faEye} from "@fortawesome/free-regular-svg-icons";

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

const SearchBar = ({searchQuery, setSearchQuery}) => {
  return (
    <input
      type="text"
      className="form-control csearchbar"
      placeholder="Search articles by title or content..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e)}
    />
  );
};
const NewsManagement = () => {
  const token = localStorage.getItem("token"); // Assuming JWT token for authentication
  const API_ARTICLES_URL = `${API_URL}/api/admin/articles`;
  const API_CATEGORIES_URL = `${API_URL}/api/admin/articles/categories`;

  // --- State Management ---
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [limit, setLimit] = useState(10); // Number of items per page
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("publishedDate"); // Default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadArticles, setReloadArticles] = useState(false); // Trigger to reload articles
  const [deleteSlug, setDeleteSlug] = useState(null);

  // Toast state
  const [isSuccess, setIsSuccess] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null); // For editing an article

  // Form data for create/edit article
  const [articleFormData, setArticleFormData] = useState({
    title: "",
    content: "", // Will hold HTML content from ReactQuill
    imageUrl: "",
    authorName: "",
    authorImageUrl: "",
    categoryId: ""
  });
  // File objects for *new uploads*
  const [blogImageFile, setBlogImageFile] = useState(null);
  const [authorImageFile, setAuthorImageFile] = useState(null);
  // Previews (can be blob URL for new file, or IMAGE_HOST + path for existing)
  const [blogImagePreview, setBlogImagePreview] = useState(null);
  const [authorImagePreview, setAuthorImagePreview] = useState(null);

  // Form data for category management
  const [currentCategoryName, setCurrentCategoryName] = useState(""); // For editing a category
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // For editing/deleting a category
  const [categoryFormData, setCategoryFormData] = useState({
    name: ""
  });

  // Ref for the Quill editor instance (for image handling)
  const quillRef = React.useRef(null);

  // --- Toast Function ---
  const showToast = useCallback((message, success = true) => {
    setToastMessage(message);
    setIsSuccess(success);
    setTimeout(() => setToastMessage(null), 5000); // Hide after 5s
  }, []);

  // --- API Calls ---

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
        sort: sortField,
        order: sortOrder,
        search: searchQuery
      });
      const response = await fetch(`${API_ARTICLES_URL}?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      setArticles(data.results);
      setTotalPages(data.total_pages);
      setPage(data.current_page); // Ensure current_page is correctly set from response
      setLastPage(data.total_pages); // For your existing `lastPage` state
    } catch (error) {
      console.error("Error fetching articles:", error);
      showToast(error.message || "Failed to load articles.", false);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchArticles();
    } else {
      setIsLoading(false);
      showToast("Authentication token is missing. Please log in.", false);
    }
  }, [page, limit, sortField, sortOrder, reloadArticles, token, showToast]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/articles/categories`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        // Set a default category for the form if categories are available
        if (data.length > 0 && !articleFormData.categoryId) {
          setArticleFormData((prev) => ({...prev, categoryId: data[0].id}));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast("Failed to load categories for forms.", false);
      }
    };
    if (token) {
      fetchCategories();
    }
  }, [token, reloadArticles, articleFormData.categoryId, showToast]);

  // --- Handlers for Article CRUD ---
  const handleArticleSubmission = async (method) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", articleFormData.title);
      // Ensure content is sent, even if empty HTML
      formData.append("content", articleFormData.content || "");
      formData.append("authorName", articleFormData.authorName);
      formData.append("categoryId", articleFormData.categoryId);

      // Handle blog image
      if (blogImageFile) {
        formData.append("blogImage", blogImageFile); // New file upload
      } else if (articleFormData.imageUrl !== undefined) {
        // If no new file, but imageUrl exists (from DB) or is explicitly cleared ("")
        formData.append("imageUrl", articleFormData.imageUrl); // Send existing URL or empty string
      }

      // Handle author image
      if (authorImageFile) {
        formData.append("authorImage", authorImageFile); // New file upload
      } else if (articleFormData.authorImageUrl !== undefined) {
        // If no new file, but authorImageUrl exists (from DB) or is explicitly cleared ("")
        formData.append("authorImageUrl", articleFormData.authorImageUrl); // Send existing URL or empty string
      }

      let url = API_ARTICLES_URL;
      let fetchMethod = "POST";
      let successMessage = "Article created successfully!";

      if (method === "PUT") {
        if (!currentArticle || !currentArticle.slug) {
          throw new Error("No article selected for editing.");
        }
        url = `${API_ARTICLES_URL}/${currentArticle.slug}`;
        fetchMethod = "PUT";
        successMessage = "Article updated successfully!";
      }

      const response = await fetch(url, {
        method: fetchMethod,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || `Failed to ${method === "POST" ? "create" : "update"} article.`
        );
      }

      showToast(successMessage);
      setShowCreateModal(false);
      setShowEditModal(false);

      // Reset all form states for both modals after success
      setArticleFormData({
        title: "",
        content: "",
        imageUrl: "",
        authorName: "",
        authorImageUrl: "",
        categoryId: categories[0]?.id || ""
      });
      setBlogImageFile(null);
      setAuthorImageFile(null);
      setBlogImagePreview(null);
      setAuthorImagePreview(null);
      // Clear file inputs visually after submission
      if (document.getElementById("createBlogImageInput"))
        document.getElementById("createBlogImageInput").value = "";
      if (document.getElementById("createAuthorImageInput"))
        document.getElementById("createAuthorImageInput").value = "";
      if (document.getElementById("editBlogImageInput"))
        document.getElementById("editBlogImageInput").value = "";
      if (document.getElementById("editAuthorImageInput"))
        document.getElementById("editAuthorImageInput").value = "";

      setReloadArticles((prev) => !prev); // Trigger reload
    } catch (error) {
      console.error(`Error ${method === "POST" ? "creating" : "updating"} article:`, error);
      showToast(error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (slug) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_ARTICLES_URL}/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete article.");
      }
      showToast("Article deleted successfully!");
      setReloadArticles((prev) => !prev); // Trigger reload
    } catch (error) {
      console.error("Error deleting article:", error);
      showToast(error.message, false);
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  // --- Handlers for Category CRUD ---

  const handleCreateCategory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_CATEGORIES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryFormData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create category.");
      }
      showToast("Category created successfully!");
      setReloadArticles((prev) => !prev); // Trigger reload of articles/categories
      setCategoryFormData({name: ""}); // Reset form
    } catch (error) {
      console.error("Error creating category:", error);
      showToast(error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryFormData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update category.");
      }
      showToast("Category updated successfully!");
      setReloadArticles((prev) => !prev); // Trigger reload
      setCurrentCategoryName(""); // Clear edit state
      setCurrentCategoryId(null); // Clear edit state
      setCategoryFormData({name: ""}); // Clear category form
    } catch (error) {
      console.error("Error updating category:", error);
      showToast(error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? Articles assigned to this category will become uncategorized or you'll get an error if articles are linked."
      )
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_CATEGORIES_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category.");
      }
      showToast("Category deleted successfully!");
      setReloadArticles((prev) => !prev); // Trigger reload
      setCurrentCategoryName(""); // Clear edit state
      setCurrentCategoryId(null); // Clear edit state
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast(error.message, false);
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Handlers ---

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const makeSearch = async () => {
    setPage(1);
    fetchArticles();
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc"); // Default to ascending for new sort field
    }
    setPage(1); // Reset to first page on new sort
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleShowCreateModal = () => {
    setArticleFormData({
      title: "",
      content: "", // Clear content for new creation
      imageUrl: "",
      authorName: "",
      authorImageUrl: "",
      categoryId: categories[0]?.id || ""
    });
    setBlogImageFile(null);
    setAuthorImageFile(null);
    setBlogImagePreview(null);
    setAuthorImagePreview(null);
    // Clear file inputs visually
    if (document.getElementById("createBlogImageInput"))
      document.getElementById("createBlogImageInput").value = "";
    if (document.getElementById("createAuthorImageInput"))
      document.getElementById("createAuthorImageInput").value = "";

    setShowCreateModal(true);
  };

  const handleShowEditModal = (article) => {
    setCurrentArticle(article);
    setArticleFormData({
      title: article.title,
      content: article.content, // Set existing content
      imageUrl: article.image_url || "",
      authorName: article.author_name,
      authorImageUrl: article.author_image_url || "",
      categoryId:
        article.category_id || categories.find((c) => c.name === article.category_name)?.id || ""
    });
    setBlogImageFile(null);
    setAuthorImageFile(null);
    setBlogImagePreview(article.image_url ? `${IMAGE_HOST}${article.image_url}` : null);
    setAuthorImagePreview(
      article.author_image_url ? `${IMAGE_HOST}${article.author_image_url}` : null
    );
    // Clear file inputs visually
    if (document.getElementById("editBlogImageInput"))
      document.getElementById("editBlogImageInput").value = "";
    if (document.getElementById("editAuthorImageInput"))
      document.getElementById("editAuthorImageInput").value = "";

    setShowEditModal(true);
  };

  const handleCategoryEditClick = (category) => {
    setCurrentCategoryName(category.name);
    setCurrentCategoryId(category.id);
    setCategoryFormData({name: category.name});
  };

  // Handlers for file input changes and removal
  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    setBlogImageFile(file);
    if (file) {
      setBlogImagePreview(URL.createObjectURL(file));
    } else {
      setBlogImagePreview(null);
    }
    setArticleFormData((prev) => ({...prev, imageUrl: ""}));
  };

  const handleAuthorImageChange = (e) => {
    const file = e.target.files[0];
    setAuthorImageFile(file);
    if (file) {
      setAuthorImagePreview(URL.createObjectURL(file));
    } else {
      setAuthorImagePreview(null);
    }
    setArticleFormData((prev) => ({...prev, authorImageUrl: ""}));
  };

  const handleRemoveBlogImage = () => {
    setBlogImageFile(null);
    setBlogImagePreview(null);
    setArticleFormData((prev) => ({...prev, imageUrl: ""}));
    const blogImageInput =
      document.getElementById("createBlogImageInput") ||
      document.getElementById("editBlogImageInput");
    if (blogImageInput) blogImageInput.value = "";
  };

  const handleRemoveAuthorImage = () => {
    setAuthorImageFile(null);
    setAuthorImagePreview(null);
    setArticleFormData((prev) => ({...prev, authorImageUrl: ""}));
    const authorImageInput =
      document.getElementById("createAuthorImageInput") ||
      document.getElementById("editAuthorImageInput");
    if (authorImageInput) authorImageInput.value = "";
  };

  // --- React-Quill specific setup ---
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
          const response = await fetch(`${API_URL}/api/admin/upload-editor-image`, {
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

  // --- Rendering ---

  const renderPagination = () => {
    const pages = [];
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);

    if (endPage - startPage + 1 < 5) {
      if (page <= 3) {
        endPage = Math.min(totalPages, 5);
      } else if (page > totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    if (startPage > 1) {
      pages.push(
        <li key="first" className="page-item">
          <Button variant="link" className="page-link" onClick={() => handlePageChange(1)}>
            1
          </Button>
        </li>
      );
      if (startPage > 2)
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
          <Button variant="link" className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </Button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      pages.push(
        <li key="last" className="page-item">
          <Button variant="link" className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </Button>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <Button variant="link" className="page-link" onClick={() => handlePageChange(page - 1)}>
              «
            </Button>
          </li>
          {pages}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <Button variant="link" className="page-link" onClick={() => handlePageChange(page + 1)}>
              »
            </Button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar
          title="News Management"
          context="Manage all blog articles and categories here."
        />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
            isSuccess={isSuccess}
          />
        )}

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

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Articles</h3>
              <div>
                <Button variant="primary" className="me-2" onClick={handleShowCreateModal}>
                  <FontAwesomeIcon icon={faPlus} className="me-1" /> New Article
                </Button>
                <Button variant="secondary" onClick={() => setShowCategoriesModal(true)}>
                  <FontAwesomeIcon icon={faFolderOpen} className="me-1" /> Manage Categories
                </Button>
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="input-group mb-3">
              <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
              <button onClick={makeSearch} className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="d-flex mb-3 justify-content-end">
              <div className="dropdown me-2">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuSortBy"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sort By:{" "}
                  {sortField.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  <FontAwesomeIcon
                    icon={sortOrder === "asc" ? faSortAlphaUp : faSortAlphaDown}
                    className="ms-2"
                  />
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuSortBy">
                  <li>
                    <a className="dropdown-item" href="#" onClick={() => handleSortChange("title")}>
                      Title
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => handleSortChange("publishedDate")}
                    >
                      Published Date
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={() => handleSortChange("views")}>
                      Views
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Articles Table */}
            <div className="table-responsive">
              {articles.length > 0 ? (
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Views</th>
                      <th className="text-nowrap">Published Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id}>
                        <td>
                          <a
                            href={`/blog/article/${article.slug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            {article.title}
                          </a>
                        </td>
                        <td>{article.category_name || "N/A"}</td>
                        <td>{article.author_name}</td>
                        <td>{article.views}</td>
                        <td className="text-nowrap">{formatDate(article.published_date)}</td>
                        <td className="text-center text-nowrap">
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="success" size="sm" className="me-2 text-white">
                              {" "}
                              <FontAwesomeIcon icon={faEye} />
                            </Button>
                          </a>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2 text-white"
                            onClick={() => handleShowEditModal(article)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setDeleteSlug(article.slug);
                              setShowDeleteModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info text-center" role="alert">
                  No articles found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </div>
        )}
      </div>

      {/* Create Article Modal */}
      <Modal
        show={showCreateModal}
        className="modal2"
        onHide={() => setShowCreateModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Article</Modal.Title>
        </Modal.Header>
        <Modal.Body className="newsModal">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={articleFormData.title}
                onChange={(e) => setArticleFormData({...articleFormData, title: e.target.value})}
                required
              />
            </Form.Group>
            {/* Content Field - Now React-Quill */}
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <ReactQuill
                ref={quillRef} // Assign ref to access editor instance
                theme="snow"
                value={articleFormData.content}
                onChange={(value) => setArticleFormData({...articleFormData, content: value})}
                modules={quillModules}
                formats={quillFormats}
                // Optional: placeholder text
                placeholder="Write your article content here..."
              />
            </Form.Group>
            {/* Blog Image Field */}
            <Form.Group className="mb-3">
              <Form.Label>Blog Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                id="createBlogImageInput" // Unique ID for clearing
                accept="image/*"
                onChange={handleBlogImageChange}
              />
              {blogImagePreview && (
                <div className="mt-2 d-flex align-items-center">
                  <img
                    src={blogImagePreview}
                    alt="Blog Preview"
                    style={{maxWidth: "150px", maxHeight: "150px", objectFit: "contain"}}
                    className="me-2 img-thumbnail"
                  />
                  <Button variant="outline-danger" size="sm" onClick={handleRemoveBlogImage}>
                    Remove Image
                  </Button>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author Name</Form.Label>
              <Form.Control
                type="text"
                value={articleFormData.authorName}
                onChange={(e) =>
                  setArticleFormData({...articleFormData, authorName: e.target.value})
                }
                required
              />
            </Form.Group>
            {/* Author Image Field */}
            <Form.Group className="mb-3">
              <Form.Label>Author Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                id="createAuthorImageInput" // Unique ID for clearing
                accept="image/*"
                onChange={handleAuthorImageChange}
              />
              {authorImagePreview && (
                <div className="mt-2 d-flex align-items-center">
                  <img
                    src={authorImagePreview}
                    alt="Author Preview"
                    style={{maxWidth: "100px", maxHeight: "100px", objectFit: "contain"}}
                    className="me-2 img-thumbnail rounded-circle" // Added rounded-circle for author image
                  />
                  <Button variant="outline-danger" size="sm" onClick={handleRemoveAuthorImage}>
                    Remove Image
                  </Button>
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={articleFormData.categoryId}
                onChange={(e) =>
                  setArticleFormData({...articleFormData, categoryId: e.target.value})
                }
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
              {categories.length === 0 && (
                <Form.Text className="text-muted">
                  No categories available. Please add categories via "Manage Categories".
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleArticleSubmission("POST")}
            disabled={isLoading || categories.length === 0}
          >
            Create Article
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Article Modal */}
      <Modal
        show={showEditModal}
        className="modal2"
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body className="newsModal">
          {currentArticle && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={articleFormData.title}
                  onChange={(e) => setArticleFormData({...articleFormData, title: e.target.value})}
                  required
                />
              </Form.Group>
              {/* Content Field - Now React-Quill */}
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <ReactQuill
                  ref={quillRef} // Assign ref to access editor instance
                  theme="snow"
                  value={articleFormData.content}
                  onChange={(value) => setArticleFormData({...articleFormData, content: value})}
                  modules={quillModules}
                  formats={quillFormats}
                  // Optional: placeholder text
                  placeholder="Write your article content here..."
                />
              </Form.Group>
              {/* Blog Image Field */}
              <Form.Group className="mb-3">
                <Form.Label>Blog Image (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  id="editBlogImageInput" // Unique ID for clearing
                  accept="image/*"
                  onChange={handleBlogImageChange}
                />
                {blogImagePreview && (
                  <div className="mt-2 d-flex align-items-center">
                    <img
                      src={blogImagePreview}
                      alt="Blog Preview"
                      style={{maxWidth: "150px", maxHeight: "150px", objectFit: "contain"}}
                      className="me-2 img-thumbnail"
                    />
                    <Button variant="outline-danger" size="sm" onClick={handleRemoveBlogImage}>
                      Remove Image
                    </Button>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author Name</Form.Label>
                <Form.Control
                  type="text"
                  value={articleFormData.authorName}
                  onChange={(e) =>
                    setArticleFormData({...articleFormData, authorName: e.target.value})
                  }
                  required
                />
              </Form.Group>
              {/* Author Image Field */}
              <Form.Group className="mb-3">
                <Form.Label>Author Image (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  id="editAuthorImageInput" // Unique ID for clearing
                  accept="image/*"
                  onChange={handleAuthorImageChange}
                />
                {authorImagePreview && (
                  <div className="mt-2 d-flex align-items-center">
                    <img
                      src={authorImagePreview}
                      alt="Author Preview"
                      style={{maxWidth: "100px", maxHeight: "100px", objectFit: "contain"}}
                      className="me-2 img-thumbnail rounded-circle"
                    />
                    <Button variant="outline-danger" size="sm" onClick={handleRemoveAuthorImage}>
                      Remove Image
                    </Button>
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={articleFormData.categoryId}
                  onChange={(e) =>
                    setArticleFormData({...articleFormData, categoryId: e.target.value})
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
                {categories.length === 0 && (
                  <Form.Text className="text-muted">
                    No categories available. Please add categories via "Manage Categories".
                  </Form.Text>
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleArticleSubmission("PUT")}
            disabled={isLoading || categories.length === 0}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manage Categories Modal */}
      <Modal show={showCategoriesModal} onHide={() => setShowCategoriesModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Manage Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body className="newsModal">
          <h5>Existing Categories</h5>
          {categories.length > 0 ? (
            <ul className="list-group mb-3">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {cat.name}
                  <div>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleCategoryEditClick(cat)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No categories created yet.</p>
          )}

          <h5 className="mt-4">{currentCategoryId ? "Edit Category" : "Add New Category"}</h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                required
              />
            </Form.Group>
            <Button
              variant={currentCategoryId ? "warning" : "success"}
              onClick={
                currentCategoryId
                  ? () => handleUpdateCategory(currentCategoryId)
                  : handleCreateCategory
              }
              disabled={isLoading || !categoryFormData.name.trim()}
            >
              {currentCategoryId ? "Update Category" : "Add Category"}
            </Button>
            {currentCategoryId && (
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => {
                  setCurrentCategoryId(null);
                  setCurrentCategoryName("");
                  setCategoryFormData({name: ""});
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoriesModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} size="md">
        <Modal.Body className="newsModal">
          <h5 className="mb-4">Are you sure you want to delete this Article?</h5>

          <div className="d-flex w-100 justify-content-between mt-4">
            {" "}
            <Button
              variant="danger"
              style={{minWidth: "100px"}}
              onClick={() => handleDeleteArticle(deleteSlug)}
              disabled={isLoading}
            >
              {isLoading ? <div className="loader"></div> : "Yes"}
            </Button>
            <Button
              variant="secondary"
              style={{minWidth: "100px"}}
              onClick={() => setShowDeleteModal(false)}
              disabled={isLoading}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NewsManagement;

import React, {useState, useEffect, useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/real_home.css";
import {API_URL, IMAGE_HOST} from "../constants";

// Define default image placeholders if the API doesn't provide them
const DEFAULT_AUTHOR_IMAGE = "/images/default_author.png";
const DEFAULT_ARTICLE_IMAGE = "/images/default_article.png";

const BlogComponent = ({apiBaseUrl, backgroundColor, enableTitleAnimation}) => {
  // --- State Variables ---
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    date_range: "all_time",
    category: "all",
    popularity: "newest_first"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCat, setIsFetchingCat] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [resultSummary, setResultSummary] = useState("");
  const [categories, setCategories] = useState([]);

  // Ref for search input debounce
  const searchTimeoutRef = useRef(null);

  // --- Helper Functions ---
  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  // --- Core Fetch Function (useEffect) ---
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setErrorMessage(null); // Clear previous errors

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (filters.date_range && filters.date_range !== "all_time") {
        params.append("date_range", filters.date_range);
      }
      if (filters.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.popularity && filters.popularity !== "newest_first") {
        params.append("popularity", filters.popularity);
      }
      params.append("page", currentPage);

      const url = `${apiBaseUrl}?${params.toString()}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setResultSummary(data.results_summary);
        setArticles(data.results);
        setTotalPages(data.total_pages);
        // Edge case: if no results and total_pages is 0, ensure pagination doesn't break
        if (data.results.length === 0 && data.total_pages === 0) {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setErrorMessage("Failed to load blog posts. Please try again later.");
        setArticles([]); // Clear articles on error
        setTotalPages(1); // Reset total pages on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, searchQuery, filters, apiBaseUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsFetchingCat(true);

      const url = `${API_URL}/api/articles/categories`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsFetchingCat(false);
      }
    };

    fetchCategories();
  }, []);

  // --- Event Handlers ---
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeoutRef.current);
    const value = e.target.value;
    // Debounce the search input
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
  };

  const handleFilterOptionClick = (filterType, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: filterValue
    }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
    closeFilterModal();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if modal is open AND click is outside filter modal and toggle button
      if (
        showFilterModal &&
        !event.target.closest(".filter-modal") &&
        !event.target.closest(".filter-button-toggle")
      ) {
        closeFilterModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilterModal]);

  // --- Render Pagination Controls ---
  const renderPagination = () => {
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage + 1 < 5) {
      if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
      } else if (currentPage > totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    // Previous button
    pageButtons.push(
      <a
        key="prev"
        href="#"
        className={`pagination-item arrow dynamic ${currentPage === 1 ? "disabled" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage - 1);
        }}
        aria-label="Previous Page"
      >
        {"<"}
      </a>
    );

    if (startPage > 1) {
      pageButtons.push(
        <a
          key={1}
          href="#"
          className="pagination-item dynamic"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
        >
          1
        </a>
      );
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="pagination-item ellipsis dynamic">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <a
          key={i}
          href="#"
          className={`pagination-item dynamic ${i === currentPage ? "selected Bdynamic2" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(i);
          }}
          aria-current={i === currentPage ? "page" : undefined}
        >
          {i}
        </a>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="pagination-item ellipsis dynamic">
            ...
          </span>
        );
      }
      pageButtons.push(
        <a
          key={totalPages}
          href="#"
          className="pagination-item dynamic"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(totalPages);
          }}
        >
          {totalPages}
        </a>
      );
    }

    // Next button
    pageButtons.push(
      <a
        key="next"
        href="#"
        className={`pagination-item arrow dynamic ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(currentPage + 1);
        }}
        aria-label="Next Page"
      >
        {">"}
      </a>
    );

    return (
      <nav
        className="pagination d-flex justify-content-center mt-5"
        aria-label="Pagination Navigation"
      >
        {pageButtons}
      </nav>
    );
  };

  return (
    <section className={`${backgroundColor || ""} `}>
      {" "}
      {/* Added fallback empty string for backgroundColor */}
      <div
        className={`blog-component-instance main-content container-xxl py-5 px-4 px-lg-0 mx-auto ${
          backgroundColor || ""
        }`}
      >
        {" "}
        {/* Adjusted container for max-width, added fallback */}
        {/* Loader Overlay */}
        {isLoading && (
          <div className="loader-overlay is-loading d-flex justify-content-center align-items-center">
            <div className="loader-spinner"></div>
          </div>
        )}
        {/* Search Bar */}
        <div className="search-container mx-auto dynamic">
          <div className="search-input-wrapper Bdynamic2 dynamic">
            <svg
              className="search-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 17L21 21"
                stroke="#7E7E7E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
                stroke="#7E7E7E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="search-input Bdynamic2 form-control" // Added Bootstrap form-control
              placeholder="Search for articles.."
              onChange={handleSearchChange}
              defaultValue={searchQuery} // Use defaultValue for debounced input
            />
          </div>
          <div className="filter-button-and-modal-wrapper">
            <button
              className="filter-button-toggle Bdynamic2 btn" // Added Bootstrap btn
              onClick={() => setShowFilterModal(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 21V18"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 21V15"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 6V3"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 9V3"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 18C6.06812 18 5.60218 18 5.23463 17.8478C4.74458 17.6448 4.35523 17.2554 4.15224 16.7654C4 16.3978 4 15.9319 4 15C4 14.0681 4 13.6022 4.15224 13.2346C4.35523 12.7446 4.74458 12.3552 5.23463 12.1522C5.60218 12 6.06812 12 7 12C7.93188 12 8.39782 12 8.76537 12.1522C9.25542 12.3552 9.64477 12.7446 9.84776 13.2346C10 13.6022 10 14.0681 10 15C10 15.9319 10 16.3978 9.84776 16.7654C9.64477 17.2554 9.25542 17.6448 8.76537 17.8478C8.39782 18 7.93188 18 7 18Z"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                />
                <path
                  d="M17 12C16.0681 12 15.6022 12 15.2346 11.8478C14.7446 11.6448 14.3552 11.2554 14.1522 10.7654C14 10.3978 14 9.93188 14 9C14 8.06812 14 7.60218 14.1522 7.23463C14.3552 6.74458 14.7446 6.35523 15.2346 6.15224C15.6022 6 16.0681 6 17 6C17.9319 6 18.3978 6 18.7654 6.15224C19.2554 6.35523 19.6448 6.74458 19.8478 7.23463C20 7.60218 20 8.06812 20 9C20 9.93188 20 10.3978 19.8478 10.7654C19.6448 11.2554 19.2554 11.6448 18.7654 11.8478C18.3978 12 17.9319 12 17 12Z"
                  stroke="#7E7E7E"
                  strokeWidth="1.5"
                />
              </svg>
            </button>

            {/* Filter Pop-up (Modal) */}
            {showFilterModal && (
              <div className="filter-modal is-open">
                {" "}
                {/* Keep is-open class for custom CSS display */}
                <div className="modal-header">
                  <h3 className="modal-title">Filter Blogs</h3>
                  <button
                    className="close-button btn-close"
                    onClick={closeFilterModal}
                    aria-label="Close"
                  ></button>{" "}
                  {/* Bootstrap close button */}
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Filter by Date range:</div>
                  <div className="filter-options" data-filter-type="date_range">
                    {["all_time", "last_7_days", "last_30_days", "last_6_months", "this_year"].map(
                      (value) => (
                        <button
                          key={value}
                          className={`filter-option-button btn ${
                            filters.date_range === value ? "selected" : ""
                          }`}
                          onClick={() => handleFilterOptionClick("date_range", value)}
                        >
                          {value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Filter by categories:</div>
                  {isFetchingCat ? (
                    <div className="loader"></div>
                  ) : (
                    <div className="filter-options" data-filter-type="category">
                      <button
                        className={`filter-option-button btn ${
                          filters.category === "all" ? "selected" : ""
                        }`}
                        onClick={() => handleFilterOptionClick("category", "all")}
                      >
                        All
                      </button>

                      {categories.map((category) => (
                        <button
                          key={category.name} // Assuming category.name is unique and stable
                          className={`filter-option-button btn ${
                            filters.category === category.name ? "selected" : ""
                          }`}
                          onClick={() => handleFilterOptionClick("category", category.name)}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="filter-section">
                  <div className="filter-section-title">Filter by Popularity:</div>
                  <div className="filter-options" data-filter-type="popularity">
                    {["newest_first", "top_trending", "oldest_first"].map((value) => (
                      <button
                        key={value}
                        className={`filter-option-button btn ${
                          filters.popularity === value ? "selected" : ""
                        }`}
                        onClick={() => handleFilterOptionClick("popularity", value)}
                      >
                        {value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Blog Grid (where results will be displayed) */}
        <div className="container">
          {resultSummary && (
            <div
              className="result-summary-text mt-4 mb-4"
              style={{display: resultSummary ? "block" : "none"}}
            >
              “<span className="dynamic">{resultSummary}</span>”
            </div>
          )}
          <div className="row g-4 blog-grid-container">
            {" "}
            {/* Using Bootstrap grid classes */}
            {isLoading ? (
              // Bootstrap spinner or custom loader, already handled by loader-overlay
              <div className="text-center col-12 my-5">
                {/* The .loader-overlay is positioned absolutely over the whole section,
                  so this specific grid loader might not be needed or could be simplified. */}
              </div>
            ) : errorMessage ? (
              <div className="no-results-message col-12 d-flex flex-column align-items-center justify-content-center py-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-alert-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            ) : articles.length === 0 ? (
              <div className="no-results-message col-12 d-flex flex-column align-items-center justify-content-center py-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-x"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <path d="M14 2v5h5" />
                  <path d="m14.5 10.5-5 5" />
                  <path d="m9.5 10.5 5 5" />
                </svg>
                <span>No blog posts found matching your criteria.</span>
              </div>
            ) : (
              articles.map((article) => {
                const publishedDate = new Date(article.published_date);
                const publishedDateFormatted = publishedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                });

                return (
                  <div key={article.slug} className="col-md-6 col-lg-4 d-flex">
                    {" "}
                    {/* Bootstrap columns for responsive grid */}
                    <a
                      href={`/news/${article.slug}/`}
                      className="card blog-card flex-grow-1 border-0 rounded-0"
                    >
                      {" "}
                      {/* Use card for structure */}
                      <div className="aspect-[4/3.5] bg-light rounded-md overflow-hidden mb-3">
                        {" "}
                        {/* Use custom CSS or inline style for aspect */}
                        <img
                          src={
                            article.image_url
                              ? IMAGE_HOST + article.image_url
                              : DEFAULT_ARTICLE_IMAGE
                          }
                          alt={article.title}
                          className="img-fluid w-100 h-100 object-cover article-image"
                        />
                      </div>
                      <div className="d-flex precat gap-2">
                        {" "}
                        {/* Use Bootstrap flex utilities */}
                        {article.category_name && (
                          <>
                            <div className="article-cat Bdynamic2 badge bg-secondary text-white">
                              {" "}
                              {/* Use Bootstrap badge */}
                              <span className="dynamic">{article.category_name}</span>
                            </div>
                            <div className="cat-dash Bdynamic2"></div>
                          </>
                        )}
                        <span className="text-sm dynamic-2 text-muted">
                          {publishedDateFormatted}
                        </span>
                      </div>
                      <p className="font-weight-bold h5 dynamic mb-2">{article.title}</p>{" "}
                      {/* Use Bootstrap h5 and font-weight */}
                      <div className="d-flex align-items-center gap-3 dynamic-2">
                        <div className="size-10 bg-light rounded-circle overflow-hidden d-flex justify-content-center align-items-center">
                          {" "}
                          {/* Use custom CSS or inline for size-10 */}
                          <img
                            src={
                              article.author_image_url
                                ? IMAGE_HOST + article.author_image_url
                                : DEFAULT_AUTHOR_IMAGE
                            }
                            alt={article.author_name || "Anonymous"}
                            className="img-fluid rounded-circle"
                            style={{width: "40px", height: "40px", objectFit: "cover"}}
                          />
                        </div>
                        <p className="capitalize dynamic mb-0">
                          {article.author_name || "Anonymous"}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Pagination */}
        {totalPages > 1 && !errorMessage && articles.length > 0 && renderPagination()}
      </div>
    </section>
  );
};

export default BlogComponent;

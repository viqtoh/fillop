import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom"; // Import useParams and Link
import axios from "axios"; // For making API requests
import "../styles/real_home.css"; // Your existing global styles
import "bootstrap/dist/css/bootstrap.min.css";

// import Toast from "../components/Toast2"; // Uncomment if you use Toast notifications
import AOS from "aos";
import "aos/dist/aos.css";
// import { Parallax } from "react-parallax"; // Not strictly needed for a single article page

import {
  faTwitter,
  faFacebook,
  faInstagram, // You had Instagram, but usually LinkedIn is more common for articles
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"; // For email sharing
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navbar3 from "../components/Navbar3";
import {API_URL, IMAGE_HOST} from "../constants"; // Make sure API_URL is correctly defined

const DEFAULT_AUTHOR_IMAGE = "/images/default_author.png";
const DEFAULT_ARTICLE_IMAGE = "/images/default_article.png";

// Helper component for similar article cards
const SimilarArticleCard = ({article}) => {
  if (!article) return null;

  return (
    <div className="col-md-6 col-lg-3 mb-4" data-aos="fade-up">
      {" "}
      {/* Adjusted columns for more articles per row */}
      <div className="card h-100 shadow-sm border-0">
        <Link to={`/news/${article.slug}`}>
          <img
            src={article.image_url ? IMAGE_HOST + article.image_url : DEFAULT_ARTICLE_IMAGE}
            alt={article.title}
            className="card-img-top blog-card-image"
          />
        </Link>

        <div className="card-body d-flex flex-column">
          {article.category_name && (
            <span className="badge bg-primary text-white mb-2 align-self-start">
              {article.category_name}
            </span>
          )}
          <h5 className="card-title text-truncate-2-lines">
            <Link to={`/news/${article.slug}`} className="text-decoration-none text-dark">
              {article.title}
            </Link>
          </h5>
          <p className="card-text text-muted small mt-auto">
            By {article.author_name} |{" "}
            {new Date(article.published_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const {slug} = useParams(); // Get slug from URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSecondNavbar, setShowSecondNavbar] = useState(false);

  useEffect(() => {
    AOS.init({duration: 1000, once: true}); // AOS init, once: true means animations only happen once
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowSecondNavbar(true);
      } else {
        setShowSecondNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/articles/${slug}`);
        setArticle(response.data);
        window.scrollTo(0, 0); // Scroll to top on new article load

        await axios.post(`${API_URL}/api/articles/${slug}/increment-views`);
      } catch (err) {
        console.error("Error fetching article:", err);
        if (err.response && err.response.status === 404) {
          setError("Article not found.");
        } else {
          setError("Failed to load article. Please try again later.");
        }
        setArticle(null); // Clear article data on error
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Function to create social share URLs
  const getShareUrl = (platform) => {
    if (!article) return "#";
    const articleUrl = window.location.href; // Current page URL
    const articleTitle = article.title;

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          articleUrl
        )}&text=${encodeURIComponent(articleTitle)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
      case "linkedin":
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          articleUrl
        )}&title=${encodeURIComponent(articleTitle)}&summary=${encodeURIComponent(articleTitle)}`;
      case "email":
        return `mailto:?subject=${encodeURIComponent(
          articleTitle
        )}&body=Check out this article: ${encodeURIComponent(articleUrl)}`;
      default:
        return "#";
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        {showSecondNavbar && <Navbar3 />}
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        {showSecondNavbar && <Navbar3 />}
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    // This case should theoretically be covered by the error state if 404 is received
    return (
      <div>
        <Navbar />
        {showSecondNavbar && <Navbar3 />}
        <div className="container py-5 text-center">
          <div className="alert alert-info" role="alert">
            Article data is not available.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {showSecondNavbar && <Navbar3 />}

      {/* Article Hero Section */}
      <section
        className="article-hero d-flex align-items-end justify-content-center text-white text-center"
        style={{
          backgroundImage: `url(${
            article.image_url ? IMAGE_HOST + article.image_url : DEFAULT_ARTICLE_IMAGE
          })`
        }}
      >
        <div className="overlay"></div> {/* For darkening the image */}
        <div className="container py-5" data-aos="fade-up">
          <h1 className="display-4 fw-bold mb-3">{article.title}</h1>
          <p className="lead">
            {article.category_name && (
              <span className="badge bg-primary me-2">{article.category_name}</span>
            )}
            <span className="authorText">
              By {article.author_name} on{" "}
              {new Date(article.published_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </p>
        </div>
      </section>

      <div className="container py-5 article-content-section">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Author Info & Meta */}
            <div className="author-info mb-4">
              <img
                src={
                  article.author_image_url
                    ? IMAGE_HOST + article.author_image_url
                    : DEFAULT_AUTHOR_IMAGE
                }
                alt={article.author_name}
                className="rounded-circle me-3"
                width="60"
                height="60"
                style={{objectFit: "cover"}}
              />

              <div>
                <p className="mb-0 fw-bold">{article.author_name}</p>
                <p className="mb-0 text-muted small">
                  Published:{" "}
                  {new Date(article.published_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}{" "}
                  | Views: {article.views}
                </p>
              </div>
            </div>

            {/* Article Content - Rendered from Quill HTML */}
            <div
              className="article-content mb-5"
              dangerouslySetInnerHTML={{__html: article.content}}
            ></div>

            {/* Social Share Buttons */}
            <div className="d-flex justify-content-center border-top pt-4">
              <h6 className="me-3 mt-1 text-muted">Share this article:</h6>
              <a
                href={getShareUrl("twitter")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info rounded-circle mx-1 social-icon"
                title="Share on Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                href={getShareUrl("facebook")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary rounded-circle mx-1 social-icon"
                title="Share on Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a
                href={getShareUrl("linkedin")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary rounded-circle mx-1 social-icon"
                title="Share on LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a
                href={getShareUrl("email")}
                className="btn btn-outline-dark rounded-circle mx-1 social-icon"
                title="Share via Email"
              >
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Similar Articles Section */}
        {article.similar_articles && article.similar_articles.length > 0 && (
          <div className="mt-5 pt-5 border-top">
            <h3 className="text-center mb-4" data-aos="fade-up">
              Related Articles
            </h3>
            <div className="row justify-content-center">
              {" "}
              {/* Center similar articles if not full row */}
              {article.similar_articles.map((simArticle) => (
                <SimilarArticleCard key={simArticle.id} article={simArticle} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;

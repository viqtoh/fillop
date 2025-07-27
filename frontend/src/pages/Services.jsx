import React, {useState, useEffect, useCallback} from "react";
import "../styles/real_home.css"; // Your custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2"; // Your Toast component
import AOS from "aos";
import "aos/dist/aos.css";
// import {Parallax} from "react-parallax"; // Uncomment if you plan to use Parallax backgrounds
import {faTwitter, faFacebook, faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons"; // Keep if used elsewhere
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar"; // Your main Navbar
import Footer from "../components/Footer"; // Your Footer
import Navbar3 from "../components/Navbar3"; // Your sticky Navbar
import {API_URL, IMAGE_HOST} from "../constants"; // Import API_URL and IMAGE_HOST
import {faInfoCircle, faUsers, faStar} from "@fortawesome/free-solid-svg-icons"; // Added faUsers, faStar

const Services = () => {
  // Initialize AOS (Animate On Scroll)
  useEffect(() => {
    AOS.init({duration: 1000, once: true}); // Added once: true so animations run only once
  }, []);

  // State for sticky navbar
  const [showSecondNavbar, setShowSecondNavbar] = useState(false);
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

  // --- Service specific states ---
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // For error handling

  // Toast notification (using Toast2 for public-facing)
  const [isSuccess, setIsSuccess] = useState(true);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);

  // --- Fetch Services Effect ---
  useEffect(() => {
    const fetchActiveServices = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        // Fetch all active services from the public API route
        const response = await fetch(
          `${API_URL}/api/services?include_inactive=false&page=1&limit=999`, // Ensure this is your public route
          {
            // No Authorization header needed for public route
          }
        );
        const data = await response.json();

        if (response.ok) {
          // Sort services if you want a specific order (e.g., by ID or custom field)
          // For now, let's assume API returns a sensible order or keep it as is.
          setServices(data.results || []); // Ensure data.results is an array
        } else {
          setError(data.error || "Failed to load services.");
          showToast(data.error || "Failed to load services.", false);
        }
      } catch (err) {
        setError("Network error: Could not connect to the server.");
        showToast("Network error: Could not connect to the server.", false);
        console.error("Failed to fetch services:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveServices();
  }, [showToast]); // Dependency array for useEffect

  return (
    <div className="services-page-wrapper">
      <Navbar />
      {showSecondNavbar && <Navbar3 />}

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}

      {/* Hero Section or Page Title */}
      <div className="container-fluid py-5 header-image">
        <div className="container py-5 text-center" data-aos="fade-up" data-aos-once="true">
          <h1 className="mb-3">Our Services</h1>
          <p className="lead">
            Discover the comprehensive solutions we offer to meet your unique needs and challenges.
          </p>
        </div>
      </div>

      {/* Services Sections */}
      <div className="container py-5 services-container">
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading services...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center py-4 rounded-lg shadow-sm" role="alert">
            <h4 className="alert-heading">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> Error Loading Services!
            </h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="alert alert-info text-center py-4 rounded-lg shadow-sm" role="alert">
            <h4 className="alert-heading">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" /> No Services Available!
            </h4>
            <p className="mb-0">
              It seems no active services are currently available. Please check back later for
              updates!
            </p>
          </div>
        ) : (
          <div>
            {services.map((service, index) => (
              <div
                key={service.id}
                // Removed AOS from the main service-card div to apply to its components
                className={`service-card `}
              >
                <div className="g-0 align-items-center">
                  {/* Image Column */}
                  {service.image_url && (
                    <div
                      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"} // Animate image based on index
                      data-aos-offset="250" // Adjust when animation triggers
                      data-aos-easing="ease-in-sine" // Smoother animation
                      data-aos-duration="1000" // Slightly longer duration
                    >
                      <div className="service-image-wrapper">
                        <img
                          src={`${IMAGE_HOST}${service.image_url}`}
                          className="service-image"
                          alt={service.title}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content Column */}
                  <div>
                    <div className="service-card-body">
                      <h2
                        className="service-title mb-4"
                        data-aos="fade-up"
                        data-aos-delay="100" // Stagger delay for elements
                        data-aos-duration="800"
                      >
                        {service.title}
                      </h2>
                      {/* Dangerously set inner HTML for full_description */}
                      <div
                        className="service-description mb-4"
                        dangerouslySetInnerHTML={{__html: service.full_description}}
                        data-aos="fade-up"
                        data-aos-delay="200"
                        data-aos-duration="800"
                      />

                      {service.target_clients && (
                        <div
                          className="detail-box my-3"
                          data-aos="fade-up"
                          data-aos-delay="300"
                          data-aos-duration="800"
                        >
                          <h5>
                            <FontAwesomeIcon icon={faUsers} className="me-2" /> Primary Target
                            Clients:
                          </h5>
                          <p className="lead">{service.target_clients}</p>
                        </div>
                      )}

                      {service.competitive_advantage && (
                        <div
                          className="detail-box competitive-advantage my-3"
                          data-aos="fade-up"
                          data-aos-delay="400"
                          data-aos-duration="800"
                        >
                          <h5>
                            <FontAwesomeIcon icon={faStar} className="me-2" /> Competitive
                            Advantage:
                          </h5>
                          <p className="lead">{service.competitive_advantage}</p>
                        </div>
                      )}

                      {service.visit_link && (
                        <div
                          className="mt-4 text-center text-md-start"
                          data-aos="fade-up"
                          data-aos-delay="500"
                          data-aos-duration="800"
                        >
                          {" "}
                          {/* Center button on small screens */}
                          <a
                            href={service.visit_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg"
                          >
                            Learn More <FontAwesomeIcon icon={faInfoCircle} className="ms-2" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Services;

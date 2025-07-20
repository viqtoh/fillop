import React, {useState, useEffect} from "react";
import "../styles/real_home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2"; // Make sure this is defined correctly
import AOS from "aos";
import "aos/dist/aos.css";
import {Parallax} from "react-parallax";
import {faTwitter, faFacebook, faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Navbar3 from "../components/Navbar3";
import BlogComponent from "./BlogComponent";
import {API_URL} from "../constants";

const News = () => {
  useEffect(() => {
    AOS.init({duration: 1000});
  }, []);

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

  // IMPORTANT:
  // 1. You need to define your API_BASE_URL for the blog posts.
  //    This should be the URL of your Django REST Framework API endpoint for articles.
  //    Example: "http://localhost:8000/api/articles/" or "/api/articles/" if on same domain.
  const API_BASE_URL_FOR_BLOGS = `${API_URL}/api/articles/`;

  // 2. You need to provide the categories data to the BlogComponent.
  //    In a real application, you might fetch these categories from an API too,
  //    or if your Django template renders this React app, you might pass them
  //    from the Django context into a JavaScript variable.

  return (
    <div>
      <Navbar />
      {showSecondNavbar && <Navbar3 />}

      <div className="container py-5" data-aos="fade-up">
        <h2 className="text-center mb-4">News</h2>
      </div>

      {/* Integrate the BlogComponent here */}
      <BlogComponent
        apiBaseUrl={API_BASE_URL_FOR_BLOGS}
        backgroundColor="bg-white" // Example: Matches a Bootstrap background color
        enableTitleAnimation={true} // Example: Pass boolean based on your Django instance setting
      />

      <Footer />
    </div>
  );
};

export default News;

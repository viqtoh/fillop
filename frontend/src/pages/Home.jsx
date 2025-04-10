import React, {useState, useEffect} from "react";
import "../styles/real_home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2"; // Make sure this is defined correctly
import AOS from "aos";
import "aos/dist/aos.css";
import {Parallax} from "react-parallax";
import {faTwitter, faFacebook, faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const images = [
    "/images/home1.jpg",
    "/images/home2.jpg",
    "/images/home3.jpg",
    "/images/home4.jpg",
    "/images/home5.jpg",
    "/images/home6.jpg",
    "/images/home7.jpg",
    "/images/home8.jpg",
    "/images/home9.jpg"
  ];

  // Slider settings
  const settings = {
    dots: true, // Enable dots for navigation
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Optional: Auto scroll the carousel
    autoplaySpeed: 2000,
    appendDots: (dots) => (
      <div
        style={{
          bottom: "10px",
          position: "absolute",
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <ul style={{margin: 0, padding: 0, display: "flex"}}>{dots}</ul>
      </div>
    )
  };

  return (
    <div>
      <Navbar2 />
      <div className="carousel-container">
        <div class="homeBannerText2">
          <h1>Empowering the Future of Education</h1>
          <p>
            Our platform is designed to help students and teachers alike by providing a
            comprehensive set of tools and resources to support their learning journey. Join us to
            experience a seamless and innovative approach to education.
          </p>
          <p className="homeBannerText2Sub">
            Our platform provides tools and resources to support students and teachers in their
            learning journey.
          </p>
          <a href="/login" class="btn">
            Get Started
          </a>
        </div>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Image ${index + 1}`} className="carousel-image" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="shortFeature">
        <div className="shortFeatureText">
          <h2>Millions of users reached</h2>
          <p>
            Our platform has reached millions of users worldwide, providing them with the tools and
            resources they need to succeed in their educational journey. We are committed to
            delivering excellence and innovation in education.
          </p>
        </div>
        <div className="shortFeatureCards">
          <div className="shortFeatureCard">
            <h1>99.9%</h1>
            <h3>Availability</h3>
          </div>
          <div className="shortFeatureCard">
            <h1>Content</h1>
            <h3>Management</h3>
          </div>
          <div className="shortFeatureCard">
            <h2>Custom Assessments</h2>
          </div>
          <div className="shortFeatureCard">
            <h1>Multi</h1>
            <h3>Languages</h3>
          </div>
        </div>
      </div>

      <div className="infograph">
        <h2 className="infographTitle">How It Works</h2>
        <div className="infographRow">
          <div className="infographImage">
            <img src="/images/infographic_login.png" alt="Infographic" />
          </div>
          <div className="infographText">
            <p>
              Create an account as a student or lecturer. Use the "Forgot Password" option if
              needed. Gain access to a world of educational opportunities.
            </p>
          </div>
        </div>
        <div className="infographRow info-reversed">
          {" "}
          <div className="infographText">
            <p>
              Browse available lectures and educational content on the platform. Discover a variety
              of topics tailored to your interests and goals.
            </p>
          </div>
          <div className="infographImage">
            <img src="/images/infographic_browse.png" alt="Infographic" />
          </div>
        </div>
        <div className="infographRow">
          <div className="infographImage">
            <img src="/images/infographic_manage.png" alt="Infographic" />
          </div>
          <div className="infographText">
            <p>
              Students can enroll in lectures and access pre-recorded materials like videos, PDFs,
              and more. Enhance your learning experience with our curated content.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

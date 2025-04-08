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

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="homeBanner">
        <div className="homeBannerText">
          <h1>Empowering the Future of Education</h1>
          <p>
            Our platform is designed to help students and teachers alike by providing a
            comprehensive set of tools and resources to support their learning journey. Join us to
            experience a seamless and innovative approach to education.
          </p>
          <a href="/login" className="btn">
            Get Started
          </a>
        </div>
        <div className="homeBannerImage">
          <img src="/images/Home-header.svg" alt="Home Banner" />
        </div>
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

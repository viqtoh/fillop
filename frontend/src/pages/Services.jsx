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

const Services = () => {
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

  return (
    <div>
      <Navbar />
      {showSecondNavbar && <Navbar3 />}

      <div className="container py-5" data-aos="fade-up">
        <h2 className="text-center mb-4">Services</h2>
      </div>

      <Footer />
    </div>
  );
};

export default Services;

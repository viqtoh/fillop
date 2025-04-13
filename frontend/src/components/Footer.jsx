import React from "react";
import {faTwitter, faFacebook, faInstagram, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: support@filloptech.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Fillop Street, City, Country</p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <nav className="footer-nav">
              <a href="/about">About Us</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </nav>
          </div>

          <div className="footer-column">
            <h3>About Us</h3>
            <p>
              Fillop is a platform designed to enhance learning experiences by providing seamless
              access to educational resources and tools. Our mission is to empower learners and
              educators worldwide.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fillop Tech. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" className="footer-social-icon">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="footer-social-icon">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="footer-social-icon">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="footer-social-icon">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

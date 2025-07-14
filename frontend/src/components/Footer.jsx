import React from "react";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p>Email: support@filloptech.com</p>
            <p>Phone: +234 (802) 641-4352, +1 (217) 216-0029</p>
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
            <a href="http://facebook.com/filloptech" target="_blank" className="footer-social-icon">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="http://instagram.com/filloptech"
              target="_blank"
              className="footer-social-icon"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="http://x.com/filloptech" target="_blank" className="footer-social-icon">
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href="http://linkedin.com/in/filloptech"
              target="_blank"
              className="footer-social-icon"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="http://youtube.com/@filloptech" target="_blank" className="footer-social-icon">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

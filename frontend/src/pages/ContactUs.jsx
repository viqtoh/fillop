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

const ContactUs = () => {
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
        <h2 className="text-center mb-4">Contact Us</h2>
        <div className="row">
          {/* Contact Details */}
          <div className="col-md-6 mb-4">
            <h4>Get in Touch</h4>
            <p>
              <strong>Address:</strong> 12 Innovation Drive, Tech Valley, Lagos, Nigeria
            </p>
            <p>
              <strong>Email:</strong> support@fillop.com
            </p>
            <p>
              <strong>Phone:</strong> +234 800 000 0000
            </p>

            <h5 className="mt-4">Follow Us</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-dark">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="text-dark">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="text-dark">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="text-dark">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-6">
            <h4>Send a Message</h4>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input type="text" className="form-control" id="subject" placeholder="Subject" />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Google Map Embed */}
        <div className="mt-5">
          <h4 className="text-center mb-4">Find Us On The Map</h4>
          <div className="map-responsive">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.480223901212!2d7.778265174982457!3d5.186926694790572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1067ffc8bf029da1%3A0xf0f4b65172a78b8c!2sLOAM%20POLYTECHNIC!5e0!3m2!1sen!2sng!4v1744552839774!5m2!1sen!2sng"
              width="600"
              height="450"
              style={{border: 0}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LOAM Polytechnic Location"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;

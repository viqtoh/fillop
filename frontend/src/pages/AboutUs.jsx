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

const AboutUs = () => {
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
      <div className="aboutBanner">
        <div className="aboutBannerText">
          <h1>About Us</h1>
          <p>Empowering education through innovative learning management solutions.</p>
        </div>
      </div>
      <div className="shortDesc">
        <div className="shortDescImage">
          <img src="/images/aboutusmission.jpg" alt="About Us" />
        </div>
        <div className="shortDescText">
          <h2>Our Mission</h2>
          <p>
            At Fillop, our mission is to make quality education accessible, engaging, and flexible
            for all. We believe learning should extend beyond traditional classrooms and adapt to
            the needs of modern learners. Whether you're a student seeking flexibility or a lecturer
            looking to share knowledge more widely, Fillop is designed with you in mind. We empower
            lecturers to create and share rich multimedia content—videos, presentations, documents,
            and interactive assessments—making it easy to deliver impactful lessons. For students,
            our platform offers the freedom to learn at their own pace, anytime, anywhere, with
            tools that support continuous growth. Fillop isn’t just a platform; it’s a step toward a
            more inclusive, tech-driven future of education where knowledge knows no boundaries.
          </p>
          <p className="aboutUsTextLg">
            More than just connecting educators and learners, Fillop fosters a thriving academic
            community built on innovation, support, and shared goals. We’re dedicated to creating a
            safe, reliable, and user-friendly environment where learning is not just a task—but an
            experience that inspires, uplifts, and transforms.
          </p>
        </div>
      </div>

      <div className="whatWeOffer">
        <h2 data-aos="fade-right">What We Offer</h2>
        <div className="offeringsContainer">
          <div className="offering" data-aos="fade-up">
            <span className="icon">🎥</span>
            <h3>On-Demand Lectures</h3>
            <p>Access rich learning materials in video, PDF, PowerPoint, and more.</p>
          </div>
          <div className="offering" data-aos="fade-down">
            <span className="icon">📄</span>
            <h3>Downloadable Resources</h3>
            <p>Study anytime with downloadable documents and notes.</p>
          </div>
          <div className="offering" data-aos="fade-up">
            <span className="icon">🧪</span>
            <h3>Assessments</h3>
            <p>Test your knowledge with real-time and scheduled quizzes and exams.</p>
          </div>
          <div className="offering" data-aos="fade-down">
            <span className="icon">📢</span>
            <h3>Social Media Sharing</h3>
            <p>Lecturers can easily share lecture links on social media to reach more learners.</p>
          </div>
        </div>
      </div>

      <div className="aboutUsDetails">
        <div className="whoWeServe" data-aos="fade-right">
          <h2>Who We Serve</h2>
          <p>
            Fillop is built for both lecturers and students, creating a seamless learning ecosystem
            where everyone thrives. Lecturers can effortlessly create, manage, and share
            high-quality educational content, including multimedia lectures and interactive
            assessments. Students, on the other hand, can easily explore courses, enroll in subjects
            of interest, and track their learning progress with intuitive tools that support
            personalized, self-paced education.
          </p>
          <p>
            Whether you're teaching or learning, Fillop is here to make the experience smooth,
            meaningful, and impactful.
          </p>
        </div>

        <div className="ourVision" data-aos="fade-left">
          <h2>Our Vision</h2>
          <div className="visionBody">
            <p>
              To become the world’s leading platform for accessible, tech-driven
              education—empowering learners and educators in every corner of the globe with the
              tools they need to teach, learn, and grow without limits.
            </p>
            <div className="visionGraphic">
              <img src="/images/vision-graphic.webp" alt="Our Vision Graphic" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;

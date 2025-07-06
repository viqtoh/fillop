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
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar";
import {transform} from "framer-motion";

const Home = () => {
  useEffect(() => {
    AOS.init({duration: 1000});
  }, []);

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

  const images = [
    "/images/home1.jpg",
    "/images/home2.jpg",
    "/images/home3.jpg",
    "/images/home4.jpg",
    "/images/home5.jpg",
    "/images/home6.jpg",
    "/images/home7.jpg"
  ];

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
      <Navbar2 />

      {showSecondNavbar && <Navbar3 />}
      <div className="carousel-container">
        <div className="homeBannerText2">
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
          <a href="/register" className="btn">
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
      <div className="ourServices">
        <h2 className="ourServicesTitle">Our Services</h2>
        <div className="servicesContainer">
          <div className="serviceCard" data-aos="fade-up">
            <h3>📚 Lecture Management</h3>
            <p>
              Upload lectures in PPT, video, PDF, Word, or rich text. Content is available on-demand
              and manageable anytime.
            </p>
          </div>
          <div className="serviceCard" data-aos="fade-down">
            <h3>🧑‍🏫 Assessments & Exams</h3>
            <p>
              Create live or scheduled assessments with participant tracking. Flexible plans based
              on class size.
            </p>
          </div>
          <div className="serviceCard" data-aos="fade-up">
            <h3>🌐 Social Sharing & Access</h3>
            <p>
              Generate shareable lecture links. Visitors can access the homepage and register
              instantly.
            </p>
          </div>
          <div className="serviceCard" data-aos="fade-down">
            <h3>🏛️ Informational Hub</h3>
            <p>
              Discover our mission, services, and courses. Admins manage content, news, and
              enrollment info.
            </p>
          </div>
        </div>
      </div>

      <div className="shortFeature">
        <div className="shortFeatureText">
          <h2>Millions of users reached</h2>
          <p className="featureSubText">
            Our platform has reached millions of users worldwide, providing them with the tools and
            resources they need to succeed in their educational journey. We are committed to
            delivering excellence and innovation in education.
          </p>
        </div>
        <div className="shortFeatureCards">
          <div className="shortFeatureCard" data-aos="fade-up">
            <h1>99.9%</h1>
            <h3>Availability</h3>
          </div>
          <div className="shortFeatureCard" data-aos="fade-down">
            <h1>Content</h1>
            <h3>Management</h3>
          </div>
          <div className="shortFeatureCard" data-aos="fade-up">
            <h2>Custom Assessments</h2>
          </div>
          <div className="shortFeatureCard" data-aos="fade-down">
            <h1>Multi</h1>
            <h3>Languages</h3>
          </div>
        </div>
      </div>

      <div className="infograph">
        <h2 className="infographTitle">How It Works</h2>
        <div className="infographRow">
          <div className="infographImage" data-aos="fade-right">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M320,80 
       C200,60 120,180 160,280 
       C200,380 360,360 420,300 
       C500,220 600,300 660,240 
       C720,180 640,100 500,100 
       C440,100 400,110 320,80 
       Z"
                fill="#bae0ffaa"
              />
            </svg>

            <img src="/images/infographic_login.png" alt="Infographic" />
          </div>
          <div className="infographText" data-aos="fade-left">
            <p>
              Create an account as a student or lecturer. Use the "Forgot Password" option if
              needed. Gain access to a world of educational opportunities.
            </p>
          </div>
        </div>
        <div className="infographRow info-reversed">
          <div className="infographText" data-aos="fade-right">
            <p>
              Browse available lectures and educational content on the platform. Discover a variety
              of topics tailored to your interests and goals.
            </p>
          </div>
          <div className="infographImage" data-aos="fade-left">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M320,140 
       C200,100 100,200 180,320 
       C260,440 460,400 520,300 
       C580,200 620,240 660,180 
       C700,120 620,60 460,100 
       C400,120 360,160 320,140 
       Z"
                fill="#bae0ffaa"
              />
            </svg>

            <img src="/images/infographic_browse.png" alt="Infographic" />
          </div>
        </div>
        <div className="infographRow">
          <div className="infographImage" data-aos="fade-right">
            <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M280,90 
       C180,100 100,180 150,280 
       C200,380 320,360 380,310 
       C440,260 520,320 600,270 
       C680,220 640,140 560,110 
       C480,80 360,70 280,90 
       Z"
                fill="#bae0ffaa"
              />
            </svg>

            <img src="/images/infographic_manage.png" alt="Infographic" />
          </div>
          <div className="infographText" data-aos="fade-left">
            <p>
              Students can enroll in lectures and access pre-recorded materials like videos, PDFs,
              and more. Enhance your learning experience with our curated content.
            </p>
          </div>
        </div>
      </div>

      <section class="about-section" id="about">
        <div class="about-content">
          <h2>🎓 About Fillop</h2>
          <p>
            Fillop is a next-gen learning platform that empowers lecturers and students through a
            seamless academic experience. Whether you're uploading a lecture, taking an assessment,
            or discovering new courses, Fillop makes it all intuitive.
          </p>
          <ul>
            <li>
              <span>📤</span>
              <span>Lecturers can upload lectures in video, PDF, and more.</span>
            </li>
            <li>
              <span>📝</span>
              <span>Students participate in live and scheduled exams.</span>
            </li>
            <li>
              <span>🔗</span>
              <span>Social sharing tools for one-click lecture access.</span>
            </li>
            <li>
              <span>📚</span>
              <span>Courses, news, and services all in one dashboard.</span>
            </li>
          </ul>
        </div>
        <div class="about-image">
          <img
            src="/images/Woman_laptop2.svg"
            alt="Woman with Laptop"
            style={{transform: "scaleX(-1)"}}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

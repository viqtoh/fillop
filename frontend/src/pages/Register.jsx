import React, {useState} from "react";
import "../styles/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2";
import {API_URL} from "../constants";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = (message, success = true) => {
    setToast(message);
    setIsSuccess(success);

    setTimeout(() => setToast(null), 5000); // Hide after 5s
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = async () => {
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
      showToast("All fields are required!", false);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.ok) {
        showToast("User registered successfully!", true);
        // Redirect to login page
        window.location.href = "/login";
      } else {
        showToast(data.error || "Something went wrong", false);
      }
    } catch (error) {
      showToast("Server error, please try again later.", false);
    }

    setIsLoading(false);
  };

  return (
    <div className="limiter">
      {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
      <div className="container-login100">
        <div className="wrap-login100">
          <form
            className="login100-form sign100-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <span className="login100-form-title ftitle1">Start Learning Today!</span>
            <span className="login100-form-title ftitle2">
              Sign up and unlock a world of knowledge.
            </span>
            <span className="login100-form-logo signupLogo">
              <a href="#" class="navlogo mb-3">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  class="img-fluid"
                  style={{height: "150px"}}
                />
                <h2 class="nav-logotext">FILLOP TECH LTD</h2>
              </a>
            </span>

            <div className="wrap-input100 validate-input" data-validate="Enter email">
              <input
                className="input100"
                type="text"
                name="email"
                placeholder="  "
                value={formData.email}
                onChange={handleChange}
              />
              <label>Email</label>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Enter first name">
              <input
                className="input100"
                type="text"
                name="first_name"
                placeholder="  "
                value={formData.first_name}
                onChange={handleChange}
              />
              <label>First Name</label>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Enter last name">
              <input
                className="input100"
                type="text"
                name="last_name"
                placeholder="  "
                value={formData.last_name}
                onChange={handleChange}
              />
              <label>Last Name</label>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Enter password">
              <input
                className="input100"
                type="password"
                name="password"
                placeholder="  "
                value={formData.password}
                onChange={handleChange}
              />
              <label>Password</label>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Confirm password">
              <input
                className="input100"
                type="password"
                name="confirmPassword"
                placeholder="  "
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <label>Confirm Password</label>
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <span className="txt1  pe-2 inline-block">Already have an account?</span>
            <a onClick={() => navigate("/login")} href="#" className="txt2">
              Login
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

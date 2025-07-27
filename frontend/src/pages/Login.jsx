import React, {useState} from "react";
import "../styles/home.css";
import {API_URL} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2";
import "bootstrap-icons/font/bootstrap-icons.css";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const showToast = (message, success = true) => {
    setToast(message);
    setIsSuccess(success);

    setTimeout(() => setToast(null), 5000); // Hide after 5s
  };
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email") || "",
    password: ""
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    const error = localStorage.getItem("error");
    if (error) {
      showToast(error, false);
      localStorage.removeItem("error");
    }
  }, []);
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleLogin = async () => {
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      showToast("All fields are required!", false);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!data.error && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("email", formData.email);
        showToast("Login successful!", true);
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        if (next) {
          if (next.includes("lecturer")) {
            if (data.isLecturer) {
              window.location.href = next;
            } else {
              window.location.href = "/dashboard";
            }
          } else {
            if (!data.isLecturer) {
              window.location.href = next;
            } else {
              window.location.href = "/lecturer/dashboard";
            }
          }
        } else {
          if (data.isLecturer) {
            window.location.href = "/lecturer/dashboard";
          } else {
            window.location.href = next || "/dashboard";
          }
        }
      } else {
        showToast(data.error || "Something went wrong", false);
        if (data.error === "Email not verified.") {
          localStorage.setItem("optEmail", formData.email);
          localStorage.setItem("email", formData.email);
          navigate("/verify-email");
        }
      }
    } catch (error) {
      console.error(error);
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
            className="login100-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <span className="login100-form-logo">
              <a href="/" className="navlogo mb-3">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="img-fluid"
                  style={{height: "150px"}}
                />
                <h2 className="nav-logotext">FILLOP TECH</h2>
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

            <div className="wrap-input100 validate-input" data-validate="Enter password">
              <input
                className="input100"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="  "
                value={formData.password}
                onChange={handleChange}
              />
              <label>Password</label>
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  top: "25px",
                  right: "20px",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666"
                }}
              />
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <a onClick={() => navigate("/")} href="#" className="txt2">
              Forgot Password?
            </a>
            <br />

            <span className="txt1 me-2">Don’t have an account?</span>
            <a onClick={() => navigate("/register")} href="#" className="txt2">
              Sign up
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

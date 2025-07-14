import React, {useState} from "react";
import "../styles/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Toast from "../components/Toast2";
import {API_URL} from "../constants";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const showToast = (message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000);
  };

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    postal: "",
    city: "",
    qualification: "",
    field: "",
    institute: "",
    specialization: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = async () => {
    setIsLoading(true);

    const {
      email,
      first_name,
      last_name,
      password,
      confirmPassword,
      phone,
      address,
      postal,
      city,
      qualification,
      field,
      institute,
      specialization
    } = formData;

    if (!email || !first_name || !last_name || !password) {
      showToast("All required fields must be filled!", false);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", false);
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters!", false);
      setIsLoading(false);
      return;
    }

    const payload = {
      type: activeTab,
      email,
      first_name,
      last_name,
      password,
      phone,
      address,
      postal,
      city,
      qualification,
      isLecturer: activeTab !== "student",
      ...(activeTab === "student" ? {field} : {institute, specialization})
    };

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.ok) {
        showToast("Registered successfully!", true);
        window.location.href = "/login";
      } else {
        showToast(data.error || "Something went wrong", false);
      }
    } catch (error) {
      showToast("Server error, try again later.", false);
    }

    setIsLoading(false);
  };

  const renderCommonFields = () => (
    <>
      <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
      <Input
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
      />
      <Input
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
      />
      <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
      <Input
        label="Street Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      <Input label="Postal Code" name="postal" value={formData.postal} onChange={handleChange} />
      <Input label="City/State" name="city" value={formData.city} onChange={handleChange} />
      <Input
        label="Educational Qualification"
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
      />
    </>
  );

  const renderPasswordFields = () => (
    <>
      <Input
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={handleChange}
        iconClass={showPassword ? "bi-eye-slash" : "bi-eye"}
        onIconClick={() => setShowPassword((prev) => !prev)}
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={handleChange}
        iconClass={showConfirmPassword ? "bi-eye-slash" : "bi-eye"}
        onIconClick={() => setShowConfirmPassword((prev) => !prev)}
      />
    </>
  );

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
              <a href="#" className="navlogo mb-3">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="img-fluid"
                  style={{height: "150px"}}
                />
                <h2 className="nav-logotext">FILLOP TECH</h2>
              </a>
            </span>

            <div className="nav nav-tabs mb-3">
              <button
                type="button"
                className={`nav-link tabbtn ${activeTab === "student" ? "active" : ""}`}
                onClick={() => setActiveTab("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`nav-link tabbtn ${activeTab === "lecturer" ? "active" : ""}`}
                onClick={() => setActiveTab("lecturer")}
              >
                Lecturer
              </button>
            </div>

            {renderCommonFields()}
            {activeTab === "student" && (
              <Input
                label="Field of Study"
                name="field"
                value={formData.field}
                onChange={handleChange}
              />
            )}
            {activeTab === "lecturer" && (
              <>
                <Input
                  label="Institute"
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                />
                <Input
                  label="Area of Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </>
            )}

            {renderPasswordFields()}

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

            <span className="txt1 pe-2 inline-block">Already have an account?</span>
            <a onClick={() => navigate("/login")} href="#" className="txt2">
              Login
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable input component
const Input = ({label, name, value, onChange, type = "text", iconClass, onIconClick}) => (
  <div className="wrap-input100 validate-input" data-validate={`Enter ${label.toLowerCase()}`}>
    <input
      className="input100"
      type={type}
      name={name}
      placeholder="  "
      value={value}
      onChange={onChange}
    />
    <label>{label}</label>
    {iconClass && (
      <i
        className={`bi ${iconClass}`}
        onClick={onIconClick}
        style={{position: "absolute", right: "20px", top: "25px", cursor: "pointer"}}
      />
    )}
  </div>
);

export default Register;

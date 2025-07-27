import React, {useState, useEffect} from "react";

import "../styles/home.css";
import {API_URL} from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast2";
import {useNavigate} from "react-router-dom";

// This should match the cooldown period on your backend
const OTP_COOLDOWN_SECONDS = 60;

const formatCooldownTime = (totalSeconds) => {
  // Handle edge case of 0 or less
  if (totalSeconds <= 0) {
    return "0s";
  }

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Build the string parts
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  // Always show seconds if the duration is less than a minute,
  // or if there are leftover seconds with larger units.
  if (seconds > 0 || totalSeconds < 60) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
};

const VerifyOtp = () => {
  // We recommend passing the user's email via props

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- State for the Resend OTP feature ---
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const [isSending, setIsSending] = useState(true);
  const [toast, setToast] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("optEmail") || "");
  const [status, setStatus] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const showToast = (message, success = true) => {
    setToast(message);
    setIsSuccess(success);

    setTimeout(() => setToast(null), 5000); // Hide after 5s
  };

  const navigate = useNavigate();

  // --- Countdown Timer Logic ---
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    }
    // Cleanup the interval on component unmount or when cooldown reaches 0
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendOtp = async () => {
    setIsLoading(true);
    setIsSending(true);
    setStatus(true);
    if (!userEmail) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail
        })
      });

      const data = await response.json();
      if (data.timeLeft) {
        setResendCooldown(parseInt(data.timeLeft, 10));
      }
      if (data.ok) {
        showToast(data.message, true);
      } else {
        showToast(data.message || "Failed to send OTP.", false);
        if (!data.message) {
          setStatus(false);
        }
      }
    } catch (error) {
      showToast("Server error, please try again later.", false);
    } finally {
      setIsLoading(false);
      setIsSending(false);
    }
  };

  useEffect(() => {
    sendOtp();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    if (!userEmail) {
      navigate("/");
      return;
    }

    try {
      setVerifying(true);
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otp
        })
      });

      const data = await response.json();
      if (data.ok) {
        showToast(data.message, true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");
        localStorage.setItem("email", userEmail);
        localStorage.removeItem("optEmail");
        navigate("/dashboard");
      } else {
        showToast(data.error || "Failed to send OTP.", false);
      }
    } catch (error) {
      showToast("Server error, please try again later.", false);
    } finally {
      setIsLoading(false);
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return; // Prevent multiple clicks

    setIsResending(true);

    try {
      await sendOtp();
    } catch (err) {
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="limiter">
      {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
      <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="card-title text-center mb-2">Verify Your Account</h2>

              {status === true &&
                (isSending ? (
                  <p className="card-subtitle text-center text-muted mb-4">Sending OTP...</p>
                ) : (
                  <p className="card-subtitle text-center text-muted mb-4">
                    An OTP has been sent to <br /> <strong>{userEmail}</strong>
                  </p>
                ))}
              {status === false && (
                <p className="text-danger text-center">
                  Failed to send OTP. Please try again later.
                </p>
              )}
              {status === true &&
                (isSending ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* OTP Input and Verify Button (same as before) */}
                    <div className="mb-3">
                      <input
                        type="text"
                        id="otp-input"
                        className="form-control form-control-lg text-center"
                        value={otp}
                        onChange={handleInputChange}
                        placeholder="------"
                        maxLength="6"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                  </form>
                ))}

              {/* --- RESEND OTP SECTION (UPDATED) --- */}
              {!isSending && (
                <div className="text-center mt-4">
                  {status && <p className="text-muted mb-2">Didn't receive the code?</p>}
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleResendOtp}
                    disabled={isResending || resendCooldown > 0}
                  >
                    {(isResending || isLoading) && !verifying
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend OTP in ${formatCooldownTime(resendCooldown)}`
                      : "Resend OTP"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

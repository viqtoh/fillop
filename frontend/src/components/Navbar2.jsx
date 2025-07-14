import {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from "react-router-dom";

const navItems = [
  {
    label: "Home",
    link: "/"
  },
  {
    label: "Services",
    link: "/services"
  },
  {
    label: "Education",
    link: "/education"
  },
  {
    label: "News",
    link: "/news"
  },
  {label: "About Us", link: "/about"},
  {label: "Contact Us", link: "/contact"},
  {
    label: "Login",
    link: "/login",
    type: "button"
  }
];

const Navbar2 = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // The renderMenuItems function is not used with the current flat navItems structure.
  // It's typically for rendering nested lists (sub-menus). Removing it for clarity.

  return (
    <header className="nav2 text-white p-3 ">
      <div className="nav2con container d-flex align-items-center justify-content-between py-3">
        <a href="/" className="navlogo">
          <img
            src="/images/logo_text.png"
            alt="Logo"
            className="img-fluid mnavlogo"
            style={{height: "130px"}}
          />
        </a>

        {/* Desktop Navigation Links */}
        {/* Visible from medium screens up (d-md-flex) and hidden on smaller screens (d-none) */}
        {/* Uses gap-4 for spacing between items */}
        <nav className="d-none d-md-flex align-items-center gap-4 limNav justify-content-evenly">
          {navItems.map((item, i) => (
            <div key={i} className={`${item.type !== "button" && "mynavlink"}`}>
              {item.type === "button" ? (
                <button onClick={() => navigate(item.link)} className="btn nav-btn">
                  {item.label}
                </button>
              ) : (
                <a
                  // Use onClick with navigate for client-side routing
                  onClick={() => navigate(item.link)}
                  className="fw-bold text-decoration-none text-white nav-link"
                  style={{cursor: "pointer"}} // Indicate it's clickable
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Hamburger Menu and Dropdown */}
        {/* Visible only on screens smaller than medium (d-md-none) */}
        <div className="d-md-none">
          <button className="btn btn-outline-light ham2" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className="nav2menu text-light p-3">
              {/* Note: For a proper mobile overlay, nav2menu typically needs absolute positioning,
                  a background color, and z-index to cover content. */}
              {navItems.map((item, i) => (
                <div key={i} className="mb-3">
                  {item.type === "button" ? (
                    <button
                      onClick={() => {
                        navigate(item.link);
                        setMenuOpen(false); // Close menu after navigation
                      }}
                      className="btn nav-btn"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      onClick={() => {
                        navigate(item.link);
                        setMenuOpen(false); // Close menu after navigation
                      }}
                      className="fw-bold text-decoration-none text-light"
                      style={{cursor: "pointer"}}
                    >
                      {item.label}
                    </a>
                  )}
                  {/* item.children (for sub-menus) is not present in the current navItems structure */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar2;

import {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const navItems = [
  {
    label: "Home",
    link: "/"
  },
  {
    label: "Services",
    link: "#"
  },
  {
    label: "Education",
    link: "#"
  },
  {
    label: "News",
    link: "#"
  },
  {label: "About Us", link: "/about"},
  {label: "Contact Us", link: "/contact"},
  {
    label: "Login",
    link: "#",
    type: "button"
  }
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderMenuItems = (items) => (
    <ul className="list-unstyled ps-3">
      {items.map((item, index) => (
        <li key={index}>
          {item.type === "button" ? (
            <button className="btn nav-btn">{item.label}</button>
          ) : (
            <div className="fw-bold text-dark">
              {item.label}
              {item.children && renderMenuItems(item.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <header className="p-3 ">
      <div className="container d-flex align-items-center justify-content-between py-3 ms-lg-5 ms-0">
        <a href="/" className="navlogo">
          <img
            src="images/logo.png"
            alt="Open Edx Logo"
            className="img-fluid"
            style={{height: "100px"}}
          />
          <h2 className="nav-logotext">FILLOP TECH LTD</h2>
          <p className="nav-logosubtext">...simplifying your tech world</p>
        </a>
        <button className="btn btn-outline-light d-lg-none" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <nav className="d-none d-lg-flex gap-3 nav1">
          {navItems.map((item, i) => (
            <div key={i} className="position-relative">
              {item.type === "button" ? (
                <button className="btn nav-btn">{item.label}</button>
              ) : (
                <a href={item.link || "#"} className=" text-decoration-none fw-medium">
                  {item.label}
                </a>
              )}
              {item.children && (
                <div className="dropdown-menu shadow mt-2">{renderMenuItems(item.children)}</div>
              )}
            </div>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <div className="d-lg-none p-3 nav1">
          {navItems.map((item, i) => (
            <div key={i} className="mb-3">
              {item.type === "button" ? (
                <button className="btn nav-btn">{item.label}</button>
              ) : (
                <a href={item.link || "#"} className="fw-bold text-decoration-none">
                  {item.label}
                </a>
              )}
              {item.children && renderMenuItems(item.children)}
            </div>
          ))}
        </div>
      )}

      <div className="breadcrumb-bg-curve">
        <img src="/images/curve-5.png" alt="" />
      </div>
    </header>
  );
};

export default Navbar;

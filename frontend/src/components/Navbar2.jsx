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
  {label: "Contact Us", link: "#"},
  {
    label: "Login",
    link: "#",
    type: "button"
  }
];

const Navbar2 = () => {
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
    <header className="nav2 text-white p-3 ">
      <div className="nav2con container d-flex align-items-center justify-content-between py-3">
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
        <div>
          <button className="btn btn-outline-light ham2" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className="nav2menu text-light p-3">
              {navItems.map((item, i) => (
                <div key={i} className="mb-3">
                  {item.type === "button" ? (
                    <button className="btn nav-btn">{item.label}</button>
                  ) : (
                    <a href={item.link || "#"} className="fw-bold text-decoration-none text-light">
                      {item.label}
                    </a>
                  )}
                  {item.children && renderMenuItems(item.children)}
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

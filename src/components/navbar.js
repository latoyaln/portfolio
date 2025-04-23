import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const links = [
    { label: "Home", url: "/" },
    { label: "Projects", url: "/projects" },
    { label: "About", url: "/about" },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${hours}:${paddedMinutes} ${ampm}`);
    };

    const timer = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="bg-midnight flex justify-between items-center px-10 py-10 text-daylight font-body text-smalllabel relative">
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/">
          <img src="/assets/LN-Logo-light.webp" alt="LN Design Logo" className="pr-10 h-10" />
        </Link>
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.url}
            onClick={() => setIsOpen(false)}
            className={`link-swap inline-block delay-[${i * 75}ms]`}
            data-replace={link.label}
          >
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="flex-0 left-0 right-0 flex justify-center items-center text-sm">
        <p>Based in Amsterdam</p>
        <span className="pl-2">{currentTime}</span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => (window.location.href = "mailto:l.n.design@hotmail.com")}
          className="hidden md:inline-block border-2 border-daylight text-daylight px-4 py-2 rounded-lg relative overflow-hidden bg-transparent hover:bg-daylight hover:text-black transition-all"
        >
          Contact Me
        </button>
        <button
          className="md:hidden border-2 border-daylight text-daylight px-4 py-2 rounded-lg relative overflow-hidden bg-transparent hover:bg-daylight hover:text-black transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close ✕" : "Menu ☰"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 w-full bg-midnight text-daydream text-center py-4 md:hidden">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.url}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-lg"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => (window.location.href = "mailto:l.n.design@hotmail.com")}
            className="mt-4 inline-block bg-daylight text-midnight px-4 py-2 rounded-lg hover:scale-110 transition transform"
          >
            Contact Me
          </button>
          <div className="mt-6">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <img
                src="/assets/LN-Logo-light.webp"
                alt="Logo"
                className="mx-auto h-8"
              />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocalization } from "../contexts/LocalizationContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { currentLocale, switchLanguage, getLocalizedPath } = useLocalization();

  const links = [
    { label: currentLocale === 'nl' ? 'Home' : 'Home', url: "/" },
    { label: currentLocale === 'nl' ? 'Projecten' : 'Projects', url: "/projects" },
    { label: currentLocale === 'nl' ? 'Over' : 'About', url: "/about" },
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

  const handleLanguageSwitch = (locale) => {
    switchLanguage(locale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-midnight flex justify-between items-center px-4 md:px-10 py-4 text-daylight font-body text-smalllabel">
        <div className="hidden md:flex items-center space-x-4">
          <Link to={getLocalizedPath("/")}>
            <img src="/assets/LN-Logo-light.webp" alt="LN Design Logo" className="pr-10 h-10" />
          </Link>
          {links.map((link, i) => (
            <Link
              key={i}
              to={getLocalizedPath(link.url)}
              onClick={() => setIsOpen(false)}
              className={`link-swap inline-block delay-[${i * 75}ms]`}
              data-replace={link.label}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center text-sm">
          <p className="hidden md:inline">{currentLocale === 'nl' ? 'Gevestigd in Amsterdam' : 'Based in Amsterdam'}</p>
          <p className="md:hidden">{currentLocale === 'nl' ? 'Amsterdam' : 'Amsterdam'}</p>
          <span className="pl-2">{currentTime}</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <button
              onClick={() => handleLanguageSwitch('nl')}
              className={`px-2 py-1 text-sm font-medium transition-colors ${
                currentLocale === 'nl' 
                  ? 'text-daylight border-b border-daylight' 
                  : 'text-daylight/60 hover:text-daylight'
              }`}
            >
              NL
            </button>
            <span className="text-daylight/40">|</span>
            <button
              onClick={() => handleLanguageSwitch('en-US')}
              className={`px-2 py-1 text-sm font-medium transition-colors ${
                currentLocale === 'en-US' 
                  ? 'text-daylight border-b border-daylight' 
                  : 'text-daylight/60 hover:text-daylight'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => (window.location.href = "mailto:l.n.design@hotmail.com")}
            className="hidden md:inline-block border-2 border-daylight text-daylight px-4 py-2 rounded-lg relative overflow-hidden bg-transparent hover:bg-daylight hover:text-black transition-all"
          >
            {currentLocale === 'nl' ? 'Contact' : 'Contact Me'}
          </button>
          
          <button
            className="md:hidden border-2 border-daylight text-daylight px-4 py-2 rounded-lg relative overflow-hidden bg-transparent hover:bg-daylight hover:text-black transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Close ✕" : "Menu ☰"}
          </button>
        </div>

        {isOpen && (
          <div className="fixed top-[72px] left-0 right-0 w-full bg-midnight text-daydream text-center py-4 md:hidden z-[99] shadow-lg">
            {/* Mobile Language Toggle */}
            <div className="flex justify-center space-x-4 mb-4 border-b border-daylight/20 pb-4">
              <button
                onClick={() => handleLanguageSwitch('nl')}
                className={`px-3 py-1 text-lg transition-colors ${
                  currentLocale === 'nl' 
                    ? 'text-daylight border-b border-daylight font-bold' 
                    : 'text-daylight/60'
                }`}
              >
                NL
              </button>
              <span className="text-daylight/40">|</span>
              <button
                onClick={() => handleLanguageSwitch('en-US')}
                className={`px-3 py-1 text-lg transition-colors ${
                  currentLocale === 'en-US' 
                    ? 'text-daylight border-b border-daylight font-bold' 
                    : 'text-daylight/60'
                }`}
              >
                EN
              </button>
            </div>
            
            {links.map((link, i) => (
              <Link
                key={i}
                to={getLocalizedPath(link.url)}
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
              {currentLocale === 'nl' ? 'Contact' : 'Contact Me'}
            </button>
            
            <div className="mt-6">
              <Link to={getLocalizedPath("/")} onClick={() => setIsOpen(false)}>
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
      {/* Add padding to prevent content from hiding under fixed navbar */}
      <div className="h-[72px]"></div>
    </div>
  );
};

export default Navbar;
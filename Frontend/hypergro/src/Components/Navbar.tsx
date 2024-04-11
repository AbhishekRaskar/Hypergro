import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Search, Menu } from "react-feather";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className={`${darkMode ? "bg-gray-900" : "bg-white"} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className={`text-${darkMode ? "white" : "black"} text-3xl font-bold`}
            >
              VideoClone
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              <Menu className={`text-${darkMode ? "white" : "black"} w-6 h-6`} />
            </button>
          </div>

          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`text-${darkMode ? "white" : "gray-700"} hover:text-${darkMode ? "gray-300" : "gray-900"} px-3 py-2 rounded-md text-lg font-medium`}
            >
              Home
            </Link>
            <Link
              to="/liked"
              className={`text-${darkMode ? "white" : "gray-700"} hover:text-${darkMode ? "gray-300" : "gray-900"} px-3 py-2 rounded-md text-lg font-medium`}
            >
              Liked
            </Link>
            <Link
              to="/saved"
              className={`text-${darkMode ? "white" : "gray-700"} hover:text-${darkMode ? "gray-300" : "gray-900"} px-3 py-2 rounded-md text-lg font-medium`}
            >
              Saved
            </Link>
          </div>

          {/* Mobile */}
          <div className={`${showMenu ? "block" : "hidden"} md:hidden absolute top-16 left-0 w-full bg-${darkMode ? "gray" : "white"}-900`}>
            <div className="flex flex-col space-y-4 p-4">
              <Link
                to="/"
                className={`text-${darkMode ? "white" : "black"} hover:text-${darkMode ? "gray-300" : "gray-700"} text-lg font-medium`}
              >
                Home
              </Link>
              <Link
                to="/liked"
                className={`text-${darkMode ? "white" : "black"} hover:text-${darkMode ? "gray-300" : "gray-700"} text-lg font-medium`}
              >
                Liked
              </Link>
              <Link
                to="/saved"
                className={`text-${darkMode ? "white" : "black"} hover:text-${darkMode ? "gray-300" : "gray-700"} text-lg font-medium`}
              >
                Saved
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 hidden md:flex">
            <input
              type="text"
              placeholder="Search"
              className={`border border-${darkMode ? "gray" : "blue"}-500 px-3 py-1 rounded-md`}
            />
            <Search
              className={`text-${darkMode ? "gray" : "blue"}-500 w-5 h-5 mt-2 ml-2`}
            />
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`bg-${darkMode ? "gray" : "white"}-500 hover:bg-${darkMode ? "gray" : "white"}-600 text-white font-bold py-2 px-4 rounded-full`}
            >
              {!darkMode ? (
                <Sun className="text-yellow-500 w-6 h-6" />
              ) : (
                <Moon className="text-gray-500 w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

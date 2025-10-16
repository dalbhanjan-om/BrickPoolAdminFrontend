import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "./useSidebar";
import { useAuthActions } from "../services/authActions";
import { LogOut, User,  KeyRound } from "lucide-react";
import logo from "../assets/logo.png";

const AppHeader: React.FC = () => {
  const {
    isMobileOpen,
    isSidebarOpen,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();
  const { logout} = useAuthActions();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sidebar toggle logic
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // Focus search with Ctrl/⌘ + K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      // Optional: Escape clears input
      if (event.key === "Escape") {
        inputRef.current?.blur();
        inputRef.current!.value = "";
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle dropdown actions
  const handleChangePassword = () => {
    setIsDropdownOpen(false);
    navigate("/change-password");
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  // Sidebar width: open = 256px (w-64), closed = 80px (w-20)
  const marginLeft = isSidebarOpen ? "lg:ml-64" : "lg:ml-20";

  return (
    <header
      className={`sticky top-0 flex w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900/95 z-50 transition-all duration-200 ${marginLeft}`}
    >
      <div className="flex items-center justify-between w-full px-4 py-3 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle button */}
          <button
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:border-gray-600 lg:h-11 lg:w-11 lg:hidden transition-all duration-200"
            aria-label="Toggle Sidebar"
          >
            {/* Desktop icon (hidden on large screens) */}
            <span className="hidden lg:inline text-xl">
              {isSidebarOpen ? "✖" : "☰"}
            </span>
            {/* Mobile icon */}
            <span className="lg:hidden text-xl">
              {isMobileOpen ? "✖" : "☰"}
            </span>
          </button>

          {/* Logo for mobile */}
          <a href="/" className="lg:hidden flex items-center gap-2">
            <img src={logo} alt="Brickpool" className="h-8 dark:hidden" />
            <img src={logo} alt="Brickpool" className="hidden h-8 dark:block" />
            <span className="text-xl font-bold text-blue-900 dark:text-white">BrickPool</span>
          </a>
        </div>

        {/* Center Section: Search (hidden on mobile) */}
        <div className="hidden lg:flex items-center px-6 w-full justify-center">
          <form
            role="search"
            className="relative w-full max-w-screen-lg"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Label for accessibility */}
            <label htmlFor="search-bar" className="sr-only">
              Search
            </label>

            {/* Input */}
            <input
              ref={inputRef}
              id="search-bar"
              type="text"
              placeholder="Search or type command..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-14 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
              autoComplete="off"
            />

            {/* Search Icon */}
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Search"
            >
              🔍
            </button>

            {/* Shortcut hint */}
            <div
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 select-none dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 transition-all duration-200"
              aria-hidden="true"
            >
              ⌘ K
            </div>
          </form>
        </div>

        {/* Right Section: User Dropdown */}
        <div className="flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="User menu"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                <button
                  onClick={handleChangePassword}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  Change Password
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

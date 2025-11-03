

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./useSidebar";
import logo from "../assets/logo.png";
import { Users, Briefcase, Layers, Home, MapPinHouse } from "lucide-react";

const navItems = [
  { label: "Overview", icon: <Home className="w-5 h-5" />,route: "/overview" },
  { label: "Buyers", icon: <Users className="w-5 h-5" />,route: "/buyers" },
  { label: "Brokers", icon: <Briefcase className="w-5 h-5" />,route: "/brokers" },
  { label: "Pools", icon: <Layers className="w-5 h-5" />,route: "/pools" },
  { label: "Property Interests", icon: <MapPinHouse className="w-5 h-5" />,route: "/property-interests" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const {
    isSidebarOpen,
    isMobileOpen,
    toggleSidebar,
    closeMobileSidebar,
  } = useSidebar();

  // Desktop width when open/closed
  const desktopWidthClass = isSidebarOpen ? "lg:w-64" : "lg:w-20";

  // Close mobile sidebar on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        closeMobileSidebar();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobileOpen, closeMobileSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          isMobileOpen
            ? "opacity-40 bg-black pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileSidebar}
        aria-hidden={!isMobileOpen}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          bg-white border-r border-gray-100 dark:bg-gray-900 dark:border-gray-800
          transform transition-all duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          lg:translate-x-0 ${desktopWidthClass}
        `}
      >
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <img src={logo} alt="logo" className="h-8 w-8" />
          <span
            className={`font-semibold text-lg text-gray-800 dark:text-white ${
              !isSidebarOpen ? "lg:hidden" : ""
            }`}
          >
           BrickPool
          </span>

          {/* Mobile close */}
          <button
            onClick={closeMobileSidebar}
            className="ml-auto lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            ✖
          </button>

          {/* Desktop collapse */}
          <button
            onClick={toggleSidebar}
            className="hidden ml-auto lg:inline-flex items-center justify-center h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div
            className={`flex flex-col gap-1 ${
              !isSidebarOpen ? "lg:items-center" : ""
            }`}
          >
            {navItems.map((item) => {
              const path = item.route;
              const isActive = location.pathname === path;
              return (
                <Link
                  key={item.label}
                  to={path}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                    ${isActive ? "bg-gray-200 dark:bg-gray-800 font-semibold" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}
                    ${!isSidebarOpen ? "lg:justify-center" : ""}`}
                  style={{ width: "100%" }}
                >
                  <span className="text-xl w-6 text-center">{item.icon}</span>
                  <span className={`${!isSidebarOpen ? "lg:hidden" : ""}`}>
                    {item.label}
                  </span>
                  {isSidebarOpen && (
                    <span className="ml-auto text-xs text-gray-400 lg:block hidden">
                      ▾
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div
          className={`px-4 py-4 border-t border-gray-100 dark:border-gray-800 ${
            !isSidebarOpen ? "lg:items-center lg:flex lg:justify-center" : ""
          }`}
        >
          <div
            className={`flex items-center gap-3 w-full ${
              !isSidebarOpen ? "lg:justify-center" : ""
            }`}
          >
            <img
              src={logo}
              alt="logo"
              className={`h-6 w-6 ${!isSidebarOpen ? "" : "lg:hidden"}`}
            />
            <div
              className={`text-xs text-gray-500 dark:text-gray-400 ${
                !isSidebarOpen ? "lg:hidden" : ""
              }`}
            >
              © {new Date().getFullYear()} BrickPool
            </div>
            {isSidebarOpen ? null : (
              <div className="text-sm text-gray-400 lg:block hidden">⋯</div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer removed to prevent layout issues */}
    </>
  );
};

export default Sidebar;

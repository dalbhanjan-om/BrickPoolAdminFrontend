import { createContext, useContext, useState, type ReactNode } from "react";

type SidebarContextType = {
  isMobileOpen: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const openMobileSidebar = () => setMobileOpen(true);
  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
        openSidebar,
        closeSidebar,
        openMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be inside SidebarProvider");
  return context;
};

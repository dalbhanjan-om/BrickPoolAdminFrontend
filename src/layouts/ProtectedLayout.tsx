import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import { SidebarProvider, useSidebar } from './useSidebar';
import Sidebar from './Sidebar';
import BuyerLayout from '../pages/Buyers/BuyerLayout';
import BrokerLayout from '../pages/Brokers/BrokerLayout';
import PoolLayout from '../pages/Pools/PoolLayout';
import OverviewLayout from '../pages/Overview/OverviewLayout';
import ChangePassword from '../pages/Auth/changePassword';
import PropertyInterest from '../pages/PropertyInterest/PropertyInterest';

const MainContent: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  
  // Sidebar width: open = 256px (w-64), closed = 80px (w-20)
  const marginLeft = isSidebarOpen ? "lg:ml-64" : "lg:ml-20";

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main className={`flex-1 min-w-0 p-4 lg:p-6 transition-all duration-200 ${marginLeft}`}>
        <Routes>
          <Route path="/buyers" element={<BuyerLayout />} />
          <Route path="/brokers" element={<BrokerLayout />} />
          <Route path="/pools" element={<PoolLayout />} />
          <Route path="/property-interests" element={<PropertyInterest />} />


          <Route path="/overview" element={<OverviewLayout />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const ProtectedLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
        <AppHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;

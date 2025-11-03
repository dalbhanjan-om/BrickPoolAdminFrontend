import React from 'react';
import PoolCard from './components/PoolCard';

type Pool = {
  id: string;
  name: string;
  city: string;
  buyerCount: number;
};

const mockPools: Pool[] = [
  { id: '1', name: 'Downtown Premium', city: 'Pune', buyerCount: 18 },
  { id: '2', name: 'Harbor View', city: 'Mumbai', buyerCount: 9 },
  { id: '3', name: 'Lakefront Collective', city: 'Nashik', buyerCount: 12 },
  { id: '4', name: 'Uptown Select', city: 'Pune', buyerCount: 7 },
  { id: '5', name: 'Golden Gate Estates', city: 'Thane', buyerCount: 15 },
  { id: '6', name: 'Nagpur Central', city: 'Nagpur', buyerCount: 22 },
];

const PoolLayout: React.FC = () => {
  const [selectedCity, setSelectedCity] = React.useState<string>('All');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 8;

  const cities = React.useMemo(() => {
    return ['All', 'Pune', 'Nagpur', 'Mumbai', 'Nashik', 'Thane'];
  }, []);

  const filteredPools = React.useMemo(() => {
    const list = selectedCity === 'All' ? mockPools : mockPools.filter((p) => p.city === selectedCity);
    return list;
  }, [selectedCity]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity]);

  const totalItems = filteredPools.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedPools = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPools.slice(start, start + pageSize);
  }, [filteredPools, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003366]">Pools</h1>
          <p className="text-sm text-[#003366]/70">Browse pools and filter by city</p>
        </div>
      </div>

      <div className="sm:hidden">
        <label htmlFor="city" className="sr-only">City</label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full rounded-lg border border-[#003366]/30 bg-white px-3 py-2 text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]/40"
        >
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:flex flex-wrap gap-2">
        {cities.map((city) => {
          const isActive = selectedCity === city;
          return (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={
                `px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150 ` +
                (isActive
                  ? 'bg-[#003366] text-white border-[#003366]'
                  : 'bg-white text-[#003366] border-[#003366]/30 hover:border-[#003366] hover:bg-[#003366]/5')
              }
            >
              {city}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {paginatedPools.map((pool) => (
          <PoolCard key={pool.id} name={pool.name} buyerCount={pool.buyerCount} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="order-2 sm:order-1 w-full sm:w-auto">
          <p className="text-xs sm:text-sm text-[#003366]/70 text-center sm:text-left">
            Showing {(totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1)}-
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
          </p>
        </div>
        <div className="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2">
          <button
            aria-label="Previous page"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-full text-sm border transition-colors duration-150 ${currentPage === 1 ? 'text-[#003366]/40 border-[#003366]/20 cursor-not-allowed' : 'text-[#003366] border-[#003366]/30 hover:border-[#003366] hover:bg-[#003366]/5'}`}
          >
            <span className="sm:hidden">‹</span>
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="hidden sm:inline text-sm text-[#003366]/80">
            Page {currentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-full text-sm border transition-colors duration-150 ${currentPage === totalPages ? 'text-[#003366]/40 border-[#003366]/20 cursor-not-allowed' : 'text-[#003366] border-[#003366]/30 hover:border-[#003366] hover:bg-[#003366]/5'}`}
          >
            <span className="sm:hidden">›</span>
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolLayout
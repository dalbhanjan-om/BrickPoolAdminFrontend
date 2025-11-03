import React from 'react';

type Broker = {
  id: string;
  name: string;
  city: string;
};

const mockBrokers: Broker[] = [
  { id: 'b1', name: 'Aditi Sharma', city: 'Pune' },
  { id: 'b2', name: 'Rahul Mehta', city: 'Mumbai' },
  { id: 'b3', name: 'Neha Patil', city: 'Nashik' },
  { id: 'b4', name: 'Aarav Kulkarni', city: 'Pune' },
  { id: 'b5', name: 'Priya Desai', city: 'Thane' },
  { id: 'b6', name: 'Rohan Joshi', city: 'Nagpur' },
  { id: 'b7', name: 'Ishita Rao', city: 'Mumbai' },
  { id: 'b8', name: 'Kunal Verma', city: 'Thane' },
];

const BrokerCard: React.FC<Pick<Broker, 'name' | 'city'>> = ({ name, city }) => {
  return (
    <div className="rounded-lg border border-[#003366]/15 bg-white transition-colors duration-150 hover:border-[#003366]/30 focus-within:border-[#003366]/40">
      <div className="p-4">
        <h3 className="text-[15px] sm:text-base font-semibold text-[#003366] leading-snug truncate" title={name}>{name}</h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[#003366]/75 truncate">{city}</p>
      </div>
    </div>
  );
};

const BrokerLayout: React.FC = () => {
  const [selectedCity, setSelectedCity] = React.useState<string>('All');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 8;

  const cities = React.useMemo(() => {
    return ['All', 'Pune', 'Nagpur', 'Mumbai', 'Nashik', 'Thane'];
  }, []);

  const filteredBrokers = React.useMemo(() => {
    const list = selectedCity === 'All' ? mockBrokers : mockBrokers.filter((b) => b.city === selectedCity);
    return list;
  }, [selectedCity]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity]);

  const totalItems = filteredBrokers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedBrokers = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrokers.slice(start, start + pageSize);
  }, [filteredBrokers, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003366]">Brokers</h1>
          <p className="text-sm text-[#003366]/70">Browse brokers and filter by city</p>
        </div>
      </div>

      <div className="sm:hidden">
        <label htmlFor="broker-city" className="sr-only">City</label>
        <select
          id="broker-city"
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
        {paginatedBrokers.map((broker) => (
          <BrokerCard key={broker.id} name={broker.name} city={broker.city} />
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
}

export default BrokerLayout
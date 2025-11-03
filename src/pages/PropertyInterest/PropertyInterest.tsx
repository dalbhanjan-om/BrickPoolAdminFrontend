import React from 'react';

type Property = {
  id: string;
  propertyType: string;
  location: string; // city
  price: number; // INR assumed
};

const mockProperties: Property[] = [
  { id: 'p1', propertyType: 'Apartment', location: 'Pune', price: 8500000 },
  { id: 'p2', propertyType: 'Villa', location: 'Mumbai', price: 24500000 },
  { id: 'p3', propertyType: 'Plot', location: 'Nashik', price: 4200000 },
  { id: 'p4', propertyType: 'Apartment', location: 'Pune', price: 9800000 },
  { id: 'p5', propertyType: 'Office Space', location: 'Thane', price: 16500000 },
  { id: 'p6', propertyType: 'Shop', location: 'Nagpur', price: 5600000 },
  { id: 'p7', propertyType: 'Villa', location: 'Mumbai', price: 31500000 },
  { id: 'p8', propertyType: 'Apartment', location: 'Thane', price: 10500000 },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const PropertyCard: React.FC<Pick<Property, 'propertyType' | 'location' | 'price'>> = ({ propertyType, location, price }) => {
  return (
    <div className="rounded-lg border border-[#003366]/15 bg-white transition-colors duration-150 hover:border-[#003366]/30 focus-within:border-[#003366]/40">
      <div className="p-4">
        <h3 className="text-[15px] sm:text-base font-semibold text-[#003366] leading-snug truncate" title={propertyType}>{propertyType}</h3>
        <p className="mt-1 text-xs sm:text-sm text-[#003366]/75 truncate">{location}</p>
        <p className="mt-2 text-sm sm:text-[15px] font-medium text-[#003366]">{formatINR(price)}</p>
      </div>
    </div>
  );
};

const PropertyInterest: React.FC = () => {
  const [selectedCity, setSelectedCity] = React.useState<string>('All');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 8;

  const cities = React.useMemo(() => {
    return ['All', 'Pune', 'Nagpur', 'Mumbai', 'Nashik', 'Thane'];
  }, []);

  const filteredProperties = React.useMemo(() => {
    const list = selectedCity === 'All' ? mockProperties : mockProperties.filter((p) => p.location === selectedCity);
    return list;
  }, [selectedCity]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity]);

  const totalItems = filteredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedProperties = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003366]">Property Interests</h1>
          <p className="text-sm text-[#003366]/70">Browse properties and filter by city</p>
        </div>
      </div>

      <div className="sm:hidden">
        <label htmlFor="property-city" className="sr-only">City</label>
        <select
          id="property-city"
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
        {paginatedProperties.map((prop) => (
          <PropertyCard key={prop.id} propertyType={prop.propertyType} location={prop.location} price={prop.price} />
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

export default PropertyInterest
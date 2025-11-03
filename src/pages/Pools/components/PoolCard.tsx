import React from 'react';

type PoolCardProps = {
  name: string;
  buyerCount: number;
};

const PoolCard: React.FC<PoolCardProps> = ({ name, buyerCount }) => {
  return (
    <div
      className="rounded-lg border border-[#003366]/15 bg-white transition-colors duration-150 hover:border-[#003366]/30 focus-within:border-[#003366]/40"
      role="article"
      aria-label={`Pool ${name} with ${buyerCount} ${buyerCount === 1 ? 'buyer' : 'buyers'}`}
      tabIndex={0}
    >
      <div className="p-4">
        <h3 className="text-[15px] sm:text-base font-semibold text-[#003366] leading-snug truncate" title={name}>{name}</h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[#003366]/75">
          {buyerCount} {buyerCount === 1 ? 'Buyer' : 'Buyers'}
        </p>
      </div>
    </div>
  );
};

export default PoolCard;



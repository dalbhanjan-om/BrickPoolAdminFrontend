import React, { useState, useEffect } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import overviewApiService from '../../services/OverviewApiService'

interface CounterCardProps {
  title: string
  value: number
  icon: string
  iconBg: string
}


const CounterCard: React.FC<CounterCardProps> = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-semibold text-slate-800">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

const OverviewLayout = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [stats, setStats] = useState({
    totalBuyers: 0,
    totalBrokers: 0,
    totalPropertyInterests: 0
  })
  const [cityData, setCityData] = useState({
    cities: [] as string[],
    buyersCount: [] as number[],
    brokerCount: [] as number[],
    propertyInterestCount: [] as number[]
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch total counts
        const [totalBuyers, totalBrokers, totalPropertyRequirements] = await Promise.all([
          overviewApiService.getTotalBuyersCount(),
          overviewApiService.getTotalBrokersCount(),
          overviewApiService.getTotalPropertyRequirementsCount()
        ])

        setStats({
          totalBuyers,
          totalBrokers,
          totalPropertyInterests: totalPropertyRequirements
        })

        // Always include these cities
        const defaultCities = ["Pune", "Nagpur", "Mumbai", "Thane", "Nashik"];
        // Fetch all buyers to get city data
        const allBuyers = await overviewApiService.getAllBuyers()
        // Get unique cities from buyers data and merge with default cities
        const uniqueCities = Array.from(new Set([
          ...defaultCities,
          ...allBuyers.map(buyer => buyer.cityName && typeof buyer.cityName === 'string' ? buyer.cityName.trim() : '')
        ].filter(Boolean)));

        // Fetch counts for each city (even if zero)
        const cityCounts = await Promise.all(
          uniqueCities.map(async (city) => {
            const [buyerCount, brokerCount] = await Promise.all([
              overviewApiService.getBuyerCountFromCity(city),
              overviewApiService.getBrokerCountFromCity(city)
            ])
            return {
              city,
              buyerCount: buyerCount || 0,
              brokerCount: brokerCount || 0,
              propertyInterestCount: (buyerCount || 0) + (brokerCount || 0)
            }
          })
        );

        // Sort cities alphabetically for consistent display
        cityCounts.sort((a, b) => a.city.localeCompare(b.city));

        setCityData({
          cities: cityCounts.map(item => item.city),
          buyersCount: cityCounts.map(item => item.buyerCount),
          brokerCount: cityCounts.map(item => item.brokerCount),
          propertyInterestCount: cityCounts.map(item => item.propertyInterestCount)
        });

      } catch (err) {
        console.error('Error fetching overview data:', err)
        setError('Failed to load data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading overview data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white">
      <div className="p-6 h-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <CounterCard 
            title="Total Buyers" 
            value={stats.totalBuyers} 
            icon="👥"
            iconBg="bg-blue-600"
          />
          <CounterCard 
            title="Total Brokers" 
            value={stats.totalBrokers} 
            icon="🏢"
            iconBg="bg-emerald-500"
          />
          <CounterCard 
            title="Property Interests" 
            value={stats.totalPropertyInterests} 
            icon="🏠"
            iconBg="bg-indigo-600"
          />
        </div>

        {/* City-wise Data Chart */}
        {cityData.cities.length > 0 && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Place your chart component here. If you use a chart library, ensure it fills the parent div. */}
              <BarChart
                xAxis={[{ data: cityData.cities }]}
                series={[
                  { 
                    data: cityData.buyersCount, 
                    label: 'Buyers',
                    color: '#2563EB',
                    stack: 'total'
                  }, 
                  { 
                    data: cityData.brokerCount, 
                    label: 'Brokers',
                    color: '#10B981',
                    stack: 'total'
                  }, 
                  { 
                    data: cityData.propertyInterestCount, 
                    label: 'Property Interests',
                    color: '#7C3AED',
                    stack: 'total'
                  }
                ]}
                height={isMobile ? 280 : isTablet ? 320 : 400}
                margin={{ 
                  left: isMobile ? 50 : 60, 
                  right: isMobile ? 20 : 30, 
                  top: 20, 
                  bottom: isMobile ? 50 : 60 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewLayout
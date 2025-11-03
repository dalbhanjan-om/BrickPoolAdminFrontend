import React, { useState, useEffect, useRef } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import overviewApiService from '../../services/OverviewApiService'

interface CounterCardProps {
  title: string
  value: number
}

const CounterCard: React.FC<CounterCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
      <p className="text-slate-500 text-xs font-medium mb-1 truncate">{title}</p>
      <p className="text-xl sm:text-2xl font-semibold text-slate-800">{value.toLocaleString()}</p>
    </div>
  )
}

// Small helper to enable click-drag, wheel-to-horizontal, and touch-drag scrolling
const ChartScroller: React.FC<{ minWidth: number; children: React.ReactNode }> = ({ minWidth, children }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollRef = useRef(0)

  useEffect(() => {
    const onUp = () => {
      isDownRef.current = false
      if (scrollerRef.current) scrollerRef.current.style.cursor = 'grab'
    }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true
    const scroller = scrollerRef.current
    if (!scroller) return
    startXRef.current = e.pageX - scroller.offsetLeft
    startScrollRef.current = scroller.scrollLeft
    scroller.style.cursor = 'grabbing'
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!isDownRef.current || !scroller) return
    e.preventDefault()
    const x = e.pageX - scroller.offsetLeft
    const walk = (x - startXRef.current)
    scroller.scrollLeft = startScrollRef.current - walk
  }

  const onMouseUpOrLeave = () => {
    isDownRef.current = false
    if (scrollerRef.current) scrollerRef.current.style.cursor = 'grab'
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      scroller.scrollLeft += e.deltaY
    }
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDownRef.current = true
    const scroller = scrollerRef.current
    if (!scroller) return
    startXRef.current = e.touches[0].pageX - scroller.offsetLeft
    startScrollRef.current = scroller.scrollLeft
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!isDownRef.current || !scroller) return
    const x = e.touches[0].pageX - scroller.offsetLeft
    const walk = (x - startXRef.current)
    scroller.scrollLeft = startScrollRef.current - walk
  }

  const onTouchEnd = () => {
    isDownRef.current = false
  }

  return (
    <div
      ref={scrollerRef}
      className="overflow-x-auto"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUpOrLeave}
      onMouseUp={onMouseUpOrLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      style={{ WebkitOverflowScrolling: 'touch', cursor: 'grab', overscrollBehaviorX: 'contain', touchAction: 'pan-x' }}
    >
      <div style={{ minWidth }}>{children}</div>
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
      <div className="p-4 sm:p-6 h-full">
        {/* Stats Cards - Always in single row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <CounterCard 
            title="Buyers" 
            value={stats.totalBuyers}
          />
          <CounterCard 
            title="Brokers" 
            value={stats.totalBrokers}
          />
          <CounterCard 
            title="Interests" 
            value={stats.totalPropertyInterests}
          />
        </div>

        {/* City-wise Data Chart */}
        {cityData.cities.length > 0 && (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-slate-800 text-base sm:text-lg font-semibold">City-wise Buyers, Brokers and Interests</h3>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                    Buyers
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                    Brokers
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-700">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
                    Interests
                  </span>
                </div>
              </div>
            </div>
            {(() => {
              // Abbreviate long labels on very small screens for readability
              const displayCities = isMobile
                ? cityData.cities.map((c) => (c.length > 10 ? `${c.slice(0, 10)}…` : c))
                : cityData.cities

              const perCategory = isMobile ? 110 : 80
              const calculated = cityData.cities.length * perCategory
              const minWidth = Math.max(calculated, isMobile ? 900 : 800)
              return (
                <ChartScroller minWidth={minWidth}>
                  <BarChart
                    xAxis={[{ 
                      data: displayCities,
                      scaleType: 'band',
                      tickLabelStyle: {
                        angle: isMobile ? -82 : isTablet ? -50 : 0,
                        textAnchor: isMobile || isTablet ? 'end' : 'middle',
                        dominantBaseline: 'hanging',
                        fontSize: isMobile ? 8 : isTablet ? 10 : 12,
                        whiteSpace: 'nowrap'
                      }
                    }]}
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
                    width={minWidth}
                    height={isMobile ? 300 : isTablet ? 340 : 380}
                    margin={{ 
                      left: isMobile ? 48 : 50, 
                      right: isMobile ? 16 : 20, 
                      top: isMobile ? 28 : 60, 
                      bottom: isMobile ? 120 : isTablet ? 110 : 90 
                    }}
                  />
                </ChartScroller>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewLayout
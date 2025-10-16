import axiosInstance from './axiosInstance';

// Types for the API responses
export interface AdminGetAllBuyersResponse {
  buyerId: number;
  userName: string;
  cityName: string;
}

export interface OverviewApiService {
  getAllBuyers: (cityName?: string) => Promise<AdminGetAllBuyersResponse[]>;
  getTotalBuyersCount: () => Promise<number>;
  getTotalBrokersCount: () => Promise<number>;
  getTotalPropertyRequirementsCount: () => Promise<number>;
  getBuyerCountFromCity: (cityName: string) => Promise<number>;
  getBrokerCountFromCity: (cityName: string) => Promise<number>;
}

// API service implementation
const overviewApiService: OverviewApiService = {
  /**
   * Get all buyers, optionally filtered by city
   * @param cityName - Optional city name to filter buyers
   * @returns Promise with array of buyer data
   */
  getAllBuyers: async (cityName?: string): Promise<AdminGetAllBuyersResponse[]> => {
    try {
      const endpoint = cityName 
        ? `/admin/allBuyers/${encodeURIComponent(cityName)}`
        : '/admin/allBuyers';
      
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching buyers:', error);
      throw error;
    }
  },

  /**
   * Get total number of buyers across all cities
   * @returns Promise with total buyers count
   */
  getTotalBuyersCount: async (): Promise<number> => {
    try {
      const response = await axiosInstance.get('/admin/totalBuyersCount');
      return response.data;
    } catch (error) {
      console.error('Error fetching total buyers count:', error);
      throw error;
    }
  },

  /**
   * Get total number of brokers across all cities
   * @returns Promise with total brokers count
   */
  getTotalBrokersCount: async (): Promise<number> => {
    try {
      const response = await axiosInstance.get('/admin/totalBrokersCount');
      return response.data;
    } catch (error) {
      console.error('Error fetching total brokers count:', error);
      throw error;
    }
  },

  /**
   * Get total number of property requirements across all cities
   * @returns Promise with total property requirements count
   */
  getTotalPropertyRequirementsCount: async (): Promise<number> => {
    try {
      const response = await axiosInstance.get('/admin/totalPropertyRequirementsCount');
      return response.data;
    } catch (error) {
      console.error('Error fetching total property requirements count:', error);
      throw error;
    }
  },

  /**
   * Get count of buyers from a specific city
   * @param cityName - Name of the city
   * @returns Promise with buyers count for the city
   */
  getBuyerCountFromCity: async (cityName: string): Promise<number> => {
    try {
      const response = await axiosInstance.get(`/admin/buyerCountFromCity/${encodeURIComponent(cityName)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching buyer count for city ${cityName}:`, error);
      throw error;
    }
  },

  /**
   * Get count of brokers from a specific city
   * @param cityName - Name of the city
   * @returns Promise with brokers count for the city
   */
  getBrokerCountFromCity: async (cityName: string): Promise<number> => {
    try {
      const response = await axiosInstance.get(`/admin/brokerCountFromCity/${encodeURIComponent(cityName)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching broker count for city ${cityName}:`, error);
      throw error;
    }
  },
};

export default overviewApiService;

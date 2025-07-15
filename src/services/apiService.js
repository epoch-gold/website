import axios from "axios";
import cacheService from "./cacheService";

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : "/api",
    });
  }

  async cachedGet(url, params = {}, options = {}) {
    const { cacheTTL = 5 * 60 * 1000, bypassCache = false } = options;
    const cacheKey = cacheService.generateKey(url, params);

    if (!bypassCache && cacheService.has(cacheKey)) {
      return cacheService.get(cacheKey);
    }

    try {
      const response = await this.api.get(url, { params });
      cacheService.set(cacheKey, response.data, cacheTTL);
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async request(method, url, data = null, config = {}) {
    return this.api.request({ method, url, data, ...config });
  }

  clearCache(pattern = null) {
    if (pattern) {
      const stats = cacheService.getStats();
      stats.keys.forEach((key) => {
        if (key.includes(pattern)) {
          cacheService.delete(key);
        }
      });
    } else {
      cacheService.clear();
    }
  }
}

const apiService = new ApiService();
export default apiService;

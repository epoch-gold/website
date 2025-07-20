import { createStore } from "vuex";
import apiService from "../services/apiService";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async fetchItems(_, { page = 1, limit = 15, search = "", bypassCache = false } = {}) {
      const params = { page: page.toString(), limit: limit.toString() };
      if (search) {
        params.search = search;
      }
      return await apiService.cachedGet("/items", params, {
        bypassCache,
        cacheTTL: 3 * 60 * 1000,
      });
    },

    async fetchItem(_, { id, bypassCache = false } = {}) {
      return await apiService.cachedGet(
        `/items/${id}`,
        {},
        {
          bypassCache,
          cacheTTL: 10 * 60 * 1000,
        }
      );
    },

    async fetchItemAuctions(_, { id, bypassCache = false } = {}) {
      return await apiService.cachedGet(
        `/items/${id}/auctions`,
        {},
        {
          bypassCache,
          cacheTTL: 2 * 60 * 1000,
        }
      );
    },

    async fetchItemHistoricalData(_, { id, bypassCache = false } = {}) {
      return await apiService.cachedGet(
        `/items/${id}/data`,
        {},
        {
          bypassCache,
          cacheTTL: 5 * 60 * 1000,
        }
      );
    },

    async fetchLatestScan(_, { bypassCache = false } = {}) {
      return await apiService.cachedGet(
        "/scans/latest",
        {},
        {
          bypassCache,
          cacheTTL: 30 * 1000,
        }
      );
    },

    clearCache(_, pattern = null) {
      apiService.clearCache(pattern);
    },
  },
});

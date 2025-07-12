<template>
  <div class="p-4">
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for items..."
        class="w-full p-2 border rounded-lg"
      />
    </div>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      <router-link v-for="item in paginatedItems" :key="item.id" :to="`/item/${item.id}`" class="border p-4 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="font-semibold">{{ item.name }}</div>
        <div class="text-sm text-gray-500">ID: {{ item.id }}</div>
        <div class="text-sm text-gray-600 mt-2 flex items-center">
          <span class="mr-2">Market Price:</span>
          <Price v-if="marketPrices[item.id]" :price="marketPrices[item.id]" />
          <span v-else>Loading...</span>
        </div>
      </router-link>
    </div>

    <div class="flex justify-center items-center mt-4" v-if="!loading && !error && filteredItems.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        Prev
      </button>
      <span class="py-2 px-4">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import Price from '../components/Price.vue';

export default {
  name: 'Home',
  components: {
    Price,
  },
  data() {
    return {
      items: [],
      loading: true,
      error: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 20,
      marketPrices: {},
    };
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async fetchMarketPrices() {
      const itemsToFetch = this.paginatedItems.filter(item => !this.marketPrices[item.id]);
      if (itemsToFetch.length === 0) return;

      const pricePromises = itemsToFetch.map(item =>
        this.$axios.get(`/api/items/${item.id}/data`)
          .then(response => ({
            id: item.id,
            price: response.data.length > 0 ? parseFloat(response.data[0].market_price) : 'N/A',
          }))
          .catch(err => {
            console.error(`Failed to load market price for item ${item.id}`, err);
            return { id: item.id, price: 'Error' };
          })
      );

      const results = await Promise.all(pricePromises);
      results.forEach(result => {
        this.marketPrices[result.id] = result.price;
      });
    },
  },
  async created() {
    try {
      const response = await this.$axios.get('/api/items');
      this.items = response.data;
      this.fetchMarketPrices(); 
    } catch (err) {
      this.error = 'Failed to load items. Please try again later.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    currentPage() {
      this.fetchMarketPrices();
    },
  },
};
</script>
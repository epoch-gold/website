<template>
  <div class="p-4 mt-4">
    <div class="mb-4">
      <input type="text" v-model="searchQuery" placeholder="Search for items..." class="w-full p-2 border rounded-lg" />
    </div>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-if="!loading && !error"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <router-link v-for="item in paginatedItems" :key="item.id" :to="`/item/${item.id}`"
        class="border p-4 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="font-semibold">{{ item.name }}</div>
        <div class="text-sm text-gray-600 mt-2 flex items-center">
          <div v-if="minimumBuyouts[item.id]">
            <div v-if="minimumBuyouts[item.id] === 'N/A'" class="text-gray-500">
              No auctions found
            </div>
            <div v-else class="flex flex-col xl:flex-row items-start xl:items-center">
              <span class="mr-0 sm:mr-2">Min Buyout:</span>
              <Price :price="minimumBuyouts[item.id]" class="mr-0 sm:mr-2" />
            </div>
          </div>
          <div v-else>
            Loading...
          </div>
        </div>
      </router-link>
    </div>

    <div class="flex justify-center items-center mt-8" v-if="!loading && !error && filteredItems.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
        Prev
      </button>
      <span class="py-2 px-4">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
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
      minimumBuyouts: {},
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
    async fetchMinimumBuyouts() {
      const itemsToFetch = this.paginatedItems.filter(item => !this.minimumBuyouts[item.id]);
      if (itemsToFetch.length === 0) return;

      const pricePromises = itemsToFetch.map(item =>
        this.$axios.get(`/items/${item.id}/auctions`)
          .then(response => {
            const auctions = response.data;
            if (auctions.length > 0) {
              const minPrice = Math.min(...auctions.map(a => a.price));
              return { id: item.id, price: minPrice };
            }
            return { id: item.id, price: 'N/A' };
          })
          .catch(err => {
            if (err.response && err.response.status === 404) {
              return { id: item.id, price: 'N/A' };
            }
            console.error(`Failed to load minimum buyout for item ${item.id}`, err);
            return { id: item.id, price: 'Error' };
          })
      );

      const results = await Promise.all(pricePromises);
      results.forEach(result => {
        this.minimumBuyouts[result.id] = result.price;
      });
    },
  },
  async created() {
    try {
      const response = await this.$axios.get('/items');
      this.items = response.data;
      this.fetchMinimumBuyouts();
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
      this.fetchMinimumBuyouts();
    },
    currentPage() {
      this.fetchMinimumBuyouts();
    },
  },
};
</script>
<template>
  <div class="p-8">
    <div class="mb-8">
      <input type="text" v-model="searchQuery" placeholder="Search for items..."
        class="w-full p-3 bg-epoch-gray-800 text-white border-2 border-epoch-gray-700 rounded-lg focus:outline-none focus:border-epoch-gold transition-colors" />
    </div>

    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>

    <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <router-link v-for="item in displayedItems" :key="item.id" :to="`/item/${item.id}`"
        class="bg-epoch-gray-800 p-4 rounded-lg hover:bg-epoch-gray-700 transform hover:-translate-y-1 transition-all shadow-md hover:shadow-xl">
        <div class="flex items-center">
          <img :src="`/icons/${item.icon.toLowerCase()}.png`" :alt="item.name" class="h-8 w-8 mr-4" />
          <div>
            <div class="font-semibold text-epoch-gold">{{ item.name }}</div>
            <div class="text-sm text-epoch-gray-400 mt-2 flex items-center">
              <div v-if="minimumBuyouts[item.id]">
                <div v-if="minimumBuyouts[item.id] === 'N/A'" class="text-gray-500">
                  No auctions found
                </div>
                <div v-else class="flex flex-col xl:flex-row items-start xl:items-center">
                  <Price :price="minimumBuyouts[item.id]" class="mr-0 sm:mr-2" />
                </div>
              </div>
              <div v-else>
                Loading...
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <div class="flex justify-center items-center mt-8" v-if="!loading && !error && totalItems > 0">
      <button @click="prevPage" :disabled="currentPage === 1"
        class="bg-epoch-gray-700 hover:bg-epoch-gold text-white font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        Prev
      </button>
      <span class="py-2 px-4 bg-epoch-gray-800 text-white">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages"
        class="bg-epoch-gray-700 hover:bg-epoch-gold text-white font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
      loading: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 15,
      totalPages: 1,
      totalItems: 0,
      minimumBuyouts: {},
    };
  },
  computed: {
    displayedItems() {
      return this.items;
    },
  },
  methods: {
    async loadItems() {
      try {
        this.loading = true;
        const params = new URLSearchParams({
          page: this.currentPage.toString(),
          limit: this.itemsPerPage.toString()
        });
        
        if (this.searchQuery) {
          params.append('search', this.searchQuery);
        }
        
        const response = await this.$axios.get(`/items?${params}`);
        this.items = response.data.items;
        this.totalPages = response.data.pagination.totalPages;
        this.totalItems = response.data.pagination.totalItems;
        this.fetchMinimumBuyouts();
      } catch (err) {
        this.error = 'Failed to load items. Please try again later.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadItems();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadItems();
      }
    },
    async fetchMinimumBuyouts() {
      const itemsToFetch = this.items.filter(item => !this.minimumBuyouts[item.id]);
      if (itemsToFetch.length === 0) return;

      const pricePromises = itemsToFetch.map(item =>
        this.$axios.get(`/items/${item.id}/auctions`)
          .then(response => {
            const auctions = response.data;
            if (auctions.length > 0) {
              const minPrice = Math.min(...auctions.map(a => a.price / a.quantity));
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
    await this.loadItems();
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
      this.loadItems();
    },
  },
};
</script>

<style scoped></style>
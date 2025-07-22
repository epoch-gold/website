<template>
  <div class="p-8">
    <div v-if="lastScanTime" class="mb-6 text-sm text-epoch-gray-400 text-center md:text-left">
      Last scan: {{ lastScanTime }}
    </div>
    
    <SearchBar v-model="searchQuery" placeholder="Search for items..." />

    <div class="relative">
      <div v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-epoch-gray-900 bg-opacity-75 min-h-[400px]">
        <LoadingSpinner text="Loading items..." />
      </div>

      <div :class="{ 'opacity-50 pointer-events-none': loading }">
        <ItemGrid :items="displayedItems" />
      </div>
    </div>

    <div class="mt-6">
      <Pagination v-if="totalItems > 0 || (totalPages > 1)" :current-page="currentPage" :total-pages="totalPages"
        :disabled="loading" @prev-page="prevPage" @next-page="nextPage" />
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue';
import ItemGrid from '../components/ItemGrid.vue';
import Pagination from '../components/Pagination.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'Home',
  components: {
    SearchBar,
    ItemGrid,
    Pagination,
    LoadingSpinner,
  },
  data() {
    return {
      items: [],
      loading: true,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 15,
      totalPages: 1,
      totalItems: 0,
      searchTimeout: null,
      lastScanTimestamp: null,
    };
  },
  computed: {
    displayedItems() {
      return this.items;
    },
    lastScanTime() {
      if (!this.lastScanTimestamp) return null;

      const now = Date.now();
      const scanTime = this.lastScanTimestamp * 1000;
      const diffMs = now - scanTime;

      const minutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (minutes < 1) {
        return 'just now';
      } else if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      } else if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        return `${days} day${days === 1 ? '' : 's'} ago`;
      }
    },
  },
  methods: {
    async loadItems(isPageChange = false) {
      try {
        if (!isPageChange) {
          this.loading = true;
        }

        const data = await this.$store.dispatch('fetchItems', {
          page: this.currentPage,
          limit: this.itemsPerPage,
          search: this.searchQuery,
          bypassCache: false
        });

        this.items = data.items;
        this.totalPages = data.pagination.totalPages;
        this.totalItems = data.pagination.totalItems;
      } catch (err) {
        console.error(err);
      } finally {
        if (!isPageChange) {
          this.loading = false;
        }
      }
    },
    async refreshItems() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch('fetchItems', {
          page: this.currentPage,
          limit: this.itemsPerPage,
          search: this.searchQuery,
          bypassCache: true
        });
        this.items = data.items;
        this.totalPages = data.pagination.totalPages;
        this.totalItems = data.pagination.totalItems;
      } catch (err) {
        console.error('Failed to refresh items:', err);
      } finally {
        this.loading = false;
      }
    },
    async loadLatestScan() {
      try {
        const data = await this.$store.dispatch('fetchLatestScan');
        this.lastScanTimestamp = data.timestamp + 1800;
      } catch (err) {
        console.error('Failed to load latest scan:', err);
      }
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadItems(false);
      }, 500);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadItems(true);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loadItems(true);
      }
    },
  },
  async created() {
    await Promise.all([
      this.loadItems(),
      this.loadLatestScan()
    ]);
  },
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
  watch: {
    searchQuery() {
      this.debouncedSearch();
    },
  },
};
</script>

<style scoped></style>
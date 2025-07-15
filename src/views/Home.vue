<template>
  <div class="p-8">
    <SearchBar v-model="searchQuery" placeholder="Search for items..." />

    <div class="relative">
      <div v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-epoch-gray-900 bg-opacity-75 min-h-[400px]">
        <LoadingSpinner text="Loading items..." />
      </div>

      <div :class="{ 'opacity-50 pointer-events-none': loading }">
        <div v-if="displayedItems.length === 0 && !loading" class="text-center py-12">
          <div class="text-epoch-gray-400 text-lg">
            <template v-if="searchQuery">
              No items found matching "{{ searchQuery }}"
            </template>
            <template v-else>
              No items available
            </template>
          </div>
        </div>

        <template v-else>
          <ItemGrid :items="displayedItems" />
        </template>
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
    };
  },
  computed: {
    displayedItems() {
      return this.items;
    },
  },
  methods: {
    async loadItems(isPageChange = false) {
      try {
        if (!isPageChange) {
          this.loading = true;
        }

        const params = new URLSearchParams({
          page: this.currentPage.toString(),
          limit: this.itemsPerPage.toString()
        });

        if (this.searchQuery) {
          params.append('search', this.searchQuery);
        }

        const [response] = await Promise.all([
          this.$axios.get(`/items?${params}`),
          new Promise(resolve => setTimeout(resolve, 150))
        ]);

        this.items = response.data.items;
        this.totalPages = response.data.pagination.totalPages;
        this.totalItems = response.data.pagination.totalItems;
      } catch (err) {
        console.error(err);
      } finally {
        if (!isPageChange) {
          this.loading = false;
        }
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
    await this.loadItems();
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
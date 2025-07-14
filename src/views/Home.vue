<template>
  <div class="p-8">
    <SearchBar v-model="searchQuery" placeholder="Search for items..." />

    <LoadingSpinner v-if="loading" text="Loading items..." />

    <template v-else>
      <ItemGrid :items="displayedItems" />

      <Pagination v-if="totalItems > 0" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage"
        @next-page="nextPage" />
    </template>
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
        this.loading = false;
      }
    },
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.loadItems();
      }, 500);
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
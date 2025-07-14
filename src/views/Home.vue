<template>
  <div class="p-8">
    <SearchBar v-model="searchQuery" placeholder="Search for items..." />

    <LoadingSpinner v-if="loading" text="Loading items..." />

    <ErrorMessage v-else-if="error" :message="error" />

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
import ErrorMessage from '../components/ErrorMessage.vue';

export default {
  name: 'Home',
  components: {
    SearchBar,
    ItemGrid,
    Pagination,
    LoadingSpinner,
    ErrorMessage,
  },
  data() {
    return {
      items: [],
      loading: true,
      error: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 15,
      totalPages: 1,
      totalItems: 0,
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
        this.error = null;

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
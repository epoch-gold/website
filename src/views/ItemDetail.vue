<template>
  <div class="p-4">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-if="!loading && !error && item">
      <h1 class="text-3xl font-bold mb-4">{{ item.name }}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-semibold mb-2">Auctions</h2>
          <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="py-3 px-6 cursor-pointer" @click="sortBy('quantity')">
                    Quantity
                    <span v-if="sortKey === 'quantity'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                  <th scope="col" class="py-3 px-6 cursor-pointer" @click="sortBy('unit_price')">
                    Price Per Unit
                    <span v-if="sortKey === 'unit_price'">{{ sortAsc ? '▲' : '▼' }}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(auction, index) in paginatedAuctions" :key="index" class="bg-white border-b">
                  <td class="py-4 px-6">{{ auction.quantity }}</td>
                  <td class="py-4 px-6">
                    <Price :price="Number(auction.price / auction.quantity)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-center items-center mt-4" v-if="sortedAuctions.length > itemsPerPage">
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
        <div>
          <h2 class="text-2xl font-semibold mb-2">Historical Data</h2>
          <div class="relative h-96 shadow-md sm:rounded-lg p-4">
            <HistoricalChart v-if="historicalData.length > 0" :historicalData="historicalData" />
            <p v-else>No historical data available.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Price from '../components/Price.vue';
import HistoricalChart from '../components/HistoricalChart.vue';

export default {
  name: 'ItemDetail',
  components: {
    Price,
    HistoricalChart,
  },
  props: ['id'],
  data() {
    return {
      item: null,
      auctions: [],
      historicalData: [],
      loading: true,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'unit_price', // Default sort key
      sortAsc: true,      // Default sort direction
    };
  },
  computed: {
    sortedAuctions() {
      // Add a calculated 'unit_price' to each auction for sorting
      const auctionsWithUnitPrice = this.auctions.map(auction => ({
        ...auction,
        unit_price: auction.price / auction.quantity,
      }));

      return auctionsWithUnitPrice.sort((a, b) => {
        let result = 0;
        // The key for sorting can be 'quantity' or the calculated 'unit_price'
        const valA = this.sortKey === 'unit_price' ? a.unit_price : a.quantity;
        const valB = this.sortKey === 'unit_price' ? b.unit_price : b.quantity;

        if (valA < valB) {
          result = -1;
        } else if (valA > valB) {
          result = 1;
        }
        return this.sortAsc ? result : -result;
      });
    },
    paginatedAuctions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedAuctions.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedAuctions.length / this.itemsPerPage);
    },
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
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
  },
  async created() {
    try {
      const [itemsResponse, auctionsResponse, historicalDataResponse] = await Promise.all([
        this.$axios.get(`/items`),
        this.$axios.get(`/items/${this.id}/auctions`),
        this.$axios.get(`/items/${this.id}/data`),
      ]);

      this.item = itemsResponse.data.find(i => i.id === parseInt(this.id));
      this.auctions = auctionsResponse.data;
      this.historicalData = historicalDataResponse.data;

    } catch (err) {
      this.error = 'Failed to load item details. Please try again later.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>
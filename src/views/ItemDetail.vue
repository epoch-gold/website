<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <img v-if="item" :src="`/icons/${item.icon.toLowerCase()}.png`" :alt="item.name" class="h-12 w-12 mr-4" />
        <h1 v-if="item" class="text-2xl sm:text-4xl font-bold text-epoch-gold">{{ item.name }}</h1>
      </div>
      <button @click="goBack"
        class="bg-epoch-gray-700 hover:bg-epoch-gold text-white font-bold py-2 px-4 rounded transition-colors">
        Back
      </button>
    </div>
    <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
    <div v-if="!loading && !error && item" class="text-white">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-left">Auctions</h2>
          <div class="overflow-x-auto relative shadow-lg sm:rounded-lg">
            <table class="w-full text-sm text-left text-epoch-gray-300">
              <thead class="text-xs text-epoch-gold uppercase bg-epoch-gray-800">
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
                <tr v-for="(auction, index) in paginatedAuctions" :key="index"
                  class="bg-epoch-gray-800 border-b border-epoch-gray-700 hover:bg-epoch-gray-700 transition-colors">
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
        <div>
          <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-left">Historical Data</h2>
          <div class="relative h-96 bg-epoch-gray-800 shadow-lg sm:rounded-lg p-4">
            <HistoricalChart v-if="historicalData.length > 0" :historicalData="historicalData" />
            <p v-else class="text-epoch-gray-400">No historical data available.</p>
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
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'unit_price',
      sortAsc: true,
    };
  },
  computed: {
    sortedAuctions() {
      const auctionsWithUnitPrice = this.auctions.map(auction => ({
        ...auction,
        unit_price: auction.price / auction.quantity,
      }));

      return auctionsWithUnitPrice.sort((a, b) => {
        let result = 0;
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
    goBack() {
      this.$router.go(-1);
    },
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
    this.loading = true;
    try {
      const [itemsResponse, auctionsResponse, historicalDataResponse] = await Promise.all([
        this.$axios.get(`/items`),
        this.id ? this.$axios.get(`/items/${this.id}/auctions`) : Promise.resolve({
          data: []
        }),
        this.id ? this.$axios.get(`/items/${this.id}/data`) : Promise.resolve({
          data: []
        }),
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
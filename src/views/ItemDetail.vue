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
                  <th scope="col" class="py-3 px-6">Quantity</th>
                  <th scope="col" class="py-3 px-6">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(auction, index) in auctions" :key="index" class="bg-white border-b">
                  <td class="py-4 px-6">{{ auction.quantity }}</td>
                  <td class="py-4 px-6">
                    <Price :price="auction.price" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-semibold mb-2">Historical Data</h2>
          <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="py-3 px-6">Date</th>
                  <th scope="col" class="py-3 px-6">Market Price</th>
                  <th scope="col" class="py-3 px-6">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in historicalData" :key="index" class="bg-white border-b">
                  <td class="py-4 px-6">{{ new Date(data.timestamp * 1000).toLocaleDateString() }}</td>
                  <td class="py-4 px-6">
                    <Price :price="parseFloat(data.market_price)" />
                  </td>
                  <td class="py-4 px-6">{{ data.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Price from '../components/Price.vue';

export default {
  name: 'ItemDetail',
  components: {
    Price,
  },
  props: ['id'],
  data() {
    return {
      item: null,
      auctions: [],
      historicalData: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    try {
      const [itemsResponse, auctionsResponse, historicalDataResponse] = await Promise.all([
        this.$axios.get(`/api/items`),
        this.$axios.get(`/api/items/${this.id}/auctions`),
        this.$axios.get(`/api/items/${this.id}/data`),
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
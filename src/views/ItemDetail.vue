<template>
  <div class="p-8 pb-16">
    <ItemHeader :item="item" @go-back="goBack" />

    <LoadingSpinner v-if="loading" text="Loading item details..." />

    <div v-else-if="item" class="text-white">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AuctionTable :auctions="auctions" :current-page="currentPage" :items-per-page="itemsPerPage"
          :sort-key="sortKey" :sort-asc="sortAsc" @sort-by="sortBy" @prev-page="prevPage" @next-page="nextPage" />

        <HistoricalDataSection :historical-data="historicalData" />
      </div>
    </div>
  </div>
</template>

<script>
import ItemHeader from '../components/ItemHeader.vue';
import AuctionTable from '../components/AuctionTable.vue';
import HistoricalDataSection from '../components/HistoricalDataSection.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'ItemDetail',
  components: {
    ItemHeader,
    AuctionTable,
    HistoricalDataSection,
    LoadingSpinner,
  },
  props: ['id'],
  data() {
    return {
      item: null,
      auctions: [],
      historicalData: [],
      loading: true,
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'unit_price',
      sortAsc: true,
    };
  },
  computed: {
    totalPages() {
      const sortedAuctions = this.auctions.map(auction => ({
        ...auction,
        unit_price: auction.price / auction.quantity,
      }));
      return Math.ceil(sortedAuctions.length / this.itemsPerPage);
    }
  },
  watch: {
    id: {
      immediate: true,
      async handler(newId) {
        if (newId) {
          document.title = 'Loading... - EpochGold';

          this.loading = true;
          this.currentPage = 1;
          try {
            const [itemData, auctionsData, historicalData] = await Promise.all([
              this.$store.dispatch('fetchItem', { id: newId }),
              this.$store.dispatch('fetchItemAuctions', { id: newId }),
              this.$store.dispatch('fetchItemHistoricalData', { id: newId }),
              new Promise(resolve => setTimeout(resolve, 150))
            ]);

            this.item = itemData;
            this.auctions = auctionsData;
            this.historicalData = historicalData;

            if (this.item && this.item.name) {
              document.title = `${this.item.name} - EpochGold`;
            }
          } catch (err) {
            console.error(err);
            document.title = 'Item Not Found - EpochGold';
          } finally {
            this.loading = false;
          }
        }
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/');
    },
    async refreshAuctions() {
      try {
        this.auctions = await this.$store.dispatch('fetchItemAuctions', {
          id: this.id,
          bypassCache: true
        });
      } catch (err) {
        console.error('Failed to refresh auctions:', err);
      }
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
  },
  beforeUnmount() {
    document.title = 'EpochGold - Auctions & Market Data';
  },
};
</script>
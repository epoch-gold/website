<template>
    <div>
        <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-left">Auctions</h2>
        <div v-if="auctions.length === 0" class="text-left py-8 text-epoch-gray-400">
            <p class="text-lg">No auctions found for this item.</p>
        </div>
        <div v-else>
            <div class="overflow-x-auto relative shadow-lg sm:rounded-lg">
                <table class="w-full text-sm text-left text-epoch-gray-300">
                    <thead class="text-xs text-epoch-gold uppercase bg-epoch-gray-800">
                        <tr>
                            <th scope="col" class="py-3 px-6 cursor-pointer" @click="handleSort('quantity')">
                                Quantity
                                <span v-if="sortKey === 'quantity'">{{ sortAsc ? '▲' : '▼' }}</span>
                            </th>
                            <th scope="col" class="py-3 px-6 cursor-pointer" @click="handleSort('unit_price')">
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

            <div class="mt-6">
                <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
                    @prev-page="$emit('prev-page')" @next-page="$emit('next-page')" />
            </div>
        </div>
    </div>
</template>

<script>
import Price from './Price.vue'
import Pagination from './Pagination.vue'

export default {
    name: 'AuctionTable',
    components: {
        Price,
        Pagination
    },
    props: {
        auctions: {
            type: Array,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        itemsPerPage: {
            type: Number,
            default: 10
        },
        sortKey: {
            type: String,
            default: 'unit_price'
        },
        sortAsc: {
            type: Boolean,
            default: true
        }
    },
    emits: ['sort-by', 'prev-page', 'next-page'],
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
        }
    },
    methods: {
        handleSort(key) {
            this.$emit('sort-by', key);
        }
    }
}
</script>

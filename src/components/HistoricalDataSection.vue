<template>
    <div>
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
            <h2 class="text-xl sm:text-2xl font-semibold text-left">Historical Data</h2>
            <div v-if="thirtyDayAverage" class="flex items-center justify-start sm:justify-end">
                <span class="text-epoch-gold mr-2 sm:mr-4 font-semibold text-sm sm:text-md">30d Average:</span>
                <Price :price="thirtyDayAverage" />
            </div>
        </div>
        <div class="relative h-96 bg-epoch-gray-800 shadow-lg sm:rounded-lg p-4">
            <HistoricalChart v-if="historicalData.length > 0" :historicalData="historicalData" />
        </div>
    </div>
</template>

<script>
import HistoricalChart from './HistoricalChart.vue'
import Price from './Price.vue'

function calculate30DayAverage(historicalData) {
    if (!historicalData || historicalData.length === 0) return null;

    const now = Date.now() / 1000;
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

    const recentData = historicalData.filter(data => data.timestamp >= thirtyDaysAgo);

    if (recentData.length === 0) return null;

    const sum = recentData.reduce((total, data) => total + parseFloat(data.market_price || 0), 0);
    return Math.round(sum / recentData.length);
}

export default {
    name: 'HistoricalDataSection',
    components: {
        HistoricalChart,
        Price
    },
    props: {
        historicalData: {
            type: Array,
            required: true
        }
    },
    computed: {
        thirtyDayAverage() {
            return calculate30DayAverage(this.historicalData);
        }
    }
}
</script>

<template>
    <div>
        <h2 class="text-xl sm:text-2xl font-semibold mb-4 text-left">Historical Data</h2>
        <div class="relative h-96 bg-epoch-gray-800 shadow-lg sm:rounded-lg p-4">
            <HistoricalChart v-if="historicalData.length > 0" :historicalData="historicalData" />
            <p v-else class="text-epoch-gray-400">No historical data available.</p>
        </div>
    </div>
</template>

<script>
import HistoricalChart from './HistoricalChart.vue'

export default {
    name: 'HistoricalDataSection',
    components: {
        HistoricalChart
    },
    props: {
        historicalData: {
            type: Array,
            required: true
        }
    }
}
</script>

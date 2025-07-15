<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

function formatPrice(value) {
    const roundedValue = Math.round(value);
    const gold = Math.floor(roundedValue / 10000);
    const silver = Math.floor((roundedValue % 10000) / 100);
    const copper = roundedValue % 100;

    if (gold > 0) {
        return `${gold}g ${silver}s ${copper}c`;
    } else if (silver > 0) {
        return `${silver}s ${copper}c`;
    } else {
        return `${copper}c`;
    }
}

export default {
    name: 'HistoricalChart',
    components: {
        Line,
    },
    props: {
        historicalData: {
            type: Array,
            required: true,
        },
    },
    computed: {
        sortedHistoricalData() {
            return [...this.historicalData].sort((a, b) => a.timestamp - b.timestamp);
        },
        chartData() {
            const labels = this.sortedHistoricalData.map(data => new Date(data.timestamp * 1000).toLocaleDateString());
            const marketPrices = this.sortedHistoricalData.map(data => parseFloat(data.market_price));

            return {
                labels,
                datasets: [
                    {
                        label: 'Market Price',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderColor: '#ffd700',
                        data: marketPrices,
                        fill: true,
                        tension: 0.4,
                    },
                ],
            };
        },
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: 'white',
                        },
                    },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function (value) {
                                return formatPrice(value);
                            },
                            color: 'white',
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatPrice(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
            };
        },
    },
};
</script>
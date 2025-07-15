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

function smoothData(data, method = 'movingAverage', windowSize = 5) {
    if (data.length <= 1) return data;

    switch (method) {
        case 'movingAverage':
            return applyMovingAverage(data, windowSize);
        case 'exponentialMovingAverage':
            return applyExponentialMovingAverage(data, 0.3);
        case 'outlierRemoval':
            return removeOutliers(data);
        case 'combined':
            let smoothed = removeOutliers(data);
            smoothed = applyMovingAverage(smoothed, windowSize);
            return smoothed;
        default:
            return data;
    }
}

function applyMovingAverage(data, windowSize) {
    if (windowSize <= 1) return data;

    const smoothed = [];
    for (let i = 0; i < data.length; i++) {
        let sum = 0;
        let count = 0;

        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));

        for (let j = start; j <= end; j++) {
            sum += data[j];
            count++;
        }

        smoothed.push(sum / count);
    }

    return smoothed;
}

function applyExponentialMovingAverage(data, alpha = 0.3) {
    const smoothed = [data[0]];

    for (let i = 1; i < data.length; i++) {
        const ema = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
        smoothed.push(ema);
    }

    return smoothed;
}

function removeOutliers(data, threshold = 2) {
    if (data.length < 3) return data;

    const smoothed = [...data];

    for (let i = 1; i < data.length - 1; i++) {
        const prev = data[i - 1];
        const current = data[i];
        const next = data[i + 1];

        const avgNeighbors = (prev + next) / 2;
        const deviation = Math.abs(current - avgNeighbors);
        const avgValue = (prev + current + next) / 3;
        const relativeDeviation = deviation / avgValue;

        if (relativeDeviation > threshold) {
            smoothed[i] = avgNeighbors;
        }
    }

    return smoothed;
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
        smoothingMethod: {
            type: String,
            default: 'combined',
            validator: value => ['none', 'movingAverage', 'exponentialMovingAverage', 'outlierRemoval', 'combined'].includes(value)
        },
        windowSize: {
            type: Number,
            default: 5,
            validator: value => value > 0 && value <= 20
        }
    },
    computed: {
        sortedHistoricalData() {
            return [...this.historicalData].sort((a, b) => a.timestamp - b.timestamp);
        }, chartData() {
            const labels = this.sortedHistoricalData.map(data => new Date(data.timestamp * 1000).toLocaleDateString());
            let marketPrices = this.sortedHistoricalData.map(data => parseFloat(data.market_price));

            if (this.smoothingMethod !== 'none') {
                marketPrices = smoothData(marketPrices, this.smoothingMethod, this.windowSize);
            }

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
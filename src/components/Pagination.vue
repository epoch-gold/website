<template>
    <div class="flex justify-center items-center mt-8" v-if="totalPages > 1">
        <button @click="$emit('prev-page')" :disabled="currentPage === 1"
            class="bg-epoch-gray-700 hover:bg-epoch-gray-600 text-white font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Prev
        </button>
        <span class="py-2 px-4 bg-epoch-gray-800 text-white">
            Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button @click="$emit('next-page')" :disabled="currentPage === totalPages"
            class="bg-epoch-gray-700 hover:bg-epoch-gray-600 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
        </button>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    },
    emits: ['prev-page', 'next-page']
}
</script>

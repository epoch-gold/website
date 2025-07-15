<template>
    <div class="flex justify-center items-center mt-6" v-if="totalPages > 1">
        <div class="flex rounded overflow-hidden">
            <button @click="handlePrevPage" :disabled="currentPage === 1 || disabled"
                class="bg-epoch-gray-700 hover:bg-epoch-gray-600 text-white font-semibold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Prev
            </button>
            <span
                class="py-2 px-4 bg-epoch-gray-800 text-white text-center text-md md:text-base font-semibold whitespace-nowrap"
                :class="{ 'opacity-50': disabled }">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="handleNextPage" :disabled="currentPage === totalPages || disabled"
                class="bg-epoch-gray-700 hover:bg-epoch-gray-600 text-white font-semibold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next
            </button>
        </div>
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
        },
        disabled: {
            type: Boolean,
            default: false
        },
        scrollToTop: {
            type: Boolean,
            default: true
        }
    },
    emits: ['prev-page', 'next-page'],
    methods: {
        handleScrollToTop() {
            if (this.scrollToTop) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },
        handlePrevPage() {
            this.$emit('prev-page');
            this.handleScrollToTop();
        },
        handleNextPage() {
            this.$emit('next-page');
            this.handleScrollToTop();
        }
    }
}
</script>

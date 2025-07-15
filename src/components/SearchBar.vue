<template>
    <div class="mb-8 relative">
        <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"
            class="w-full p-3 pr-10 bg-epoch-gray-800 text-white border-2 border-epoch-gray-700 rounded-lg focus:outline-none focus:border-epoch-gold transition-colors" />
        <button v-if="modelValue" @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-epoch-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: 'SearchBar',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Search...'
        }
    },
    emits: ['update:modelValue'],
    methods: {
        clearSearch() {
            this.$emit('update:modelValue', '')
        }
    }
}
</script>

<template>
    <div class="mb-8">
        <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"
            class="w-full p-3 bg-epoch-gray-800 text-white border-2 border-epoch-gray-700 rounded-lg focus:outline-none focus:border-epoch-gold transition-colors" />
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
    emits: ['update:modelValue']
}
</script>

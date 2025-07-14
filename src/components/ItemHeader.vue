<template>
    <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
            <img v-if="item" :src="`/icons/${item.icon.toLowerCase()}.png`" :alt="item.name" class="h-12 w-12 mr-4" />
            <h1 v-if="item" class="text-2xl sm:text-4xl font-bold text-epoch-gold">
                {{ item.name }}
            </h1>
        </div>
        <button @click="$emit('go-back')"
            class="bg-epoch-gray-700 hover:bg-epoch-gold text-white font-bold py-2 px-4 rounded transition-colors">
            Back
        </button>
    </div>
</template>

<script>
export default {
    name: 'ItemHeader',
    props: {
        item: {
            type: Object,
            default: null
        }
    },
    emits: ['go-back']
}
</script>

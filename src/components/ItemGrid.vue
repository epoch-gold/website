<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
</template>

<script>
import ItemCard from './ItemCard.vue'

export default {
    name: 'ItemGrid',
    components: {
        ItemCard
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>

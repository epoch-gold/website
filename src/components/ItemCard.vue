<template>
    <router-link :to="`/item/${item.id}`"
        class="bg-epoch-gray-800 p-4 rounded-lg hover:bg-epoch-gray-700 transform hover:-translate-y-1 transition-all shadow-md hover:shadow-xl">
        <div class="flex items-center">
            <img :src="`/icons/${item.icon.toLowerCase()}.png`" :alt="item.name" class="h-8 w-8 mr-4" />
            <div>
                <div class="font-semibold text-epoch-gold">{{ item.name }}</div>
                <div class="text-sm text-epoch-gray-400 mt-2 flex items-center">
                    <div v-if="item.price !== null">
                        <div class="flex flex-col xl:flex-row items-start xl:items-center">
                            <Price :price="Number(item.price)" class="mr-0 sm:mr-2" />
                        </div>
                    </div>
                    <div v-else class="text-gray-500">
                        No auctions found
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
import Price from './Price.vue'

export default {
    name: 'ItemCard',
    components: {
        Price
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

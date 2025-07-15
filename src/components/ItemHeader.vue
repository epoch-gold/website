<template>
    <div class="flex justify-between items-center mb-6 gap-4 sm:gap-6">
        <div class="flex items-center min-w-0 flex-1 min-h-[3rem]">
            <div v-if="item" class="flex items-center min-w-0 flex-1">
                <img :src="`/icons/${item.icon.toLowerCase()}.png`" :alt="item.name"
                    class="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 mr-2 xs:mr-3 sm:mr-4 flex-shrink-0" />
                <h1
                    class="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-epoch-gold min-w-0 break-words leading-tight">
                    {{ item.name }}
                </h1>
            </div>
        </div>
        <button @click="$emit('go-back')"
            class="bg-epoch-gray-700 hover:bg-epoch-gray-600 text-white font-bold py-2 px-4 rounded transition-colors flex-shrink-0">
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

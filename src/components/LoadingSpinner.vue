<template>
    <div class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-epoch-gold"></div>
        <span v-if="text" class="ml-3 text-epoch-gray-400">{{ text }}</span>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        text: {
            type: String,
            default: ''
        }
    }
}
</script>

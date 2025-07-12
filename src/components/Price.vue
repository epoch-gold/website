<template>
  <div class="flex items-center">
    <template v-if="gold > 0">
      <span class="mr-1">{{ gold }}</span>
      <img src="../assets/money/gold.gif" alt="Gold" class="h-3 w-3 mr-2" />
    </template>
    <template v-if="silver > 0">
      <span class="mr-1">{{ silver }}</span>
      <img src="../assets/money/silver.gif" alt="Silver" class="h-3 w-3 mr-2" />
    </template>
    <template v-if="copper > 0 || (gold === 0 && silver === 0)">
      <span class="mr-1">{{ copperValue }}</span>
      <img src="../assets/money/copper.gif" alt="Copper" class="h-3 w-3" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'Price',
  props: {
    price: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    gold() {
      return Math.floor(this.price / 10000);
    },
    silver() {
      return Math.floor((this.price % 10000) / 100);
    },
    copperValue() {
      return this.price % 100;
    },
  },
};
</script>
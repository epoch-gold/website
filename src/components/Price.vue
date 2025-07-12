<template>
  <div class="flex items-center">
    <template v-if="isNumericPrice">
      <template v-if="gold > 0">
        <span class="mr-1">{{ gold }}</span>
        <img src="../assets/money/gold.gif" alt="Gold" class="h-3 w-3 mr-2" />
      </template>
      <template v-if="silver > 0">
        <span class="mr-1">{{ silver }}</span>
        <img src="../assets/money/silver.gif" alt="Silver" class="h-3 w-3 mr-2" />
      </template>
      <template v-if="copperValue > 0 || (gold === 0 && silver === 0)">
        <span class="mr-1">{{ copperValue }}</span>
        <img src="../assets/money/copper.gif" alt="Copper" class="h-3 w-3" />
      </template>
    </template>
    <template v-else>
      <span>{{ price }}</span>
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
    isNumericPrice() {
      return typeof this.price === 'number' && !isNaN(this.price);
    },
    gold() {
      return this.isNumericPrice ? Math.floor(Math.round(this.price) / 10000) : 0;
    },
    silver() {
      return this.isNumericPrice ? Math.floor((Math.round(this.price) % 10000) / 100) : 0;
    },
    copperValue() {
      return this.isNumericPrice ? Math.round(this.price) % 100 : 0;
    },
  },
};
</script>
<template>
  <div class="flex flex-col w-full mx-auto">
    <main class="flex-grow w-full min-h-[90vh]">
      <router-view />
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
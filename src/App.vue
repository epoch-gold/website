<template>
  <div class="flex flex-col w-full mx-auto min-h-screen bg-epoch-gray-900">
    <Header />
    <main class="flex-grow w-full max-w-7xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Header from './components/Header.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
  },
});
</script>
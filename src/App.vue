<template>
  <div class="flex flex-col w-full mx-auto min-h-screen bg-epoch-gray-900">
    <div class="w-full bg-epoch-gray-900">
      <Header />
    </div>
    <main class="flex-grow w-full max-w-7xl mx-auto">
      <router-view />
    </main>
    <div class="w-full bg-epoch-gray-900">
      <Footer />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer,
  },
});
</script>
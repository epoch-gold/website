<template>
  <div class="flex flex-col w-full mx-auto min-h-screen">
    <Header />
    <main class="flex-grow w-3/4 mx-auto min-h-[90vh]">
      <router-view />
    </main>
    <Footer />
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
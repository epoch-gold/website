import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api',
});

const app = createApp(App);

app.config.globalProperties.$axios = api;

app.use(store);
app.use(router);
app.mount('#app');
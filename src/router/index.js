import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { title: "EpochGold - Auctions & Market Data" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.title = to.meta.title || "EpochGold";
  next();
});

export default router;
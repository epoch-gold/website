import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import ItemDetail from "../views/ItemDetail.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { title: "EpochGold - Auctions & Market Data" } },
  { path: "/item/:id", name: "ItemDetail", component: ItemDetail, props: true, meta: { title: "EpochGold - Item Details" } },
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
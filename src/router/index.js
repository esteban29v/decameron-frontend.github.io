import { createRouter, createWebHistory } from 'vue-router';
import Hotels from '../views/Hotels.vue';

const routes = [
  { path: '/hotels', name: 'Hotels', component: Hotels },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/galeria',
      component: () => import('../components/Gallery.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../components/Home.vue'),
    },
  ],
})

export default router

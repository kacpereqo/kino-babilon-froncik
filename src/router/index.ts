import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/galeria',
      component: () => import('@/components/Gallery.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/components/Home.vue'),
    },
    {
      path: '/login/discord',
      component: () => import('@/components/LoginFinish.vue'),
      props: (route) => ({ code: route.query.code, state: route.query.state }),
    },
  ],
})

export default router

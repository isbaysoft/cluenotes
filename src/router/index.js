import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/game/GameIndexView.vue'),
    children: [
      {
        path: 'players',
        name: 'game-players',
        component: () => import('@/views/game/GamePlayersView.vue'),
      },
      {
        path: 'setup-cards',
        name: 'setup-cards',
        component: () => import('@/views/game/GameSetupCardsView.vue'),
      },
      {
        path: 'play',
        name: 'game-play',
        component: () => import('@/views/game/GamePlayView.vue'),
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/game/GameLogView.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'application',
    component: () => import('@/views/ApplicationView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/TermsView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },

  // redirects
  {
    path: '/privacy',
    redirect: '/terms',
  },
  {
    path: '/privacy-policy',
    redirect: '/terms',
  },
  {
    path: '/terms-of-service',
    redirect: '/terms',
  },
  {
    path: '/terms-of-service',
    redirect: '/terms',
  },
  {
    path: '/terms-of-use',
    redirect: '/terms',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

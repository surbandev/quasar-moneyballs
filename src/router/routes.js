const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageHome.vue') },
      { path: 'entries', component: () => import('pages/PageEntries.vue') },
      { path: 'categories', component: () => import('pages/PageCategories.vue') },
      { path: 'settings', component: () => import('pages/PageSettings.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

export const dynamicRoutes = [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/about/About.vue'),
      meta: {
        title: '关于',
        icon: shallowRef(Document),
        common: false
      }
    },
    {
      path: '/some',
      name: 'some',
      component: () => import('@/views/some/Some.vue'),
      meta: {
        title: '其他',
        icon: shallowRef(Setting),
        common: false
      }
    },
  ]
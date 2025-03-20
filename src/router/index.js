import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// 路由组件
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/UserManagementView.vue'),
        meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/userRole']
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next({ name: 'home' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router 
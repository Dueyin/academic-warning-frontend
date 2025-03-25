import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/student',
            name: 'student',
            component: () => import('../views/student/StudentLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'student-dashboard',
                    component: () => import('../views/student/DashboardView.vue')
                },
                {
                    path: 'profile',
                    name: 'student-profile',
                    component: () => import('../views/student/ProfileView.vue')
                },
                {
                    path: 'grades',
                    name: 'student-grades',
                    component: () => import('../views/student/GradesView.vue')
                },
                {
                    path: 'warnings',
                    name: 'student-warnings',
                    component: () => import('../views/student/WarningsView.vue')
                }
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('../views/admin/AdminLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/DashboardView.vue')
                },
                {
                    path: 'students',
                    name: 'admin-students',
                    component: () => import('../views/admin/StudentsView.vue')
                },
                {
                    path: 'warnings',
                    name: 'admin-warnings',
                    component: () => import('../views/admin/WarningsView.vue')
                }
            ]
        }
    ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.name !== 'login' && !token) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export default router 
import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  { 
    path: '/:pathMatch(.*)*',
    name: '404notfound',
    component: () => import('@/views/404NotFound.vue'),
    meta: {
        title: 'Page Not Found'
    }
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/Authentication/SigninView.vue'),
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: import('@/views/Dashboard/ECommerceView.vue'),
    meta: {
      title: 'Admin Dashboard'
    }
  },
  {
    path: '/cek-modal',
    name: 'cekmodal',
    component: () => import('@/components/Modal/CekModal.vue'),
    meta: {
      title: 'Admin Dashboard'
    }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/Product/Product.vue'),
    meta: {
      title: 'Product Data'
    }
  },
  {
    path: '/category-products',
    name: 'category_products',
    component: () => import('@/views/Product/CategoryProduct.vue'),
    meta: {
      title: 'Category Product'
    }
  },
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/views/Customers/Customers.vue'),
    meta: {
      title: 'Customer Data'
    }
  },
  {
    path: '/pesanan-baru',
    name: 'pesanan_baru',
    component: () => import('@/views/Transaksi/Transaksi.vue'),
    meta: {
      title: 'Transaksi - Pesanan Baru'
    }
  },
  {
    path: '/dikemas',
    name: 'dikemas',
    component: () => import('@/views/Transaksi/Transaksi.vue'),
    meta: {
      title: 'Transaksi - Dikemas'
    }
  },
  {
    path: '/dikirim',
    name: 'dikirim',
    component: () => import('@/views/Transaksi/Transaksi.vue'),
    meta: {
      title: 'Transaksi - Dikirim'
    }
  },
  {
    path: '/riwayat-pesanan',
    name: 'riwayat_pesanan',
    component: () => import('@/views/Transaksi/Transaksi.vue'),
    meta: {
      title: 'Transaksi - Riwayat Pesanan'
    }
  },
  {
    path: '/detail-pesanan/:id',
    name: 'detail_pesanan',
    component: () => import('@/views/Transaksi/Detail/Detail.vue'),
    meta: {
      title: 'Transaksi - Detail Transaksi'
    }
  },
  {
    path: '/setting/about',
    name: 'about',
    component: () => import('@/views/Pages/SettingsView.vue'),
    meta: {
      title: 'Atur Halaman'
    }
  },
  {
    path: '/setting/partnership',
    name: 'partnership',
    component: () => import('@/views/Pages/SettingsView.vue'),
    meta: {
      title: 'Atur Halaman'
    }
  },
  {
    path: '/setting/contact',
    name: 'contact',
    component: () => import('@/views/Pages/SettingsView.vue'),
    meta: {
      title: 'Atur Halaman'
    }
  },
  {
    path: '/setting/blog',
    name: 'blog',
    component: () => import('@/views/Pages/SettingsView.vue'),
    meta: {
      title: 'Atur Halaman'
    }
  },
]

console.log(`ie history`, import.meta.env.VITE_BASE_URL)
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token')
  const userData = localStorage.getItem('userData')
  const isAuth = userData ? JSON.parse(userData) : null


  if (!token || !isAuth) {
    if (to.name !== 'login') {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    if (to.name === 'login') {
      next(router.back()) // Redirect to dashboard or another authenticated route
    } else {
      document.title = `${to.meta.title} - TNT Snacks`
      next()
    }
  }
  // next()
})

export default router

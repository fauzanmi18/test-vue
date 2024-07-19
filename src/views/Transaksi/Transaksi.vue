<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import PesananComp from '@/components/Tables/Transaksi/PesananComp.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const currentUrl = ref(route.fullPath)

const pageTitle = ref('')
const parentProps = ref(null)

const updatePageDetails = (url) => {
  pageTitle.value = url.includes('pesanan-baru') ? 'Transaksi - Pesanan Baru'
    : url.includes('partnership') ? 'Atur Partnership'
    : url.includes('blog') ? 'Atur Blog'
    : 'Atur Contact'

  parentProps.value = url.includes('pesanan-baru') ? 1
    : url.includes('dikemas') ? 2
    : url.includes('dikirim') ? 3
    : 4
}

// Initial update when the component is first mounted
onMounted(() => {
  updatePageDetails(currentUrl.value)
})

watch(route, (newRoute) => {
  currentUrl.value = newRoute.fullPath
  updatePageDetails(newRoute.fullPath)
})
  


</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
       
      <PesananComp :transaksiType="parentProps"/>
    </div>
  </DefaultLayout>
</template>

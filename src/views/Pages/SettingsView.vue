<script setup>
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
// import SettingsCard from '@/components/SettingsCard.vue'
import About from '@/components/Pages/About.vue'
import Blog from '@/components/Pages/Blog.vue'
import Partnership from '@/components/Pages/NewPartnership.vue'
import Contact from '@/components/Pages/Contact.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const currentUrl = ref(route.fullPath)

const pageTitle = ref(
  currentUrl.value.includes('about') ? 'Atur About'
: currentUrl.value.includes('partnership') ? 'Atur Partnership'
: currentUrl.value.includes('blog') ? 'Atur Blog'
: 'Atur Contact'
)

watch(route, (newRoute) => {
  currentUrl.value = newRoute.fullPath
  pageTitle.value = newRoute.fullPath.includes('about') ? 'Atur About'
  : newRoute.fullPath.includes('partnership') ? 'Atur Partnership'
  : newRoute.fullPath.includes('blog') ?  'Atur Blog'
  : 'Atur Contact'
})
  

</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <About v-if="currentUrl.includes('about')"/>
      <Partnership v-if="currentUrl.includes('partnership')"/>
      <Contact v-if="currentUrl.includes('contact')"/>
      <Blog v-if="currentUrl.includes('blog')"/>
    </div>
  </DefaultLayout>
</template>

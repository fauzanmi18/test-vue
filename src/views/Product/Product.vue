<script setup>
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import TableProduct from '@/components/Tables/TableProduct.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Product Datas')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col">
      <TableProduct />
    </div>
  </DefaultLayout>
</template>

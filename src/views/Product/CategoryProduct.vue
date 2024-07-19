<script setup>
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import TableProductCategory from '@/components/Tables/TableCategoryProduct.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Product Category')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col">
      <TableProductCategory />
    </div>
  </DefaultLayout>
</template>

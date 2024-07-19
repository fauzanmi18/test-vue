<script setup>
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TableCustomers from '@/components/Tables/TableCustomers.vue'

const pageTitle = ref('Customer Datas')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <TableCustomers/>
  </DefaultLayout>
</template>

<template>
    <nav class="pb-1 pt-2">
        <ul class="flex flex-wrap items-center gap-2">
            <li>
                <button 
                    @click="$emit('changePage', currentPage - 1, query, isPayment)" 
                    :disabled="currentPage == 1" 
                    :class="{'router-link-active router-link-exact-active cursor-not-allowed': currentPage == 1}"
                    class="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                > 
                    Previous 
                </button>
            </li>
            <li v-for="page in pagesToShow" :key="page">
                <button 
                    @click="$emit('changePage', page, query, isPayment)" 
                    :class="['flex items-center justify-center rounded py-1.5 px-3 font-medium dark:hover:bg-primary hover:bg-primary hover:text-white', { 'bg-[#EDEFF1] dark:bg-graydark text-black dark:text-white': currentPage == page }]"
                    class="text-xs"
                >
                    {{ page }}
                </button>
            </li>
            <li>
                <button 
                    @click="$emit('changePage', currentPage + 1, query, isPayment)" 
                    :disabled="currentPage == lastPage"
                    :class="{'router-link-active router-link-exact-active cursor-not-allowed': currentPage == lastPage}"
                    class="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
                > 
                    Next 
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: Number,
    lastPage: Number,
    prevPageUrl: String,
    nextPageUrl: String,
    query: String,
    isPayment: String
})

console.log(`props yeuh`,props)

const pagesToShow = computed(() => {
    const pageCount = 5;
    const startPage = Math.floor((props.currentPage - 1) / pageCount) * pageCount + 1;
    const endPage = Math.min(startPage + pageCount - 1, props.lastPage);
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
});
</script>
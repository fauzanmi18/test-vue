<script setup>
import { watch, onMounted, ref } from 'vue'
import ModalDetail from '@/components/Modal/Customer/Customer.vue'
import LoadingTable from '@/components/Tables/loading.vue'
import Notification from '@/components/Notification/Notification.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import initAPI from '@/api/api'
import Cookies from 'js-cookie'
import { debounce } from 'lodash'

const loadingData = ref(false)
const customers = ref([])
const detailDataCustomers = ref([])
const customersMisc = ref({
  totalHalaman: '',
  itemsPerPage: '',
  currPage: '',
  nextPage: '',
  prevPage: '',
  lastPage: '',
  totalDari: '',
  totalKe: '',
  totalData: ''
})

const searchQuery = ref('')

const isModalDetail = ref(false)

const toggleModal = (id) => {
  if(detailDataCustomers.value.length == 0){
    const unik = customers.value.find(item => item.id === id)
    detailDataCustomers.value = unik
  } else {
    detailDataCustomers.value = []
  }
  isModalDetail.value = !isModalDetail.value
}

const showNotification = ref(false)
const notificationType = ref('')
const notificationMsg = ref('')

const toggleNotif = (type, msg) => {
  showNotification.value = !showNotification.value
  notificationType.value = type
  notificationMsg.value = msg
}

const getDataUser = async(page = 1, query = '') => {
  try {
    loadingData.value = !loadingData.value

    let endpoint = query !== ''
    ? `users?page=${page}&search=${query}`
    : `users?page=${page}`
    const token = Cookies.get('token')
    const response = await initAPI('get', endpoint, null, token)
  
    customers.value = response.data.data
    customersMisc.value.totalHalaman = response.data.last_page
    customersMisc.value.itemsPerPage = response.data.per_page
    customersMisc.value.currPage = response.data.current_page
    customersMisc.value.nextPage = response.data.next_page_url
    customersMisc.value.prevPage = response.data.prev_page_url
    customersMisc.value.lastPage = response.data.last_page
    customersMisc.value.totalDari = response.data.from
    customersMisc.value.totalKe = response.data.to
    customersMisc.value.totalData = response.data.total
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data customer')
  } finally {
    loadingData.value = !loadingData.value
  }
}

onMounted(() => {
  getDataUser()
})

const debouncedGetData = debounce((page, query) => {
  getDataUser(page, query)
}, 400)

watch(searchQuery, (newQuery) => {
  debouncedGetData(1, newQuery)
})
</script>

<template>
  <ModalDetail 
    @closeModal="toggleModal" v-if="isModalDetail" :detailData="detailDataCustomers"
  />

  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

  <div class="flex justify-end mb-4 font-medium">
    <input
    type="text"
    v-model="searchQuery"
    placeholder="Cari product..."
    class="rounded border-[1.5px] text-black border-stroke bg-white py-2 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>

  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <LoadingTable v-if="loadingData"/>

    <div v-if="!loadingData" class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-2 text-left dark:bg-meta-4">
            <th class="py-4 px-4 font-medium text-black dark:text-white">
              No
            </th>
            <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Nama
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              No Telp
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Kode POS
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="customers.length === 0">
            <td colspan="7" class="py-5 px-4 text-center font-medium text-black dark:text-white">Data kosong</td>
          </tr>
          <tr v-else v-for="(item, index) in customers" :key="index">
            <td class="py-5 px-4">
              <h5 class="font-medium text-black dark:text-white">{{ index + 1 }}</h5>
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <h5 class="font-medium text-black dark:text-white">
                {{ item.first_name }} {{ item.last_name }}
              </h5>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">
                {{ item.number }}
              </p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">
                {{ item.postal_code }}
              </p>
            </td>
            <td class="py-5 px-4">
              <div class="flex items-center space-x-3.5">
                <button @click="toggleModal(item.id)" class="border border-primary font-medium px-4 py-2 rounded-lg flex items-center gap-1 text-primary hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#3C50E0" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                  Detail
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="customers.length > 0" class="mt-4 flex justify-between items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <Pagination
      :currentPage="customersMisc.currPage" 
      :lastPage="customersMisc.lastPage"
      :prevPageUrl="customersMisc.prevPage"
      :nextPageUrl="customersMisc.nextPage"
      :query="searchQuery" 
      @changePage="getDataUser"
    />
    <span class="text-xs text-black dark:text-white font-medium">
      {{ customersMisc.totalKe }} Data dari {{ customersMisc.totalData }} total data.
      </span>
  </div>
</template>

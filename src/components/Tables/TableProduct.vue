<template>
  <Transition name="modal">
    <Modal 
      @closeModal="showModal" @refreshData="getData" v-if="isModalOpen"
      :detailData="detailData" :method="methodType" @sendNotif="toggleNotif"
    />
  </Transition>

  <DialogDelete 
  @toggleDialog="toggleModalDelete" @action="deleteProduct" v-if="isModalDelete"
  :modalTitle="methodType == 'active' ? 'Aktifkan product ini?' : 'Non-aktifkan product ini?'"
  :modalMessage="methodType == 'active' ? 'Product akan di aktifkan kembali' : 'Product akan di non-aktif kan'"
  :method="methodType" 
  />

  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

    <div class="flex justify-between mb-4 font-medium">
        <button @click="showModal(), methodType = 'Tambah'" class="bg-primary px-4 py-2 rounded-lg text-white">
            Tambah Product
        </button>
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
      <table class="max-w-full overflow-x-auto table-auto">
        <thead>
          <tr class="bg-gray-2 text-left dark:bg-meta-4">
            <th class="py-4 px-4 font-medium text-black dark:text-white">
              No
            </th>
            <th class="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Gambar
            </th>
            <th class="min-w-full py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Nama
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Harga
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Stock
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="7" class="py-5 px-4 text-center font-medium text-black dark:text-white">Data kosong</td>
          </tr>
          <tr v-else v-for="(item, index) in products" :key="index">
            <td class="py-5 px-4">
              <h5 class="font-medium text-black dark:text-white">
                {{ (productsMisc.currPage - 1) * productsMisc.itemsPerPage + index + 1 }}
              </h5>
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <img 
              :src="baseImgUrl+item.images" 
              alt="Foto Produk">
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <h5 class="font-medium text-black dark:text-white">{{ item.name }}</h5>
            </td>
            <td class="py-5 px-4">
                <p class="text-black dark:text-white text-sm">{{ item.price }}</p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">{{ item.stock }}</p>
            </td>
            <td class="py-5 px-4">
              <p
                class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium"
                :class="{
                  'bg-danger text-danger': item.status === 'Non Active',
                  'bg-success text-success': item.status === 'Active'
                }"
              >
                {{ item.status }}
              </p>
            </td>
            <td class="py-5 px-4">
              <div class="flex items-center space-x-3.5">
                <button @click="btnAction(item.id, 'detail')" class="hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                </button>

                <button @click="btnAction(item.id, 'edit')" class="hover:text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                </button>

                <button v-if="item.status == 'Active'" @click="btnAction(item.id, 'delete')" class="hover:text-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>

                <button v-if="item.status == 'Non Active'" @click="btnAction(item.id, 'active')" class="hover:text-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="products.length > 0" class="mt-4 flex justify-between items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <Pagination
      :currentPage="productsMisc.currPage" 
      :lastPage="productsMisc.lastPage"
      :prevPageUrl="productsMisc.prevPage"
      :nextPageUrl="productsMisc.nextPage"
      :query="searchQuery" 
      @changePage="getData"
    />
    <span class="text-xs text-black dark:text-white font-medium">
      {{ productsMisc.totalKe }} Data dari {{ productsMisc.totalData }} total data.
      </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Modal from '@/components/Modal/Product/Modal.vue'
import Notification from '@/components/Notification/Notification.vue'
import DialogDelete from '@/components/Dialog/Dialog.vue'
import LoadingTable from '@/components/Tables/loading.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import Cookies from 'js-cookie'
import initAPI from '@/api/api.js'
import { debounce } from 'lodash'

const baseImgUrl = import.meta.env.VITE_API_BASE_URL+'open/products/'

const showNotification = ref(false)
const notificationType = ref('')
const notificationMsg = ref('')

const toggleNotif = (type, msg) => {
  showNotification.value = !showNotification.value
  notificationType.value = JSON.parse(localStorage.getItem('initNotif')) 
  ? JSON.parse(localStorage.getItem('initNotif')).type 
  : type
  notificationMsg.value = JSON.parse(localStorage.getItem('initNotif'))
  ? JSON.parse(localStorage.getItem('initNotif')).msg
  : msg

  if(JSON.parse(localStorage.getItem('initNotif'))) localStorage.removeItem('initNotif')
}

const products = ref([])
const productsMisc = ref({
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

const loadingData = ref(false)

const getData = async(page = 1, query = '') => {
  try {
    loadingData.value = true

    let endpoint = query !== ''
    ? `products?page=${page}&search=${query}`
    : `products?page=${page}`

    const response = await initAPI('get', endpoint, null, null)

    products.value = response.data.data
    productsMisc.value.totalHalaman = response.data.last_page
    productsMisc.value.itemsPerPage = response.data.per_page
    productsMisc.value.currPage = response.data.current_page
    productsMisc.value.nextPage = response.data.next_page_url
    productsMisc.value.prevPage = response.data.prev_page_url
    productsMisc.value.lastPage = response.data.last_page
    productsMisc.value.totalDari = response.data.from
    productsMisc.value.totalKe = response.data.to
    productsMisc.value.totalData = response.data.total
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data')
  } finally {
    loadingData.value = false
  }

}

onMounted(() => {
  getData()
})

const debouncedGetData = debounce((page, query) => {
  getData(page, query)
}, 400)

watch(searchQuery, (newQuery) => {
  debouncedGetData(1, newQuery)
})

const isModalOpen = ref(false)
const isModalDelete = ref(false)

const showModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const toggleModalDelete = () => {
  isModalDelete.value = !isModalDelete.value
}

const detailData = ref(null)
const methodType = ref(null)
const updateStatus = ref({
  id: '',
  status: ''
})

const btnAction = (id, method) => {
  if(method == 'edit' || method == 'detail'){
      const unik = products.value.find(item => item.id === id)
      detailData.value = unik
      methodType.value = method
      showModal()
  } else {
    updateStatus.value.id = id
    updateStatus.value.status = method == 'delete' ? 0 : 1
    methodType.value = method
    toggleModalDelete()
  }
}

const deleteProduct = async() => {
  try {
    const token = Cookies.get('token')
    const formData = new FormData
    formData.append('status', updateStatus.value.status)

    const response = await initAPI('delete', 'products/'+updateStatus.value.id, formData, token)
    console.log(response.data)
    toggleNotif('Success', response.data.message)
    getData()
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat menghapus data')
  } finally {
    getData()
  }
}
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>

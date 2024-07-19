<script setup>
import { onMounted, ref, watch } from 'vue'
import Modal from '@/components/Modal/CategoryProduct/Modal.vue'
import Notification from '@/components/Notification/Notification.vue'
import DialogDelete from '@/components/Dialog/Dialog.vue'
import LoadingTable from '@/components/Tables/loading.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import Cookies from 'js-cookie'
import initAPI from '@/api/api.js'
import { debounce } from 'lodash'

const baseImgUrl = import.meta.env.VITE_API_BASE_URL+'open/products_categories/'

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

const loadingData = ref(false)
const categories = ref([])
const categoriesMisc = ref({
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

const getData = async(page = 1, query = '') => {
  try {
    loadingData.value = true

    let endpoint = query !== '' 
      ? `products-categories?page=${page}&search=${query}`
      : `products-categories?page=${page}`

    const response = await initAPI('get', endpoint, null, null)
    console.log(`respon yeuh`,response.data)

    categories.value = response.data.data
    categoriesMisc.value.totalHalaman = response.data.last_page
    categoriesMisc.value.itemsPerPage = response.data.per_page
    categoriesMisc.value.currPage = response.data.current_page
    categoriesMisc.value.nextPage = response.data.next_page_url
    categoriesMisc.value.prevPage = response.data.prev_page_url
    categoriesMisc.value.lastPage = response.data.last_page
    categoriesMisc.value.totalDari = response.data.from
    categoriesMisc.value.totalKe = response.data.to
    categoriesMisc.value.totalData = response.data.total
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

const isModalDelete = ref(false)
const isModalOpen = ref(false)

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
  if(method == 'edit'){
    const unik = categories.value.find(item => item.id === id)
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

const deleteCategory = async() => {
  try {
    const token = Cookies.get('token')
    const formData = new FormData
    formData.append('status', updateStatus.value.status)

    const response = await initAPI('post', 'products-categories/'+updateStatus.value.id, formData, token)
    console.log(response.data)
    toggleNotif('Success', response.data.message)
    getData()
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat merubah status')
  } finally {
    getData()
  }
}
</script>

<template>
  <Transition name="modal">
    <Modal 
    @closeModal="showModal" @refreshData="getData" v-if="isModalOpen"
    :detailData="detailData" :method="methodType" @sendNotif="toggleNotif"
    />
  </Transition>

  <DialogDelete 
  @toggleDialog="toggleModalDelete" @action="deleteCategory" v-if="isModalDelete"
  :modalTitle="methodType == 'active' ? 'Aktifkan kategori ini?' : 'Non-aktif kan kategori ini?'"
  :modalMessage="methodType == 'active' ? 'Kategori akan di aktifkan kembali' : 'Kategori akan di non-aktif kan'"
  :method="methodType" 
  />

  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

  <div class="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between mb-4 font-medium">
      <button @click="showModal" class="bg-primary px-4 py-2 rounded-lg text-white">
          Tambah Kategori
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
            <th class="min-w-[550px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Nama Category
            </th>
            <th class="min-w-full py-4 px-4 font-medium text-black dark:text-white">
                Status
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-if="categories.length === 0">
            <td colspan="5" class="py-5 px-4 text-center font-medium text-black dark:text-white">Data kosong</td>
          </tr>
          <tr v-else v-for="(item, index) in categories" :key="index">
            <td class="py-5 px-4">
              <h5 class="font-medium text-black dark:text-white">
                {{ (categoriesMisc.currPage - 1) * categoriesMisc.itemsPerPage + index + 1 }}
              </h5>
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <img :src="baseImgUrl+item.image">
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <h5 class="font-medium text-black dark:text-white">{{ item.name }}</h5>
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
                <button @click="btnAction(item.id, 'edit')" class="hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                </button>

                <button v-if="item.status == 'Active'" @click="btnAction(item.id, 'delete')" class="hover:text-danger">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
                </button>

                <button v-if="item.status == 'Non Active'" @click="btnAction(item.id, 'active')" class="hover:text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" class="fill-current" width="21" height="21" fill="#000000" viewBox="0 0 256 256"><path d="M120,128V48a8,8,0,0,1,16,0v80a8,8,0,0,1-16,0Zm60.37-78.7a8,8,0,0,0-8.74,13.4C194.74,77.77,208,101.57,208,128a80,80,0,0,1-160,0c0-26.43,13.26-50.23,36.37-65.3a8,8,0,0,0-8.74-13.4C47.9,67.38,32,96.06,32,128a96,96,0,0,0,192,0C224,96.06,208.1,67.38,180.37,49.3Z"></path></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="categories.length > 0" class="mt-4 flex justify-between items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <Pagination
      :currentPage="categoriesMisc.currPage" 
      :lastPage="categoriesMisc.lastPage"
      :prevPageUrl="categoriesMisc.prevPage"
      :nextPageUrl="categoriesMisc.nextPage"
      :query="searchQuery" 
      @changePage="getData"
    />
    <span class="text-sm text-black dark:text-white font-medium">
      {{ categoriesMisc.totalKe }} Data dari {{ categoriesMisc.totalData }} total data.
      </span>
  </div>
</template>

<style scoped>
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

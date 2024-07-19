<script setup>
import { watch, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDetail from '@/components/Modal/Customer/Customer.vue'
import Dialog from '@/components/Dialog/Dialog.vue'
import LoadingTable from '@/components/Tables/loading.vue'
import Notification from '@/components/Notification/Notification.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import initAPI from '@/api/api'
import Cookies from 'js-cookie'
import { debounce } from 'lodash'
import { PhFileMagnifyingGlass, PhCaretDown, PhPackage, PhTruck, PhHandshake } from "@phosphor-icons/vue"
import { onClickOutside } from '@vueuse/core'

const props = defineProps(['transaksiType'])
watch(() => props.transaksiType, (newVal, oldVal) => {
  // console.log(`old`, oldVal)
  // console.log('transaksiType changed:', newVal)
  localStorage.setItem('transaksiType', newVal)
  getDataTransaksi(newVal, 1, "")
})

const loadingData = ref(false)
const router = useRouter()
const transaksi = ref([])
const detailDatatransaksi = ref([])
const transaksiMisc = ref({
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
const currentIsPayment = ref('')

const isModalDetail = ref(false)

const toggleModal = (id) => {
  if(detailDatatransaksi.value.length == 0){
    const unik = transaksi.value.find(item => item.id === id)
    detailDatatransaksi.value = unik
  } else {
    detailDatatransaksi.value = []
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

const getDataTransaksi = async(typeTransaksi = '', page = 1, query = '', isPayment = '') => {
  try {
    loadingData.value = !loadingData.value

    if (typeTransaksi === '') {
      typeTransaksi = localStorage.getItem('transaksiType') || ''
    }

    // Build the endpoint based on the provided parameters
    let endpoint = `users/transactions?status=${typeTransaksi}&page=${page}`

    if (query !== '') {
      endpoint += `&search=${query}`
    }

    if (isPayment !== '') {
      endpoint += `&is_payment=${isPayment}`
    }
    
    const token = Cookies.get('token')
    const response = await initAPI('get', endpoint, null, token)
  
    transaksi.value = response.data.data
    transaksiMisc.value.totalHalaman = response.data.last_page
    transaksiMisc.value.itemsPerPage = response.data.per_page
    transaksiMisc.value.currPage = response.data.current_page
    transaksiMisc.value.nextPage = response.data.next_page_url
    transaksiMisc.value.prevPage = response.data.prev_page_url
    transaksiMisc.value.lastPage = response.data.last_page
    transaksiMisc.value.totalDari = response.data.from
    transaksiMisc.value.totalKe = response.data.to
    transaksiMisc.value.totalData = response.data.total
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data Transaksi')
  } finally {
    loadingData.value = !loadingData.value
  }
}

onMounted(() => {
  getDataTransaksi()
})

const debouncedGetData = debounce((type, page, query, isPayment) => {
  getDataTransaksi(type, page, query, isPayment)
}, 400)

watch(searchQuery, (newQuery) => {
  debouncedGetData('', 1, newQuery, currentIsPayment.value !== '' ? currentIsPayment.value : '')
})

const openInNewTab = (id) => {
  const unik = transaksi.value.find(item => item.id === id)
  localStorage.setItem('dataDetailPesanan', JSON.stringify(unik))
  
  const url = router.resolve({ name: 'detail_pesanan', params: { id: id } }).href
  window.open(url, '_blank')
  localStorage.setItem('detailId', id)
}

const getDataByFilter = (type) => {
  console.log(`type`, type)
  if (type === 'yes') {
    currentIsPayment.value = true
    getDataTransaksi('', 1, searchQuery.value ? searchQuery.value : '', true)
  } else {
    currentIsPayment.value = false
    getDataTransaksi('', 1, searchQuery.value ? searchQuery.value : '', false)
  }
  toggleFilter()
  isButtonResetFilter.value = true
}

const showFilter = ref(null)
const showFilterRef = ref(null)
const isButtonResetFilter = ref(null)
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}

onClickOutside(showFilterRef, () => toggleFilter())

const resetFilter = () => {
  isButtonResetFilter.value = false
  currentIsPayment.value = '';
  getDataTransaksi('', 1, searchQuery.value ? searchQuery.value : '', '')
}

const sentDataTransaksi = (page, query, isPayment) => {
  getDataTransaksi('', page, query, isPayment);
}

const isShowDialog = ref(false)
const transaksiUpdateId = ref(null)
const transaksiStatusId = ref(null)
const updatePesanan = async() => {
  if(transaksiUpdateId.value){
    console.log(`bakal di update ${transaksiUpdateId.value} - ${transaksiStatusId.value}`)

    const token = Cookies.get('token')

    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('status', transaksiStatusId.value)

    try {
      const response = await initAPI('post', `users/transactions/${transaksiUpdateId.value}`, formData, token)
      toggleNotif('Success', response.data.message)
      getDataTransaksi(JSON.parse(localStorage.getItem('transaksiType')))
      // getDataTransaksi('', 1, searchQuery.value ? searchQuery.value : '', currentIsPayment.value ? true : false)
    } catch (error) {
      console.log(error)
      toggleNotif('Error', 'Terjadi kesalahan saat update status pesanan')
    }

  }
}

const toggleDialog = (id, status_id) => {
  if(!isShowDialog.value){
    isShowDialog.value = true
    transaksiUpdateId.value = id
    transaksiStatusId.value = status_id
  } else {
    isShowDialog.value = false
  }
}
</script>

<template>
  <ModalDetail 
    @closeModal="toggleModal" v-if="isModalDetail" :detailData="detailDataCustomers"
  />

  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

  <Dialog
  @toggleDialog="toggleDialog" @action="updatePesanan" v-if="isShowDialog"
  modalTitle="Ubah status pesanan?"
  modalMessage="Status pesanan untuk transaksi ini akan diubah."
  method="update_pesanan" 
  />

  <div class="flex justify-between mb-4 font-medium">
    <div class="flex items-center gap-2">
      <div class="relative inline-block">
        <a @click="toggleFilter" class="cursor-pointer inline-flex items-center gap-2.5 rounded bg-white dark:text-white dark:border-form-strokedark dark:bg-form-input py-3 px-5.5 font-medium text-black hover:bg-opacity-95">
            Filter Status Bayar
            <span><PhCaretDown/></span>
        </a>
        <div ref="showFilterRef" v-if="showFilter" class="absolute left-0 top-full z-40 mt-2 w-full rounded-md bg-white dark:text-white dark:border-form-strokedark dark:bg-form-input py-3 shadow-card" style="">
            <ul class="flex flex-col">
                <li><a @click="getDataByFilter('yes')" class="cursor-pointer flex py-2 px-5 font-medium text-bodydark2 hover:text-black dark:hover:text-white">
                  Telah Dibayar
                </a></li>
                <li><a @click="getDataByFilter('no')" class="cursor-pointer flex py-2 px-5 font-medium text-bodydark2 hover:text-black dark:hover:text-white">
                  Belum Dibayar
                </a></li>
            </ul>
        </div>
      </div>

      <button v-if="isButtonResetFilter" @click="resetFilter" class="w-6 h-6 text-xs bg-danger text-white rounded-lg">X</button>  
  </div>


    <input
    type="text"
    v-model="searchQuery"
    placeholder="Cari transaksi..."
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
            <th class="py-4 px-3 w-[40px] font-medium text-black dark:text-white">
              No
            </th>
            <th class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Nama
            </th>
            <th class="min-w-[30px] max-w-[30px] py-4 px-4 font-medium text-black dark:text-white">
              Qty
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Total Pesanan
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Status
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Status Pembayaran
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="transaksi.length === 0">
            <td colspan="7" class="py-5 px-4 text-center font-medium text-black dark:text-white">Data kosong</td>
          </tr>
          <tr v-else v-for="(item, index) in transaksi" :key="index">
            <td class="py-5 px-4">
              <h5 class="font-medium text-black dark:text-white">{{ index + 1 }}</h5>
            </td>
            <td class="py-5 px-4 pl-9 xl:pl-11">
              <h5 class="font-medium text-black dark:text-white">
                {{ item.user.users_details.first_name }} {{ item.user.users_details.last_name }}
              </h5>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">
                {{ item.qty }}
              </p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">
                {{ item.total_price }}
              </p>
            </td>
            <td class="py-5 px-4">
              <p class="text-black dark:text-white">
                {{ item.status }}
              </p>
            </td>
            <td class="py-5 px-4">
              <p :class="{'bg-success text-success': item.payment_status == 'Telah dibayar', 
              'bg-danger text-danger': item.payment_status !== 'Telah dibayar'}" class="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium">
                {{ item.payment_status }}
              </p>
            </td>
            <td class="py-5 px-4">
              <div class="flex items-center space-x-3.5">
                <div v-if="item.payment_status == 'Telah dibayar'" class="flex items-center gap-1">
                  <button @click="openInNewTab(item.id)" class="font-medium rounded-lg flex items-center gap-1 text-primary text-lg">
                    <PhFileMagnifyingGlass :size="32"/>
                  </button>
                  <span v-if="item.status !== 'Pesanan selesai'" class="font-semibold text-black dark:text-white text-xl">-</span>
                  <button @click="toggleDialog(
                    item.id, 
                    item.status == 'Pesanan dibuat' ? 2 :
                    item.status == 'Pesanan dikonfirmasi' ? 3 :
                    item.status == 'Pesanan dikirim' ? 4 :
                    item.status == 'Pesanan selesai' ? 5 :
                    null
                  )" class="font-medium rounded-lg flex items-center gap-1 text-success text-lg">
                    <PhPackage v-if="item.status == 'Pesanan dibuat'" :size="32"/>
                    <PhTruck v-if="item.status == 'Pesanan dikonfirmasi'" :size="32"/>
                    <PhHandshake v-if="item.status == 'Pesanan dikirim'" :size="32"/>
                  </button>
                </div>

                <span v-else class="mx-auto text-black text-center dark:text-white">
                  No Action
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="transaksi.length > 0" class="mt-4 flex justify-between items-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <Pagination
      :currentPage="transaksiMisc.currPage" 
      :lastPage="transaksiMisc.lastPage"
      :prevPageUrl="transaksiMisc.prevPage"
      :nextPageUrl="transaksiMisc.nextPage"
      :query="searchQuery"
      :isPayment="currentIsPayment" 
      @changePage="sentDataTransaksi"
    />
    <span class="text-xs text-black dark:text-white font-medium">
      {{ transaksiMisc.totalKe }} Data dari {{ transaksiMisc.totalData }} total data.
      </span>
  </div>
</template>

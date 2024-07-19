<script setup>
import { watch, onMounted, ref } from 'vue'
import DOMPurify from 'dompurify'
import initAPI from '@/api/api'
import Cookies from 'js-cookie'
import Notification from '@/components/Notification/Notification.vue'
import LoadingTable from '@/components/Tables/loading.vue'

const baseImgUrl = import.meta.env.VITE_API_BASE_URL+'open/pages/'
const loadingSubmit = ref(false)

const formReady = ref(false)
const selectedImages = ref([])
const loadingData = ref(false)
const contact = ref([])
const sections = ref([{ title: '', content: '' }])
const showNotification = ref(false)
const notificationType = ref('')
const notificationMsg = ref('')

const toggleNotif = (type, msg) => {
  showNotification.value = !showNotification.value
  notificationType.value = type
  notificationMsg.value = msg
}

const getDataUser = async() => {
  try {
    loadingData.value = !loadingData.value

    const token = Cookies.get('token')
    const response = await initAPI('get', 'pages?page_type=contact&status=1', null, token)
    
    contact.value = response.data.data
    if(response.data.data.length > 0) formReady.value = true

    // Populate sections with API data
    sections.value = contact.value.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content
    }))

  } catch (error) {
    console.log(error)
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data Contact')
  } finally {
    loadingData.value = !loadingData.value
  }
}

onMounted(() => {
  getDataUser()
})

const addSection = () => {
  sections.value.push({ title: '', content: '' })
}

const btnAction = async(type, id, sectionIndex) => {
  loadingSubmit.value = !loadingSubmit.value
  const token = Cookies.get('token')

  const formData = new FormData
  formData.append('page', 'contact')
  formData.append('title', DOMPurify.sanitize(sections.value[sectionIndex].title))
  formData.append('content', DOMPurify.sanitize(sections.value[sectionIndex].content))
  selectedImages.value.forEach((image, index) => {
    formData.append(`images[${index}]`, image.file)
  })
  if(type == 'edit'){
    formData.append('_method', 'put')
  }

  try {
    const response = await initAPI(
      'post', type == 'tambah' ? 'pages' : type == 'edit' ? `pages/${id}` : 'pages', formData, token
    )
    toggleNotif('Success', response.data.message)
    getDataUser()
  } catch (error) {
    console.log(error)
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data contact')
  } finally {
    loadingSubmit.value = !loadingSubmit.value
  }
}
</script>

<template>
  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

  <LoadingTable v-if="loadingData"/>

  <div v-if="!formReady && contact.length == 0 && sections.length == 0">
    <div
      class="w-full rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="flex flex-col py-4 justify-center items-center">
        <h1 class="mb-4 font-medium block text-black dark:text-white">Anda belum menambah konten halaman contact.</h1>
        <button @click="formReady = !formReady, addSection()" class="px-4 py-2 bg-primary text-white font-medium rounded-lg">
          Tambah Konten
        </button>
      </div>
    </div>
  </div>

  <button v-if="formReady && sections.length > 0" @click="addSection" class="mb-2 px-4 py-2 bg-primary text-white font-medium rounded-lg">
      Tambah Section
  </button>

  <div v-if="formReady && sections.length > 0" class="grid grid-cols-2 gap-2">
    <div v-for="(section, index) in sections" :key="index"
      class="w-full min-h-[305px] rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="w-full flex flex-col gap-2">
        <div class="mb-4.5 font-medium">
          <label class="mb-2.5 block text-black dark:text-white">
            Section {{ index + 1 }}
          </label>
          <input
            type="text"
            placeholder="Title"
            v-model="section.title"
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div class="mb-4.5 font-medium">
          <label class="mb-2.5 block text-black dark:text-white">
            Konten
          </label>
          <input
            type="text"
            placeholder="Title"
            v-model="section.content"
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>

        <div class="flex justify-end gap-2 mb-4">
          <button v-if="!section.id && !loadingSubmit" @click="btnAction('tambah', null, index)" class="text-white font-medium bg-primary px-4 py-2 rounded-lg">
            Tambah
          </button>
          <button v-if="section.id && !loadingSubmit" @click="btnAction('edit', section.id, index)" class="text-white font-medium bg-primary px-4 py-2 rounded-lg">
            Edit
          </button>
          <button v-if="loadingSubmit" class="text-white font-medium bg-primary bg-opacity-70 px-4 py-2 rounded-lg">
            Loading..
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

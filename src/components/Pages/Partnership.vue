<script setup>
import { watch, onMounted, ref } from 'vue'

import initAPI from '@/api/api'
import Cookies from 'js-cookie'
import Notification from '@/components/Notification/Notification.vue'
import LoadingTable from '@/components/Tables/loading.vue'

const baseImgUrl = import.meta.env.VITE_API_BASE_URL+'open/pages/'

const hasImage = ref(false)
const selectedImages = ref([])
const loadingData = ref(false)
const about = ref([])
const title = ref('')
const konten = ref('')

const showNotification = ref(false)
const notificationType = ref('')
const notificationMsg = ref('')

const toggleNotif = (type, msg) => {
  showNotification.value = !showNotification.value
  notificationType.value = type
  notificationMsg.value = msg
}

const getDataUser = async() => {
  if(about.value.length > 0){
    about.value.length = 0
  }
  try {
    loadingData.value = !loadingData.value

    const token = Cookies.get('token')
    const response = await initAPI('get', 'pages?page_type=partnership&status=1', null, token)
    
    about.value = response.data.data
    title.value = response.data.data[0].title
    konten.value = response.data.data[0].content
    // selectedImages.value = response.data.data[0].images
    hasImage.value = true
  } catch (error) {
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data About')
  } finally {
    loadingData.value = !loadingData.value
  }
}

onMounted(() => {
  getDataUser()
})

const isTambahKonten = ref(false)

const toggleForm = () => {
  isTambahKonten.value = !isTambahKonten.value
}

const onFileChange = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        selectedImages.value.push({ url, file });
    });
};

const btnAction = async(type, id) => {
  console.log(`${type} - ${id}`)
  const token = Cookies.get('token')

  const formData = new FormData
  formData.append('page', 'partnership')
  formData.append('title', title.value)
  formData.append('content', konten.value)
  selectedImages.value.forEach((image, index) => {
    console.log('Appending image file:', image.file) // Log each file
    formData.append(`images[${index}]`, image.file)
  })
  if(type == 'edit'){
    formData.append('_method', 'put')
  }

  try {
    const response = await initAPI(
      'post', type == 'tambah' ? 'pages' : type == 'edit' ? `pages/${id}` : 'pages', formData, token
    )
    console.log(response.data)
    toggleNotif('Success', response.data.message)
  } catch (error) {
    console.log(error)
    toggleNotif('Error', 'Terjadi kesalahan saat mengambil data About')
  } finally{
    getDataUser()
  }

}
</script>

<template>
  <Notification v-if="showNotification" @toggle="toggleNotif"
  :type="notificationType" :message="notificationMsg"
  />

  <LoadingTable v-if="loadingData"/>

  <div v-if="about.length == 0 && !isTambahKonten">
    <div
      class="w-full rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="flex flex-col py-4 justify-center items-center">
        <h1 class="mb-4 font-medium text-white">Anda belum menambah konten halaman About.</h1>
        <button @click="toggleForm" class="px-4 py-2 bg-primary text-white font-medium rounded-lg">
          Tambah Konten
        </button>
      </div>
    </div>
  </div>

  <div v-if="about.length > 0 || isTambahKonten" class="flex flex-col gap-2">
    <div
      class="w-full min-h-[340px] rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="flex flex-col gap-2">
        <div class="mb-4.5 font-medium">
          <label class="mb-2.5 block text-black dark:text-white">
            Title
          </label>
          <input
            type="text"
            placeholder="Title"
            v-model="title"
            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </div>
  
        <div class="flex flex-col gap-2">
          <div class="mb-4.5 font-medium">
            <div class="mb-4 sticky -top-4 bg-white dark:bg-boxdark flex justify-between items-center">
              <label class="mb-2.5 block text-black dark:text-white">
                Gambar
              </label>
              
              <button v-if="hasImage || selectedImages" @click="selectedImages.length = 0, hasImage = false" class="text-white text-xs font-medium bg-primary w-[126px] h-[30px] rounded-lg">
                Pilih ulang gambar
              </button>
            </div>
            
            <div v-if="hasImage" class="flex flex-wrap gap-2 mb-2 justify-center">
                <img v-for="(image, index) in about[0].images" :key="index" :src="baseImgUrl+image" class="w-[120px] h-[120px]" :alt="image">
            </div>
            
            <div v-if="!hasImage" class="flex flex-wrap gap-2 mb-2 justify-center">
                <img v-for="(image, index) in selectedImages" :key="index" :src="image.url" class="w-[120px] h-[120px]" alt="Foto">
            </div>

            <div v-if="!hasImage && selectedImages.length == 0 && !loadingData"
                id="FileUpload"
                class="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
              >
                <input
                  type="file"
                  :disabled="showNotification"
                  multiple
                  accept="image/*"
                  class="absolute inset-0 z-20 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  @change="onFileChange"
                />
                <div class="flex flex-col items-center justify-center space-y-3">
                  <span
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                        fill="#3C50E0"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                        fill="#3C50E0"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                        fill="#3C50E0"
                      />
                    </svg>
                  </span>
                  <p class="text-sm font-medium">
                    <span class="text-primary">Klik untuk pilih gambar</span>
                  </p>
                  <p class="mt-1.5 text-sm font-medium">SVG, PNG, atau JPG</p>
                  <p class="text-sm font-medium">(max, 800 X 800px)</p>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div :class="{'gap-2': about.length > 0}" class="flex justify-end mb-4">
        <button @click="btnAction('tambah')" v-if="isTambahKonten" class="text-white font-medium bg-primary px-4 py-2 rounded-lg">
          Tambah
        </button>
        <button @click="btnAction('edit', about[0].id)" v-if="about.length > 0 || !isTambahKonten" class="text-white font-medium bg-primary px-4 py-2 rounded-lg">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

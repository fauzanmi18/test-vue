<template>
    <Teleport to="#modal">
        <div class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
        >
            <div ref="modal" class="block relative w-full md:w-3/4 lg:w-1/2 top-0 mx-auto shadow-xl rounded-md bg-white dark:border-strokedark dark:bg-boxdark">
                <!-- Modal body -->
                <div class="flex items-center mx-4 pt-4 gap-1">
                    <h1 class="font-myFont text-black dark:text-white text-lg">
                        {{$props.method == 'edit' 
                            ? 'Ubah Data Produk' 
                            : $props.method == 'detail'
                            ? 'Detail Produk'
                            :'Tambah Produk'
                        }}
                    </h1>
                </div>
                <hr class="border-slate-300 dark:border-strokedark mt-4">
                
                <div class="w-full p-4 h-[480px] overflow-y-scroll">
                    <div class="w-full flex flex-col justify-center">
                        <div class="flex flex-col mb-4">
                            <label class="mb-2.5 block font-medium text-black dark:text-white">
                                Foto Produk
                            </label>
                            <img v-if="!selectedImage" class="mb-2 self-center w-[120px] h-[120px]" src="https://placehold.co/454x454" alt="Foto Produk">
                            <img v-if="selectedImage" :src="selectedImage" class="mb-2 self-center w-[120px] h-[120px]" alt="Foto Produk">
                            <input v-if="$props.method !== 'detail'" @change="onFileChange" type="file" class="w-full text-xs rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white">
                        </div>
                        <div class="flex justify-center gap-2 mb-1">
                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.nama"
                                    label="Nama"
                                    type="text"
                                    placeholder="Nama Produk"
                                    customClasses="mb-4.5 font-medium"
                                    required
                                    :isDisabled="$props.method == 'detail'"
                                />
                            </div>

                            <div class="w-full">
                                <label class="mb-2.5 block font-medium text-black dark:text-white">
                                    Kategori
                                    <span class="text-meta-1">*</span>
                                </label>
                                
                                <div class="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                    :readonly="$props.method == 'detail'"
                                    v-model="formInsert.kategori" required
                                    class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    :class="{ 'text-black dark:text-white': isOptionSelected }"
                                    @change="changeTextColor"
                                >
                                    <option value="" disabled selected>Kategori Produk</option>
                                    <option v-for="(item, index) in categories" :value="item.id" :key="item.id">
                                        {{ item.name }}
                                    </option>
                                </select>

                                <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                    <svg
                                    class="fill-current"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <g opacity="0.8">
                                        <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill=""
                                        ></path>
                                    </g>
                                    </svg>
                                </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-center gap-2 mb-1">
                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.harga"
                                    label="Harga"
                                    type="text"
                                    placeholder="5000"
                                    customClasses="mb-4.5 font-medium"
                                    required
                                    :isDisabled="$props.method == 'detail'"
                                />
                            </div>

                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.stok"
                                    label="Stock"
                                    type="text"
                                    placeholder="10"
                                    customClasses="mb-4.5 font-medium"
                                    required
                                    :isDisabled="$props.method == 'detail'"
                                />
                            </div>
                        </div>

                        <div class="flex flex-col justify-center gap-2">
                            <label class="block font-medium text-black dark:text-white">
                                Deskripsi Produk
                            </label>
                            <textarea
                            :readonly="$props.method == 'detail'"
                            v-model="formInsert.deskripsi"
                            rows="6"
                            placeholder="Deskripsi Produk"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            ></textarea>
                        </div>
                    </div>
                </div>
    
                <hr class="border-slate-300 dark:border-strokedark pt-4">
                <!-- Modal footer -->
                <div class="px-4 py-4 flex justify-between items-center space-x-4">
                    <button @click="closeBtnModal" class="bg-transparent font-myFont border dark:border-2 border-primary dark:border-strokedark text-primary dark:text-white p-2 rounded-md hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out">Tutup</button>
                    <div v-if="$props.method !== 'detail'">
                        <button v-if="loadingSubmit"
                            class="rounded-lg px-4 py-2 bg-primary bg-opacity-60 text-white font-myFont hover:bg-opacity-75 hover:shadow-md">
                            Loading...
                        </button>
                        <button v-if="!loadingSubmit"
                            @click="submitForm"
                            class="rounded-lg px-4 py-2 bg-primary text-white font-myFont hover:bg-opacity-75 hover:shadow-md">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import InputGroup from '@/components/Forms/InputGroup.vue'
import initAPI from '@/api/api.js'
import Cookies from 'js-cookie'
import dompurify from 'dompurify'

const props = defineProps({
    detailData: Object,
    method: String
})

const categories = ref([])
const loadingSubmit = ref(false)

onMounted(async() => {
    try {
        const response = await initAPI('get', 'products-categories', null, null)
        categories.value = response.data.data
    } catch (error) {
        console.log(`error get categories`, error)
    }

})

const formInsert = ref({
    gambar: null,
    nama: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.name : '',
    kategori: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.category.id : '',
    harga: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.price : '',
    stok: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.stock : '',
    deskripsi: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.description : ''
})
const selectedOption = ref('')
const isOptionSelected = ref(
    props.detailData && (props.method == 'edit' || props.method == 'detail') && props.detailData.category.id 
    ? true
    : false
)

const changeTextColor = () => {
  isOptionSelected.value = true
}

const emit = defineEmits(['closeModal', 'refreshData', 'sendNotif'])
const modal = ref(null)

onClickOutside(modal, () => closeBtnModal())

const closeBtnModal = () => {
    emit('closeModal')
}

const refreshData = () => {
  emit('refreshData')
}

const selectedImage = ref(
    props.detailData && props.method == 'edit'
    ? props.detailData.image
    : null
)

const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedImage.value = URL.createObjectURL(file)
        formInsert.value.gambar = file
    }
}

const formatRupiah = (angka) => {
  let number_string = angka.replace(/[^,\d]/g, "").toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi),
      separator = ""

  if (ribuan) {
    separator = sisa ? "." : ""
    rupiah += separator + ribuan.join(".")
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah
  return 'Rp. '+rupiah
}

watch(() => formInsert.value.harga, (newValue) => {
  formInsert.value.harga = formatRupiah(newValue)
});

const submitForm = async() => {
    const formData = new FormData
    formData.append('category_id', formInsert.value.kategori)
    formData.append('name', dompurify.sanitize(formInsert.value.nama))
    formData.append('images', formInsert.value.gambar)
    formData.append('price', dompurify.sanitize(formInsert.value.harga.replace(/Rp\.?\s?/g, '').replace(/\./g, '')))
    formData.append('stock', dompurify.sanitize(formInsert.value.stok.includes('pcs') ? formInsert.value.stok.replace(/\s?pcs/g, '') : formInsert.value.stok))
    formData.append('description', dompurify.sanitize(formInsert.value.deskripsi))
    if(props.method == 'edit'){
        formData.append('_method', 'PUT')
    }

    const token = Cookies.get('token')

    try {
        loadingSubmit.value = true
        const response = await initAPI('post', props.method == 'edit' ? `products/${props.detailData.id}` : 'products', formData, token)
        localStorage.setItem('initNotif', JSON.stringify({type: 'Success', msg: response.data.message}))
        closeBtnModal()
        refreshData()
        emit('sendNotif')
    } catch (error) {
        closeBtnModal()
        // console.log(error)
        // alert(error)
        localStorage.setItem('initNotif', JSON.stringify({type: 'Success', msg: response.data.message}))
        emit('sendNotif')
    } finally {
        loadingSubmit.value = false
    }
}

</script>

<style>
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
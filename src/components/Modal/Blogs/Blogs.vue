<template>
    <Teleport to="#modal">
        <div class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
        >
            <div ref="modal" class="block relative w-full md:w-3/4 lg:w-4/5 top-0 mx-auto shadow-xl rounded-md bg-white dark:border-strokedark dark:bg-boxdark">
                <!-- Modal body -->
                <div class="flex items-center mx-4 pt-4 gap-1">
                    <h1 class="font-myFont text-black dark:text-white text-lg">Tambah Blog</h1>
                </div>
                <hr class="border-slate-300 dark:border-strokedark mt-4">
                
                <div class="w-full p-4 h-[380px] overflow-y-auto">
                    <div class="w-full flex flex-col gap-4 justify-center">
                        <div class="flex flex-col mb-4">
                            <label class="mb-1 block font-medium text-black dark:text-white">
                                Foto Blog
                            </label>
                            <img v-if="!selectedImage" class="mb-2 self-center w-[200px] h-[200px]" src="https://placehold.co/700x400" alt="Foto Produk">
                            <img v-if="selectedImage" :src="selectedImage" class="mb-2 self-center w-[120px] h-[120px]" alt="Foto Produk">
                            <input @change="onFileChange" type="file" class="w-full text-xs rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white">
                        </div>

                        <div class="flex justify-center gap-2 mb-1">
                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.title"
                                    label="Title"
                                    type="text"
                                    placeholder="Title"
                                    customClasses="mb-4.5 font-medium"
                                    :required="props.method !== 'edit'"
                                />
                            </div>
                        </div>

                        <div class="w-full flex justify-center gap-2 mb-1">
                            <div class="w-full">
                                <label class="mb-2.5 block font-medium text-black dark:text-white">
                                    Konten
                                    <span v-if="$props.method !== 'edit'" class="text-meta-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    placeholder="Konten"
                                    v-model="formInsert.konten"
                                    rows="4"
                                    class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>
    
                <hr class="border-slate-300 dark:border-strokedark pt-4">
                <!-- Modal footer -->
                <div class="px-4 py-4 flex justify-between items-center space-x-4">
                    <button @click="closeBtnModal" class="bg-transparent font-myFont border dark:border-2 border-primary dark:border-strokedark text-primary dark:text-white p-2 rounded-md hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out">Tutup</button>
                    <button v-if="loadingSubmit"
                        class="cursor-not-allowed rounded-lg px-4 py-2 bg-primary bg-opacity-60 text-white font-myFont hover:bg-opacity-75 hover:shadow-md">
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
    </Teleport>
</template>

<script setup>
import { watch, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import InputGroup from '@/components/Forms/InputGroup.vue'
import initAPI from '@/api/api.js'
import Cookies from 'js-cookie'
import dompurify from 'dompurify'

const baseImgUrl = import.meta.env.VITE_API_BASE_URL+'open/blogs/'

const props = defineProps({
    detailData: Object,
    method: String
})

const formInsert = ref({
    gambar: null,
    title: props.detailData && props.method == 'edit' ? props.detailData.title : '',
    konten: props.detailData && props.method == 'edit' ? props.detailData.content : ''
})

const loadingSubmit = ref(false)

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
    ? baseImgUrl + props.detailData.image[0]
    : null
)

const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedImage.value = URL.createObjectURL(file)
        formInsert.value.gambar = file
    }
}

const submitForm = async() => {
    const formData = new FormData
    formData.append('image[]', formInsert.value.gambar)
    formData.append('content', formInsert.value.konten)
    formData.append('title', dompurify.sanitize(formInsert.value.title))
    if(props.method == 'edit'){
        formData.append('_method', 'PUT')
    }
    const token = Cookies.get('token')
    
    try {
        loadingSubmit.value = true
        const response = await initAPI('post', props.method == 'edit' ? `blogs/${props.detailData.id}`  : 'blogs', formData, token)
        localStorage.setItem('initNotif', JSON.stringify({type: 'Success', msg: response.data.message}))
        closeBtnModal()
        emit('sendNotif')
        refreshData()
    } catch (error) {
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
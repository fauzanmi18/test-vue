<template>
    <Teleport to="#modal">
        <div class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
        >
            <div ref="modal" class="block relative w-full md:w-3/4 lg:w-3/5 top-0 mx-auto shadow-xl rounded-md bg-white dark:border-strokedark dark:bg-boxdark">
                <!-- Modal body -->
                <div class="flex items-center mx-4 pt-4 gap-1">
                    <h1 class="font-myFont text-black dark:text-white text-lg">
                        Detail Customers
                    </h1>
                </div>

                <hr class="border-slate-300 dark:border-strokedark mt-4">
                
                <div class="w-full p-4 h-[360px] overflow-y-scroll">
                    <div class="w-full flex flex-col justify-center">
                        <div class="flex justify-center gap-2 mb-1">
                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.nama"
                                    label="Nama"
                                    type="text"
                                    placeholder="Nama"
                                    customClasses="mb-4.5 font-medium"
                                    required
                                    isDisabled
                                />
                            </div>

                            <div class="w-full">
                                <InputGroup
                                    v-model="formInsert.notelp"
                                    label="No Telp"
                                    type="text"
                                    placeholder="No Telp"
                                    customClasses="mb-4.5 font-medium"
                                    required
                                    isDisabled
                                />
                            </div>
                        </div>

                        <div class="flex flex-col justify-center gap-2">
                            <label class="block font-medium text-black dark:text-white">
                                Alamat
                            </label>
                            <textarea
                            readonly
                            v-model="formInsert.alamat"
                            rows="4"
                            placeholder="Alamat"
                            class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            ></textarea>
                        </div>
                    </div>
                </div>
    
                <hr class="border-slate-300 dark:border-strokedark pt-4">
                <!-- Modal footer -->
                <div class="px-4 py-4 flex justify-between items-center space-x-4">
                    <button @click="closeBtnModal" class="bg-transparent font-myFont border dark:border-2 border-primary dark:border-strokedark text-primary dark:text-white p-2 rounded-md hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import InputGroup from '@/components/Forms/InputGroup.vue'
import initAPI from '@/api/api.js'

const props = defineProps({
    detailData: Object,
    method: String
})

const formInsert = ref({
    nama: props.detailData?.user ? `${props.detailData.first_name} ${props.detailData.last_name}` : '',
    notelp: props.detailData?.number ? props.detailData.number : '',
    // postal: props.detailData?.postal_code ? props.detailData.postal_code : '',
    alamat: props.detailData?.address && props.detailData?.region && props.detailData?.postal_code ? `${props.detailData.address}\n${props.detailData.region}\n${props.detailData.postal_code}` : '',
    deskripsi: props.detailData && (props.method == 'edit' || props.method == 'detail') ? props.detailData.description : ''
})

const emit = defineEmits(['closeModal'])
const modal = ref(null)

onClickOutside(modal, () => closeBtnModal())

const closeBtnModal = () => {
    emit('closeModal')
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
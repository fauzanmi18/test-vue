<template>
    <Teleport to="#modal">
        <Transition name="modal">
            <div v-if="isModalOpen" class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
            >
                <div ref="modal" class="hidden lg:block relative w-3/4 top-0 mx-auto shadow-xl rounded-md bg-white">
                    <!-- Modal body -->
                    <div class="flex items-center mx-4 pt-4 gap-1">
                        <a class="text-2xl text-dark"><PhInfo/></a>
                        <h1 class="font-myFont text-dark text-lg">Kebijakan Privasi</h1>
                    </div>
                    <hr class="mt-4">
                    
                    <div class="w-full p-4">
                        <div class="w-full flex flex-wrap -mx-3 mb-6">
                            <div class="w-full text-sm flex flex-col gap-4 px-3 mb-6 md:mb-0">
                                <p class="font-myFont text-neutral-500">
                                    Sebelum Anda melanjutkan untuk menggunakan layanan kami, kami meminta Anda untuk membaca dan menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami. 
                                </p>
        
                                <p class="font-myFont text-neutral-500">
                                    Dengan menggunakan aplikasi kami, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan yang berlaku serta memberikan persetujuan atas pengumpulan dan penggunaan data Anda sesuai dengan Kebijakan Privasi kami. 
                                </p>
        
                                <p class="font-myFont text-neutral-500 mb-6">
                                    Kami akan melindungi privasi dan keamanan informasi Anda dengan sungguh-sungguh. 
                                </p>
                            </div>
        
                            <div class="w-full text-sm flex items-center gap-1 px-3 md:mb-0">
                                <label class="block font-myFont text-neutral-500 text-xs md:text-sm lg:text-sm font-medium">
                                    <input class="h-4 w-4 text-black" type="checkbox" name="jawabanAssessment">
                                    Jika anda menyetujui persyaratan diatas silahkan centang tombol berikut.
                                </label>
                            </div>
                        </div>
                    </div>
        
                    <hr class="pt-4">
                    <!-- Modal footer -->
                    <div class="px-4 py-4 flex justify-between items-center space-x-4">
                        <button @click="showModal" class="bg-gray-300 font-myFont text-black p-2 rounded-md hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out">Tutup</button>
                        <button
                            class="rounded-lg px-4 py-2 bg-biru text-light font-myFont hover:bg-opacity-75 hover:shadow-md">
                            Setuju
                        </button>
                    </div>
                </div>
        
                <div class="block lg:hidden relative w-full top-10 mx-auto shadow-xl rounded-md bg-white">
                    <!-- Modal body -->
                    <div class="flex items-center mx-4 pt-4 gap-1">
                        <a class="text-2xl text-dark"><PhInfo/></a>
                        <h1 class="font-myFont text-dark text-lg">Kebijakan Privasi</h1>
                    </div>
                    <hr class="mt-4">
                    
                    <div class="w-full p-4">
                        <div class="w-full text-xs flex flex-col gap-4 mx-1 mb-6">
                            <p class="font-myFont text-neutral-500">
                                Sebelum Anda melanjutkan untuk menggunakan layanan kami, kami meminta Anda untuk membaca dan menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami. 
                            </p>
        
                            <p class="font-myFont text-neutral-500">
                                Dengan menggunakan aplikasi kami, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan yang berlaku serta memberikan persetujuan atas pengumpulan dan penggunaan data Anda sesuai dengan Kebijakan Privasi kami. 
                            </p>
        
                            <p class="font-myFont text-neutral-500">
                                Kami akan melindungi privasi dan keamanan informasi Anda dengan sungguh-sungguh. 
                            </p>
                        </div>
        
                        <div class="w-full text-sm flex items-center gap-1 px-1 md:mb-0">
                            <label class="block font-myFont text-neutral-500 text-xs md:text-sm lg:text-sm font-medium">
                                <input type="checkbox" name="jawabanAssessment">
                                Jika anda menyetujui persyaratan diatas silahkan centang tombol berikut.
                            </label>
                        </div>
                    </div>
        
                    <hr class="pt-4">
                    <!-- Modal footer -->
                    <div class="px-4 py-4 flex justify-between items-center space-x-4">
                        <button @click="" class="bg-gray-300 font-myFont text-black p-2 rounded-md hover:shadow-lg hover:opacity-80 transition duration-300 ease-in-out">
                            Tutup
                        </button>
                        <button
                            class="rounded-lg px-4 py-2 bg-biru text-light font-myFont hover:bg-opacity-75 hover:shadow-md">
                            Setuju
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <button @click="showModal">
        test modal
    </button>
</template>

<script setup>
import { ref } from 'vue'
const isModalOpen = ref(false)
const showModal = () => {
    isModalOpen.value = !isModalOpen.value
}
</script>

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
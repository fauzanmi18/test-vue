<template>
    <div v-if="$props.method =='logout'">
        <Teleport to="#modal">
            <div class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
            >
                <div ref="modal" class="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15">
                    <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        {{ $props.modalTitle }}
                    </h3>
                    <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                    <p class="mb-10 font-medium">
                        {{ $props.modalMessage }}
                    </p>
                    <div class="-mx-3 flex flex-wrap gap-y-4">
                        <div class="w-full px-3 2xsm:w-1/2">
                            <button @click="closeBtnModal" class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:bg-opacity-75 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-75">
                            Batal
                            </button>
                        </div>
                        <div class="w-full px-3 2xsm:w-1/2">
                            <button @click="initAction" class="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>

    <div v-if="$props.method !== 'logout'" class="modal-bg z-[9999] inset-0 overflow-y-auto h-full w-full px-4"
    >
        <div ref="modal" class="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15">
            <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                {{ $props.modalTitle }}
            </h3>
            <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <p class="mb-10 font-medium">
                {{ $props.modalMessage }}
            </p>
            <div class="-mx-3 flex flex-wrap gap-y-4">
                <div class="w-full px-3 2xsm:w-1/2">
                    <button @click="closeBtnModal" class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:bg-opacity-75 dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:bg-opacity-75">
                    Batal
                    </button>
                </div>
                <div class="w-full px-3 2xsm:w-1/2">
                    <button @click="initAction" :class="{'border-success bg-success': $props.method == 'active' || $props.method == 'update_pesanan'}" class="block w-full rounded border border-meta-1 bg-meta-1 p-3 text-center font-medium text-white transition hover:bg-opacity-90">
                    {{ $props.method == 'active' ? 'Aktifkan' : $props.method == 'update_pesanan' ? 'Update' : 'Hapus' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    modalTitle: String,
    modalMessage: String,
    method: String
})

const modal = ref(null)

onClickOutside(modal, () => closeBtnModal())

const emit = defineEmits(['toggleDialog', 'action'])
const closeBtnModal = () => {
    emit('toggleDialog')
}
const initAction = () => {
    emit('action')
    closeBtnModal()
}
</script>

<style scoped>
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
<script setup>
import {ref, watch } from 'vue';

const props = defineProps({
  label: String,
  type: String,
  placeholder: String,
  modelValue: String
});

// Define the emits
const emit = defineEmits(['update:modelValue','enter']);

// Create a local ref to bind to the input element
const inputValue = ref(props.modelValue);

// Watch the inputValue and emit the update to the parent
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Watch the props.modelValue to update the local inputValue
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});

const handleEnter = () => {
  emit('enter')
}
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">{{ props.label }}</label>
    <div class="relative">
      <input
        @keydown.enter.prevent="handleEnter"
        :type="props.type"
        :placeholder="props.placeholder"
        v-model="inputValue"
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

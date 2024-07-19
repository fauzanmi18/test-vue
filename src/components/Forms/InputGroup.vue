<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  label: String,
  type: String,
  placeholder: String,
  modelValue: String,
  customClasses: String,
  required: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

// Define the emits
const emit = defineEmits(['update:modelValue']);

// Create a local ref to bind to the input element
const inputValue = ref(props.modelValue);

// Watch the inputValue and emit the update to the parent
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue;
});


// Computed properties for props
const customClasses = computed(() => props.customClasses);
const label = computed(() => props.label);
const required = computed(() => props.required);
const type = computed(() => props.type);
const placeholder = computed(() => props.placeholder);
const isDisabled = computed(() => props.isDisabled);

</script>

<template>
  <div :class="customClasses">
    <label class="mb-2.5 block text-black dark:text-white">
      {{ label }}
      <span v-if="required" class="text-meta-1">*</span>
    </label>
    <input
      :readonly="isDisabled"
      :type="type"
      :placeholder="placeholder"
      v-model="inputValue"
      class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
    />
  </div>
</template>

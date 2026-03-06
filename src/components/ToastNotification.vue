<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' }, // success, error, info, warning
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

watch(() => props.visible, (val) => {
  if (val) {
    setTimeout(() => emit('close'), 3000)
  }
})

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️'
}

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500'
}

const textColors = {
  success: 'text-white',
  error: 'text-white',
  info: 'text-white',
  warning: 'text-yellow-900'
}
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed top-6 left-0 right-0 z-200 w-[90%] max-w-sm mx-auto"
    >
      <div
        :class="[bgColors[type], textColors[type]]"
        class="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-sm"
      >
        <span class="text-xl shrink-0">{{ icons[type] }}</span>
        <p class="text-sm font-semibold flex-1">{{ message }}</p>
        <button
          @click="emit('close')"
          class="ml-2 opacity-70 hover:opacity-100 transition cursor-pointer text-lg font-bold leading-none"
        >
          ×
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.45s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}
.toast-leave-active {
  animation: toast-out 0.35s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
}
</style>

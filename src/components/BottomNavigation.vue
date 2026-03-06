<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  currentTab: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["change-tab"]);

const changeTab = (tab) => {
  emit("change-tab", tab);
};
</script>

<template>
  <div
    class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50"
  >
    <button
      @click="changeTab('home')"
      class="flex flex-col items-center justify-center w-full h-full text-sm transition-all duration-200 active:scale-90 relative"
      :class="
        currentTab === 'home'
          ? 'text-red-700 font-bold'
          : 'text-gray-400 hover:text-red-600'
      "
    >
      <svg
        class="w-6 h-6 mb-0.5 transition-transform duration-200"
        :class="currentTab === 'home' ? 'scale-110' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        ></path>
      </svg>
      <span class="text-[10px]">Início</span>
      <div
        v-if="currentTab === 'home'"
        class="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"
      ></div>
    </button>
    <button
      v-if="userRole === 'inspector'"
      @click="changeTab('new-report')"
      class="flex flex-col items-center justify-center w-full h-full text-sm transition-all duration-200 active:scale-90 relative"
      :class="
        currentTab === 'new-report'
          ? 'text-red-700 font-bold'
          : 'text-gray-400 hover:text-red-600'
      "
    >
      <div class="relative">
        <svg
          class="w-6 h-6 mb-0.5 transition-transform duration-200"
          :class="currentTab === 'new-report' ? 'scale-110' : ''"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span class="text-[10px]">Registrar</span>
      <div
        v-if="currentTab === 'new-report'"
        class="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"
      ></div>
    </button>
    <button
      v-if="userRole === 'inspector'"
      @click="changeTab('history')"
      class="flex flex-col items-center justify-center w-full h-full text-sm transition-all duration-200 active:scale-90 relative"
      :class="
        currentTab === 'history'
          ? 'text-red-700 font-bold'
          : 'text-gray-400 hover:text-red-600'
      "
    >
      <svg
        class="w-6 h-6 mb-0.5 transition-transform duration-200"
        :class="currentTab === 'history' ? 'scale-110' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span class="text-[10px]">Histórico</span>
      <div
        v-if="currentTab === 'history'"
        class="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"
      ></div>
    </button>
    <button
      @click="changeTab('profile')"
      class="flex flex-col items-center justify-center w-full h-full text-sm transition-all duration-200 active:scale-90 relative"
      :class="
        currentTab === 'profile'
          ? 'text-red-700 font-bold'
          : 'text-gray-400 hover:text-red-600'
      "
    >
      <svg
        class="w-6 h-6 mb-0.5 transition-transform duration-200"
        :class="currentTab === 'profile' ? 'scale-110' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
      <span class="text-[10px]">Perfil</span>
      <div
        v-if="currentTab === 'profile'"
        class="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"
      ></div>
    </button>
    <button
      @click="changeTab('settings')"
      class="flex flex-col items-center justify-center w-full h-full text-sm transition-all duration-200 active:scale-90 relative"
      :class="
        currentTab === 'settings'
          ? 'text-red-700 font-bold'
          : 'text-gray-400 hover:text-red-600'
      "
    >
      <svg
        class="w-6 h-6 mb-0.5 transition-transform duration-200"
        :class="currentTab === 'settings' ? 'scale-110' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
      <span class="text-[10px]">Ajustes</span>
      <div
        v-if="currentTab === 'settings'"
        class="absolute bottom-1 w-1 h-1 bg-red-600 rounded-full"
      ></div>
    </button>
  </div>
</template>

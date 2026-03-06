<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  reports: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-report']);
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md mt-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Meu Histórico</h2>
    <div v-if="reports.length === 0" class="text-gray-500 py-4 text-center">
      Nenhum relato encontrado.
    </div>
    <ul v-else class="space-y-4">
      <li v-for="report in reports" :key="report.id" @click="emit('view-report', report)" class="border border-gray-200 p-4 rounded-md shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer">
        <h3 class="font-bold text-red-700">{{ report.issue }}</h3>
        <p class="text-sm text-gray-600">Local: {{ report.location }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-400">{{ report.date }}</span>
          <span class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-200">
            {{ report.status }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  report: { type: Object, required: true },
  userRole: { type: String, default: 'inspector' }
})

const emit = defineEmits(['back', 'update-status'])

const statusOptions = ['Pendente', 'Em Andamento', 'Resolvido']

const statusColor = computed(() => {
  const colors = {
    'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Em Andamento': 'bg-blue-100 text-blue-800 border-blue-300',
    'Resolvido': 'bg-green-100 text-green-800 border-green-300'
  }
  return colors[props.report.status] || colors['Pendente']
})
</script>

<template>
  <div class="space-y-4">
    <!-- Cabeçalho -->
    <div class="flex items-center gap-3 mb-2">
      <button
        @click="emit('back')"
        class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h2 class="text-xl font-bold text-gray-800">Detalhes do Relatório</h2>
    </div>

    <!-- Card Principal -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Status Banner -->
      <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
        <span :class="statusColor" class="px-3 py-1 text-xs font-bold rounded-full border">
          {{ report.status }}
        </span>
      </div>

      <!-- Informações -->
      <div class="p-5 space-y-5">
        <div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Problema Relatado</span>
          <p class="text-gray-800 font-semibold text-base">{{ report.issue }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Local / Estação</span>
            <p class="text-gray-700 font-medium text-sm">{{ report.location }}</p>
          </div>
          <div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Data</span>
            <p class="text-gray-700 font-medium text-sm">{{ report.date }}</p>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Coordenadas GPS</span>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              📍 {{ report.coords || 'Não informado' }}
            </span>
          </div>
        </div>

        <div>
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Inspetor Responsável</span>
          <div class="flex items-center gap-3 mt-1">
            <div class="w-9 h-9 bg-red-100 text-red-700 flex items-center justify-center rounded-full text-sm font-bold">
              {{ report.inspector ? report.inspector.split(' ').map(n => n[0]).join('') : '?' }}
            </div>
            <p class="text-gray-700 font-medium text-sm">{{ report.inspector }}</p>
          </div>
        </div>

        <div v-if="report.media && report.media.length > 0">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Mídia Anexada</span>
          <p class="text-sm text-gray-600">{{ report.media.length }} arquivo(s) anexado(s)</p>
        </div>
      </div>
    </div>

    <!-- Ações do Admin -->
    <div v-if="userRole === 'admin'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Alterar Status</h3>
      <div class="flex gap-2">
        <button
          v-for="status in statusOptions"
          :key="status"
          @click="emit('update-status', report.id, status)"
          :class="report.status === status ? 'ring-2 ring-red-500 ring-offset-1' : 'opacity-70'"
          class="flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 active:scale-95 hover:opacity-100"
          :style="{
            backgroundColor: status === 'Pendente' ? '#fef3c7' : status === 'Em Andamento' ? '#dbeafe' : '#d1fae5',
            color: status === 'Pendente' ? '#92400e' : status === 'Em Andamento' ? '#1e40af' : '#065f46'
          }"
        >
          {{ status }}
        </button>
      </div>
    </div>

    <!-- Timeline simplificada -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Histórico</h3>
      <div class="space-y-4">
        <div class="flex gap-3">
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-0.5 h-full bg-gray-200"></div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Relatório criado</p>
            <p class="text-xs text-gray-400">{{ report.date }} por {{ report.inspector }}</p>
          </div>
        </div>
        <div v-if="report.status !== 'Pendente'" class="flex gap-3">
          <div class="flex flex-col items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div class="w-0.5 h-full bg-gray-200"></div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Status alterado para {{ report.status }}</p>
            <p class="text-xs text-gray-400">Atualizado pelo administrador</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

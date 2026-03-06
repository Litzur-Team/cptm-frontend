<script setup>
import { computed } from 'vue'

const props = defineProps({
  inspector: { type: Object, required: true },
  reports: { type: Array, default: () => [] }
})

const emit = defineEmits(['back', 'edit', 'delete'])

const inspectorReports = computed(() => {
  return props.reports.filter(r => r.inspector === props.inspector.name)
})

const initials = computed(() => {
  return props.inspector.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const stats = computed(() => {
  const total = inspectorReports.value.length
  const pendente = inspectorReports.value.filter(r => r.status === 'Pendente').length
  const andamento = inspectorReports.value.filter(r => r.status === 'Em Andamento').length
  const resolvido = inspectorReports.value.filter(r => r.status === 'Resolvido').length
  return { total, pendente, andamento, resolvido }
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
      <h2 class="text-xl font-bold text-gray-800">Detalhes do Inspetor</h2>
    </div>

    <!-- Perfil -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="bg-red-700 h-20"></div>
      <div class="px-5 pb-5 -mt-10">
        <div class="w-20 h-20 bg-white border-4 border-white rounded-full flex items-center justify-center text-2xl font-bold text-red-700 shadow-md">
          {{ initials }}
        </div>
        <div class="mt-3">
          <h3 class="text-xl font-bold text-gray-800">{{ inspector.name }}</h3>
          <p class="text-sm text-gray-500 mt-0.5">Usuário: <span class="font-mono text-gray-600">{{ inspector.user }}</span></p>
          <p class="text-sm text-gray-500">ID: <span class="font-mono text-gray-600">#{{ inspector.id }}</span></p>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
        <p class="text-xs text-gray-500 font-medium mt-1">Total de Relatórios</p>
      </div>
      <div class="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
        <p class="text-2xl font-bold text-yellow-700">{{ stats.pendente }}</p>
        <p class="text-xs text-yellow-600 font-medium mt-1">Pendentes</p>
      </div>
      <div class="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
        <p class="text-2xl font-bold text-blue-700">{{ stats.andamento }}</p>
        <p class="text-xs text-blue-600 font-medium mt-1">Em Andamento</p>
      </div>
      <div class="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
        <p class="text-2xl font-bold text-green-700">{{ stats.resolvido }}</p>
        <p class="text-xs text-green-600 font-medium mt-1">Resolvidos</p>
      </div>
    </div>

    <!-- Relatórios do inspetor -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Relatórios deste Inspetor</h3>
      <div v-if="inspectorReports.length === 0" class="text-gray-400 text-sm text-center py-4">
        Nenhum relatório encontrado.
      </div>
      <div v-else class="space-y-3">
        <div v-for="report in inspectorReports" :key="report.id" class="p-3 rounded-xl border border-gray-100 bg-gray-50">
          <div class="flex justify-between items-start">
            <p class="text-sm font-semibold text-gray-800">{{ report.issue }}</p>
            <span
              class="text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ml-2"
              :class="{
                'bg-yellow-100 text-yellow-800 border-yellow-300': report.status === 'Pendente',
                'bg-blue-100 text-blue-800 border-blue-300': report.status === 'Em Andamento',
                'bg-green-100 text-green-800 border-green-300': report.status === 'Resolvido'
              }"
            >
              {{ report.status }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ report.location }} · {{ report.date }}</p>
        </div>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex gap-3">
      <button
        @click="emit('edit', inspector)"
        class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-150"
      >
        Editar Inspetor
      </button>
      <button
        @click="emit('delete', inspector.id)"
        class="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-xl hover:bg-red-200 active:scale-95 transition-all duration-150"
      >
        Excluir
      </button>
    </div>
  </div>
</template>

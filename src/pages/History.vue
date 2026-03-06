<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  reports: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-report']);

const searchQuery = ref('')
const statusFilter = ref('all')

const pendingCount = computed(() => props.reports.filter(r => r.status === 'Pendente').length)
const inProgressCount = computed(() => props.reports.filter(r => r.status === 'Em Andamento').length)
const resolvedCount = computed(() => props.reports.filter(r => r.status === 'Resolvido').length)

const filteredReports = computed(() => {
  let result = props.reports
  if (statusFilter.value !== 'all') {
    result = result.filter(r => r.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(r =>
      r.location.toLowerCase().includes(q) ||
      r.issue.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    )
  }
  return result
})

const getStatusColor = (status) => {
  switch (status) {
    case 'Pendente': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'Em Andamento': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'Resolvido': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getStatusDot = (status) => {
  switch (status) {
    case 'Pendente': return 'bg-amber-500'
    case 'Em Andamento': return 'bg-blue-500'
    case 'Resolvido': return 'bg-emerald-500'
    default: return 'bg-gray-500'
  }
}
</script>

<template>
  <div class="space-y-5">

    <!-- Header -->
    <div>
      <h2 class="text-2xl font-extrabold text-gray-800">Meu Histórico</h2>
      <p class="text-sm text-gray-500 mt-0.5">{{ reports.length }} relatório(s) registrado(s)</p>
    </div>

    <!-- Barra de busca -->
    <div class="relative">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por local, problema ou status..."
        class="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
      >✕</button>
    </div>

    <!-- Filtros de Status -->
    <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      <button
        @click="statusFilter = 'all'"
        :class="statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
      >Todos ({{ reports.length }})</button>
      <button
        @click="statusFilter = 'Pendente'"
        :class="statusFilter === 'Pendente' ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-amber-200'"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
      >Pendentes ({{ pendingCount }})</button>
      <button
        @click="statusFilter = 'Em Andamento'"
        :class="statusFilter === 'Em Andamento' ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border border-blue-200'"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
      >Em Andamento ({{ inProgressCount }})</button>
      <button
        @click="statusFilter = 'Resolvido'"
        :class="statusFilter === 'Resolvido' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 border border-emerald-200'"
        class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
      >Resolvidos ({{ resolvedCount }})</button>
    </div>

    <!-- Lista de Relatórios -->
    <p v-if="filteredReports.length === 0" class="text-center text-gray-400 text-sm py-8 bg-white rounded-xl border border-gray-100">
      {{ searchQuery || statusFilter !== 'all' ? 'Nenhum relatório encontrado com esses filtros.' : 'Nenhum relatório registrado ainda.' }}
    </p>

    <div class="space-y-3">
      <div
        v-for="report in filteredReports"
        :key="report.id"
        @click="emit('view-report', report)"
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all duration-150 cursor-pointer hover:shadow-md"
      >
        <div class="h-1" :class="getStatusDot(report.status)"></div>
        <div class="p-4">
          <div class="flex justify-between items-start gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-800 text-[15px] truncate">{{ report.location }}</h3>
              <p class="text-sm text-gray-500 mt-1 line-clamp-2 leading-snug">{{ report.issue }}</p>
            </div>
            <span
              class="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase whitespace-nowrap border"
              :class="getStatusColor(report.status)"
            >{{ report.status }}</span>
          </div>
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span class="text-xs text-gray-400">{{ report.date }}</span>
            <span class="text-[11px] text-red-500 font-semibold">Ver detalhes →</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

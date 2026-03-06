<script setup>
import { computed } from 'vue'

const props = defineProps({
  reports: { type: Array, default: () => [] }
})

const emit = defineEmits(['view-report', 'go-new-report'])

const totalReports = computed(() => props.reports.length)
const pendingReports = computed(() => props.reports.filter(r => r.status === 'Pendente').length)
const inProgressReports = computed(() => props.reports.filter(r => r.status === 'Em Andamento').length)
const resolvedReports = computed(() => props.reports.filter(r => r.status === 'Resolvido').length)

const recentReports = computed(() => props.reports.slice(0, 3))

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

    <!-- Saudação -->
    <div>
      <h2 class="text-2xl font-extrabold text-gray-800">Visão Geral</h2>
      <p class="text-sm text-gray-500 mt-0.5">Acompanhe suas ocorrências registradas</p>
    </div>

    <!-- Botão destaque: Novo Relatório -->
    <button
      @click="emit('go-new-report')"
      class="w-full bg-linear-to-r from-red-600 to-red-700 text-white py-4 rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-3"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
      <span class="font-bold text-lg">Registrar Nova Ocorrência</span>
    </button>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">📋</span>
          <span class="text-2xl font-extrabold text-gray-800">{{ totalReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Meus Relatórios</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="text-2xl font-extrabold text-amber-600">{{ pendingReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pendentes</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span class="text-2xl font-extrabold text-blue-600">{{ inProgressReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Em Andamento</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-2xl font-extrabold text-emerald-600">{{ resolvedReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resolvidos</p>
      </div>
    </div>

    <!-- Relatórios Recentes -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-bold text-gray-800">Relatórios Recentes</h3>
        <button
          v-if="reports.length > 3"
          @click="emit('go-new-report')"
          class="text-xs font-semibold text-red-600 hover:text-red-700"
        >Ver todos →</button>
      </div>

      <p v-if="recentReports.length === 0" class="text-center text-gray-400 text-sm py-8 bg-white rounded-xl border border-gray-100">
        Nenhum relatório registrado ainda.
      </p>

      <div class="space-y-3">
        <div
          v-for="report in recentReports"
          :key="report.id"
          @click="emit('view-report', report)"
          class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all duration-150 cursor-pointer hover:shadow-md"
        >
          <div class="h-1" :class="getStatusDot(report.status)"></div>
          <div class="p-4">
            <div class="flex justify-between items-start gap-3">
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-800 text-[15px] truncate">{{ report.location }}</h4>
                <p class="text-sm text-gray-500 mt-1 line-clamp-1 leading-snug">{{ report.issue }}</p>
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

  </div>
</template>

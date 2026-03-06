<script setup>
import { ref, computed, inject } from 'vue'

const props = defineProps(['reports', 'inspectors'])
const emit = defineEmits(['add-inspector', 'update-inspector', 'delete-inspector', 'view-report', 'view-inspector'])
const showToast = inject('showToast')

const activeTab = ref('reports')
const isModalOpen = ref(false)
const editingInspector = ref(null)
const searchQuery = ref('')
const statusFilter = ref('all')

// Campos do Formulário
const form = ref({ id: null, name: '', user: '', pass: '' })

// Stats computadas
const totalReports = computed(() => props.reports.length)
const pendingReports = computed(() => props.reports.filter(r => r.status === 'Pendente').length)
const inProgressReports = computed(() => props.reports.filter(r => r.status === 'Em Andamento').length)
const resolvedReports = computed(() => props.reports.filter(r => r.status === 'Resolvido').length)
const totalInspectors = computed(() => props.inspectors.length)

// Filtro de busca + status
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
      r.inspector.toLowerCase().includes(q)
    )
  }
  return result
})

const filteredInspectors = computed(() => {
  if (!searchQuery.value) return props.inspectors
  const q = searchQuery.value.toLowerCase()
  return props.inspectors.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.user.toLowerCase().includes(q)
  )
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

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const openModal = (inspector = null) => {
  if (inspector) {
    editingInspector.value = inspector
    form.value = { ...inspector }
  } else {
    editingInspector.value = null
    form.value = { id: null, name: '', user: '', pass: '' }
  }
  isModalOpen.value = true
}

const saveInspector = () => {
  if (!form.value.name || !form.value.user || !form.value.pass) {
    showToast('Preencha todos os campos.', 'warning')
    return
  }
  if (editingInspector.value) {
    emit('update-inspector', { ...form.value })
  } else {
    emit('add-inspector', { ...form.value })
  }
  isModalOpen.value = false
}
</script>

<template>
  <div class="space-y-5">
    
    <!-- Saudação -->
    <div>
      <h2 class="text-2xl font-extrabold text-gray-800">Painel de Controle</h2>
      <p class="text-sm text-gray-500 mt-0.5">Acompanhe relatórios e gerencie sua equipe</p>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">📋</span>
          <span class="text-2xl font-extrabold text-gray-800">{{ totalReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Relatórios</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="text-2xl">👷</span>
          <span class="text-2xl font-extrabold text-gray-800">{{ totalInspectors }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inspetores</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="text-2xl font-extrabold text-amber-600">{{ pendingReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pendentes</p>
      </div>
      <div class="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-2xl font-extrabold text-emerald-600">{{ resolvedReports }}</span>
        </div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resolvidos</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-gray-200/70 p-1 rounded-xl flex gap-1">
      <button 
        @click="activeTab = 'reports'; searchQuery = ''"
        :class="activeTab === 'reports' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        class="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95"
      >
        Relatórios ({{ totalReports }})
      </button>
      <button 
        @click="activeTab = 'inspectors'; searchQuery = ''"
        :class="activeTab === 'inspectors' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        class="flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 active:scale-95"
      >
        Inspetores ({{ totalInspectors }})
      </button>
    </div>

    <!-- Barra de busca -->
    <div class="relative">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input 
        v-model="searchQuery"
        type="text"
        :placeholder="activeTab === 'reports' ? 'Buscar por local, problema, inspetor...' : 'Buscar inspetor por nome ou usuário...'"
        class="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-200"
      />
      <button 
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
      >✕</button>
    </div>

    <!-- ==================== ABA RELATÓRIOS ==================== -->
    <div v-if="activeTab === 'reports'" class="space-y-3">

      <!-- Filtros de Status -->
      <div class="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          @click="statusFilter = 'all'"
          :class="statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
        >Todos ({{ totalReports }})</button>
        <button
          @click="statusFilter = 'Pendente'"
          :class="statusFilter === 'Pendente' ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 border border-amber-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
        >Pendentes ({{ pendingReports }})</button>
        <button
          @click="statusFilter = 'Em Andamento'"
          :class="statusFilter === 'Em Andamento' ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border border-blue-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
        >Em Andamento ({{ inProgressReports }})</button>
        <button
          @click="statusFilter = 'Resolvido'"
          :class="statusFilter === 'Resolvido' ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 border border-emerald-200'"
          class="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95"
        >Resolvidos ({{ resolvedReports }})</button>
      </div>
      
      <p v-if="filteredReports.length === 0" class="text-center text-gray-400 text-sm py-8">
        {{ searchQuery ? 'Nenhum relatório encontrado.' : 'Nenhum relatório registrado ainda.' }}
      </p>

      <div 
        v-for="report in filteredReports" 
        :key="report.id" 
        @click="emit('view-report', report)" 
        class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-all duration-150 cursor-pointer hover:shadow-md"
      >
        <!-- Barra de status colorida no topo -->
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
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[9px] font-bold">
                {{ getInitials(report.inspector) }}
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ report.inspector }}</span>
            </div>
            <span class="text-[11px] text-gray-400">{{ report.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== ABA INSPETORES ==================== -->
    <div v-if="activeTab === 'inspectors'" class="space-y-3">
      
      <button 
        @click="openModal()"
        class="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-red-700 active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2"
      >
        <span class="text-lg">+</span>
        Cadastrar Novo Inspetor
      </button>

      <p v-if="filteredInspectors.length === 0" class="text-center text-gray-400 text-sm py-8">
        {{ searchQuery ? 'Nenhum inspetor encontrado.' : 'Nenhum inspetor cadastrado ainda.' }}
      </p>

      <div 
        v-for="ins in filteredInspectors" 
        :key="ins.id" 
        @click="emit('view-inspector', ins)" 
        class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 active:scale-[0.98] transition-all duration-150 cursor-pointer hover:shadow-md"
      >
        <div class="flex items-center gap-3">
          <!-- Avatar com iniciais -->
          <div class="w-11 h-11 rounded-full bg-linear-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
            {{ getInitials(ins.name) }}
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-800 truncate">{{ ins.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">@{{ ins.user }}</p>
          </div>

          <div class="flex gap-1.5 shrink-0">
            <button 
              @click.stop="openModal(ins)" 
              class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 active:scale-90 transition-all duration-150"
              title="Editar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </button>
            <button 
              @click.stop="emit('delete-inspector', ins.id)" 
              class="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 active:scale-90 transition-all duration-150"
              title="Excluir"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL ==================== -->
    <Transition name="overlay">
      <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-60" @click.self="isModalOpen = false"></div>
    </Transition>
    <Transition name="modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <div class="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl pointer-events-auto">
          <!-- Header do modal -->
          <div class="p-6 pb-0">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-extrabold text-gray-800">{{ editingInspector ? 'Editar' : 'Novo' }} Inspetor</h3>
                <p class="text-xs text-gray-400 mt-0.5">{{ editingInspector ? 'Atualize os dados do inspetor' : 'Preencha as informações abaixo' }}</p>
              </div>
              <button @click="isModalOpen = false" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 active:scale-90 transition-all">
                ✕
              </button>
            </div>
          </div>

          <!-- Campos -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nome Completo</label>
              <input v-model="form.name" type="text" placeholder="Ex: João da Silva" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all duration-200 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Usuário (Login)</label>
              <input v-model="form.user" type="text" placeholder="Ex: joao.silva" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all duration-200 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Senha</label>
              <input v-model="form.pass" type="password" placeholder="••••••••" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100 transition-all duration-200 text-sm">
            </div>
          </div>

          <!-- Ações -->
          <div class="p-6 pt-0 flex gap-3">
            <button @click="isModalOpen = false" class="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl active:scale-95 transition-all duration-150 border border-gray-200">
              Cancelar
            </button>
            <button @click="saveInspector" class="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-all duration-150">
              {{ editingInspector ? 'Atualizar' : 'Cadastrar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
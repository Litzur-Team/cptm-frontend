<script setup>
import { ref } from 'vue'

const props = defineProps(['reports', 'inspectors'])
const emit = defineEmits(['add-inspector', 'update-inspector', 'delete-inspector'])

const activeTab = ref('reports') // 'reports' ou 'inspectors'
const isModalOpen = ref(false)
const editingInspector = ref(null)

// Campos do Formulário
const form = ref({ id: null, name: '', user: '', pass: '' })

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
  if (editingInspector.value) {
    emit('update-inspector', { ...form.value })
  } else {
    emit('add-inspector', { ...form.value })
  }
  isModalOpen.value = false
}
</script>

<template>
  <div>
    <div class="flex border-b border-gray-300 mb-6 bg-white rounded-t-lg overflow-hidden">
      <button 
        @click="activeTab = 'reports'"
        :class="activeTab === 'reports' ? 'border-b-4 border-red-600 bg-red-50 text-red-700' : 'text-gray-500'"
        class="flex-1 py-3 font-bold transition"
      >
        Relatórios
      </button>
      <button 
        @click="activeTab = 'inspectors'"
        :class="activeTab === 'inspectors' ? 'border-b-4 border-red-600 bg-red-50 text-red-700' : 'text-gray-500'"
        class="flex-1 py-3 font-bold transition"
      >
        Inspetores
      </button>
    </div>

    <div v-if="activeTab === 'reports'" class="space-y-4">
      <div v-for="report in reports" :key="report.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-gray-800">{{ report.location }}</h3>
          <span class="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold uppercase">{{ report.status }}</span>
        </div>
        <p class="text-sm text-gray-600 mt-1 italic">"{{ report.issue }}"</p>
        <div class="mt-3 pt-3 border-t text-[11px] text-gray-500 flex justify-between">
          <span>{{ report.inspector }}</span>
          <span>{{ report.date }}</span>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'inspectors'" class="space-y-4">
      <button 
        @click="openModal()"
        class="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700 mb-4 transition"
      >
        + Cadastrar Novo Inspetor
      </button>

      <div v-for="ins in inspectors" :key="ins.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <p class="font-bold text-gray-800">{{ ins.name }}</p>
          <p class="text-xs text-gray-500">User: {{ ins.user }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="openModal(ins)" class="bg-blue-100 text-blue-600 p-2 rounded-lg"><i class="text-xs">Editar</i></button>
          <button @click="emit('delete-inspector', ins.id)" class="bg-red-100 text-red-600 p-2 rounded-lg"><i class="text-xs">Excluir</i></button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-end sm:items-center justify-center p-4">
      <div class="bg-white w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <h3 class="text-xl font-bold mb-4">{{ editingInspector ? 'Editar' : 'Cadastrar' }} Inspetor</h3>
        <div class="space-y-4">
          <input v-model="form.name" type="text" placeholder="Nome Completo" class="w-full p-3 border rounded-lg outline-none focus:border-red-500">
          <input v-model="form.user" type="text" placeholder="Usuário (Login)" class="w-full p-3 border rounded-lg outline-none focus:border-red-500">
          <input v-model="form.pass" type="password" placeholder="Senha" class="w-full p-3 border rounded-lg outline-none focus:border-red-500">
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="isModalOpen = false" class="flex-1 py-3 text-gray-500 font-bold">Cancelar</button>
          <button @click="saveInspector" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg">Salvar</button>
        </div>
      </div>
    </div>
  </div>
</template>
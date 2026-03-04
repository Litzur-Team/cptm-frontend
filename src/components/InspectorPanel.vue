<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit-report'])

const locationDesc = ref('')
const issue = ref('')
const coords = ref(null)
const isLoadingLocation = ref(false)

const getLocation = () => {
  isLoadingLocation.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        isLoadingLocation.value = false
      },
      (error) => {
        alert('Erro ao capturar localização. Verifique as permissões do dispositivo.')
        isLoadingLocation.value = false
      }
    )
  } else {
    alert('Geolocalização não suportada neste navegador.')
    isLoadingLocation.value = false
  }
}

const submit = () => {
  if (!locationDesc.value || !issue.value || !coords.value) {
    alert('Preencha todos os campos e capture a localização.')
    return
  }

  emit('submit-report', {
    inspector: 'Thiago',
    location: locationDesc.value,
    coords: coords.value,
    issue: issue.value,
    status: 'Pendente'
  })

  // Limpar formulário
  locationDesc.value = ''
  issue.value = ''
  coords.value = null
  alert('Relatório enviado com sucesso!')
}
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Novo Relatório de Ocorrência</h2>
    
    <form @submit.prevent="submit" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Local/Estação</label>
        <input 
          v-model="locationDesc"
          type="text" 
          placeholder="Ex: Estação Presidente Altino"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Coordenadas GPS</label>
        <div class="flex gap-2">
          <input 
            v-model="coords"
            type="text" 
            readonly
            placeholder="Aguardando captura..."
            class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500"
          />
          <button 
            type="button"
            @click="getLocation"
            class="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex-shrink-0"
            :disabled="isLoadingLocation"
          >
            {{ isLoadingLocation ? '📍...' : '📍 GPS' }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição do Problema</label>
        <textarea 
          v-model="issue"
          rows="4"
          placeholder="Descreva a situação encontrada..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        ></textarea>
      </div>

      <button 
        type="submit"
        class="w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Enviar Relatório
      </button>
    </form>
  </div>
</template>
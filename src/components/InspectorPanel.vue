<script setup>
import { ref, computed, inject } from 'vue'

const emit = defineEmits(['submit-report'])
const showToast = inject('showToast')

const locationDesc = ref('')
const issue = ref('')
const coords = ref(null)
const mediaFiles = ref([])
const isLoadingLocation = ref(false)

const currentStep = ref(1)
const totalSteps = 5

const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / (totalSteps - 1)) * 100
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    if (currentStep.value === 1 && !locationDesc.value) {
      showToast('Por favor, informe o local ou estação.', 'warning')
      return
    }
    if (currentStep.value === 2 && !coords.value) {
      showToast('Por favor, capture a localização GPS.', 'warning')
      return
    }
    if (currentStep.value === 3 && !issue.value) {
      showToast('Por favor, descreva o problema.', 'warning')
      return
    }
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const getLocation = () => {
  isLoadingLocation.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coords.value = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
        isLoadingLocation.value = false
      },
      (error) => {
        showToast('Erro ao capturar localização. Verifique as permissões.', 'error')
        isLoadingLocation.value = false
      }
    )
  } else {
    showToast('Geolocalização não suportada neste navegador.', 'error')
    isLoadingLocation.value = false
  }
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  mediaFiles.value = [...mediaFiles.value, ...files]
}

const removeFile = (index) => {
  mediaFiles.value.splice(index, 1)
}

const submit = () => {
  if (!locationDesc.value || !issue.value || !coords.value) {
    showToast('Preencha os campos obrigatórios e capture a localização.', 'error')
    return
  }

  emit('submit-report', {
    inspector: 'Thiago',
    location: locationDesc.value,
    coords: coords.value,
    issue: issue.value,
    media: mediaFiles.value,
    status: 'Pendente'
  })

  // Limpar formulário
  locationDesc.value = ''
  issue.value = ''
  coords.value = null
  mediaFiles.value = []
  currentStep.value = 1
}
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Novo Relatório de Ocorrência</h2>
    
    <!-- Barra de Progresso -->
    <div class="mb-6">
      <div class="flex justify-between text-xs font-medium text-gray-500 mb-1">
        <span>Passo {{ currentStep }} de {{ totalSteps }}</span>
        <span>{{ Math.round(progressPercentage) }}% Concluído</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      
      <!-- Passo 1: Local -->
      <div v-show="currentStep === 1">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">1. Onde você está?</h3>
        <p class="text-sm text-gray-500 mb-4">Informe o nome da estação ou o local aproximado da ocorrência para facilitar a identificação pela equipe.</p>
        <label class="block text-sm font-medium text-gray-700 mb-1">Local / Estação</label>
        <input 
          v-model="locationDesc"
          type="text" 
          placeholder="Ex: Estação Presidente Altino, Plataforma 2"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- Passo 2: GPS -->
      <div v-show="currentStep === 2">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">2. Localização Exata</h3>
        <p class="text-sm text-gray-500 mb-4">Precisamos da sua localização GPS para enviar a equipe de manutenção ao ponto exato.</p>
        <div class="flex flex-col gap-3">
          <button 
            type="button"
            @click="getLocation"
            class="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
            :disabled="isLoadingLocation"
          >
            <span v-if="isLoadingLocation" class="animate-spin">⏳</span>
            <span v-else>📍</span>
            {{ isLoadingLocation ? 'Obtendo localização...' : 'Capturar Minha Localização GPS' }}
          </button>
          <input 
            v-model="coords"
            type="text" 
            readonly
            placeholder="Aguardando captura..."
            class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 text-center font-mono"
          />
        </div>
      </div>

      <!-- Passo 3: Problema -->
      <div v-show="currentStep === 3">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">3. O que aconteceu?</h3>
        <p class="text-sm text-gray-500 mb-4">Descreva com detalhes o problema encontrado. Isso ajuda a equipe a levar os equipamentos certos para o conserto.</p>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição do Problema</label>
        <textarea 
          v-model="issue"
          rows="4"
          placeholder="Ex: Lâmpada central do teto está piscando sem parar..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        ></textarea>
      </div>

      <!-- Passo 4: Mídia (Fotos/Vídeos) -->
      <div v-show="currentStep === 4">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">4. Fotos e Vídeos</h3>
        <p class="text-sm text-gray-500 mb-4">Adicione fotos ou vídeos para ilustrar e documentar o problema visualmente. (Opcional)</p>
        
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
          <input 
            type="file" 
            multiple 
            accept="image/*,video/*"
            @change="handleFileUpload"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Selecione fotos ou vídeos"
          />
          <div class="text-4xl mb-2">📎</div>
          <p class="text-sm text-gray-600 font-medium">Toque para selecionar ou tirar fotos/vídeos</p>
          <p class="text-xs text-gray-400 mt-1">Formatos suportados: PNG, JPG, MP4</p>
        </div>

        <div v-if="mediaFiles.length > 0" class="mt-4 space-y-2">
          <p class="text-sm font-semibold text-gray-700">Arquivos anexados:</p>
          <ul class="space-y-2">
            <li v-for="(file, index) in mediaFiles" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200 text-sm">
              <span class="truncate text-gray-600 max-w-[80%] font-medium">{{ file.name }}</span>
              <button type="button" @click="removeFile(index)" class="text-red-500 hover:text-red-700 font-bold px-2" title="Remover">X</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Passo 5: Revisão -->
      <div v-show="currentStep === 5">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">5. Revisar e Enviar</h3>
        <p class="text-sm text-gray-500 mb-4">Verifique se as informações abaixo estão corretas antes de finalizar o relatório.</p>
        
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 base-text">
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Local/Estação</span>
            <p class="font-medium text-gray-800">{{ locationDesc }}</p>
          </div>
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Coordenadas GPS</span>
            <p class="font-medium text-gray-800">{{ coords }}</p>
          </div>
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Problema Relatado</span>
            <p class="font-medium text-gray-800">{{ issue }}</p>
          </div>
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Mídia anexada</span>
            <p class="font-medium text-gray-800">{{ mediaFiles.length }} arquivo(s)</p>
          </div>
        </div>
      </div>

      <!-- Botões de Navegação -->
      <div class="flex items-center justify-between pt-4 mt-6 border-t border-gray-100">
        <button 
          v-if="currentStep > 1"
          type="button"
          @click="prevStep"
          class="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-150 font-medium focus:ring-2 focus:ring-gray-300"
        >
          Voltar
        </button>
        <div v-else></div>

        <button 
          v-if="currentStep < totalSteps"
          type="button"
          @click="nextStep"
          class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-150 font-medium shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          Próximo Passo
        </button>
        
        <button 
          v-if="currentStep === totalSteps"
          type="submit"
          class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 font-bold shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
        >
          Confirmar e Enviar Relatório
        </button>
      </div>
    </form>
  </div>
</template>
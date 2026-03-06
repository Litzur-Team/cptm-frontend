<script setup>
import { ref, computed, inject, watch, nextTick, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para ícones padrão do Leaflet com bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const emit = defineEmits(['submit-report'])
const showToast = inject('showToast')

const locationDesc = ref('')
const issue = ref('')
const selectedCategory = ref(null)
const coords = ref(null)
const lat = ref(null)
const lng = ref(null)
const mediaFiles = ref([])
const isLoadingLocation = ref(false)

const currentStep = ref(1)
const totalSteps = 5

// Mapa Leaflet
const mapContainer = ref(null)
let map = null
let marker = null

// Mini mapa de preview (step 5)
const previewMapContainer = ref(null)
let previewMap = null
let previewMarker = null

const problemCategories = [
  { id: 'catraca', label: 'Catraca inoperante', icon: '🚧' },
  { id: 'iluminacao', label: 'Iluminação com defeito', icon: '💡' },
  { id: 'limpeza', label: 'Limpeza / Higiene', icon: '🧹' },
  { id: 'acessibilidade', label: 'Acessibilidade comprometida', icon: '♿' },
  { id: 'seguranca', label: 'Problema de segurança', icon: '⚠️' },
  { id: 'sinalizacao', label: 'Sinalização danificada', icon: '🪧' },
  { id: 'vazamento', label: 'Vazamento / Infiltração', icon: '💧' },
  { id: 'escada', label: 'Escada rolante parada', icon: '🔧' },
  { id: 'elevador', label: 'Elevador fora de serviço', icon: '🛗' },
  { id: 'outro', label: 'Outro problema', icon: '📝' },
]

const selectCategory = (cat) => {
  if (selectedCategory.value === cat.id) {
    selectedCategory.value = null
  } else {
    selectedCategory.value = cat.id
    if (cat.id !== 'outro' && !issue.value) {
      issue.value = cat.label
    }
  }
}

const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / (totalSteps - 1)) * 100
})

const initMap = (latitude, longitude) => {
  if (map) {
    map.setView([latitude, longitude], 16)
    if (marker) {
      marker.setLatLng([latitude, longitude])
    } else {
      marker = L.marker([latitude, longitude], { draggable: true }).addTo(map)
      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        updateCoords(pos.lat, pos.lng)
      })
    }
    return
  }

  nextTick(() => {
    if (!mapContainer.value) return

    map = L.map(mapContainer.value).setView([latitude, longitude], 16)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    marker = L.marker([latitude, longitude], { draggable: true }).addTo(map)
    marker.bindPopup('Arraste para ajustar a posição').openPopup()

    marker.on('dragend', () => {
      const pos = marker.getLatLng()
      updateCoords(pos.lat, pos.lng)
    })

    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng
      marker.setLatLng([clickLat, clickLng])
      updateCoords(clickLat, clickLng)
    })

    // Garante que o mapa renderize corretamente
    setTimeout(() => map.invalidateSize(), 100)
  })
}

const updateCoords = (latitude, longitude) => {
  lat.value = latitude
  lng.value = longitude
  coords.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}

const destroyMap = () => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
}

const destroyPreviewMap = () => {
  if (previewMap) {
    previewMap.remove()
    previewMap = null
    previewMarker = null
  }
}

const initPreviewMap = () => {
  if (!lat.value || !lng.value) return
  destroyPreviewMap()
  nextTick(() => {
    if (!previewMapContainer.value) return
    previewMap = L.map(previewMapContainer.value, {
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      attributionControl: false,
    }).setView([lat.value, lng.value], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(previewMap)
    previewMarker = L.marker([lat.value, lng.value]).addTo(previewMap)
    setTimeout(() => previewMap.invalidateSize(), 100)
  })
}

onUnmounted(() => {
  destroyMap()
  destroyPreviewMap()
})

// Quando sai/entra no step 2, gerencia o mapa
watch(currentStep, (newStep, oldStep) => {
  if (newStep === 2 && coords.value && lat.value && lng.value) {
    nextTick(() => initMap(lat.value, lng.value))
  }
  if (oldStep === 2 && newStep !== 2) {
    destroyMap()
  }
  if (newStep === 5) {
    initPreviewMap()
  }
  if (oldStep === 5 && newStep !== 5) {
    destroyPreviewMap()
  }
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
      showToast('Por favor, descreva o problema encontrado.', 'warning')
      return
    }
    if (currentStep.value === 3 && !selectedCategory.value) {
      showToast('Selecione uma categoria do problema.', 'warning')
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
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        updateCoords(latitude, longitude)
        isLoadingLocation.value = false
        showToast('Localização capturada com sucesso!', 'success')
        nextTick(() => initMap(latitude, longitude))
      },
      () => {
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
  selectedCategory.value = null
  coords.value = null
  lat.value = null
  lng.value = null
  mediaFiles.value = []
  currentStep.value = 1
  destroyMap()
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

          <!-- Mapa Leaflet -->
          <div 
            ref="mapContainer"
            v-show="coords"
            class="w-full h-56 rounded-lg border border-gray-300 overflow-hidden shadow-inner z-0"
          ></div>
          <p v-if="coords" class="text-xs text-gray-400 text-center -mt-1">Toque no mapa ou arraste o pin para ajustar</p>

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
        <p class="text-sm text-gray-500 mb-4">Selecione a categoria e descreva o problema com detalhes para a equipe.</p>
        
        <!-- Categorias selecionáveis -->
        <label class="block text-sm font-medium text-gray-700 mb-2">Categoria do Problema</label>
        <div class="grid grid-cols-2 gap-2 mb-4">
          <button
            v-for="cat in problemCategories"
            :key="cat.id"
            type="button"
            @click="selectCategory(cat)"
            :class="selectedCategory === cat.id
              ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-200'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
            class="flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-sm font-medium transition-all duration-150 active:scale-95"
          >
            <span class="text-lg shrink-0">{{ cat.icon }}</span>
            <span class="leading-tight">{{ cat.label }}</span>
          </button>
        </div>

        <!-- Campo de descrição detalhada -->
        <label class="block text-sm font-medium text-gray-700 mb-1">Detalhes do Problema</label>
        <textarea 
          v-model="issue"
          rows="4"
          placeholder="Ex: Lâmpada central do teto está piscando sem parar..."
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
        ></textarea>
        <p class="text-xs text-gray-400 mt-1">Descreva com detalhes para a equipe levar os equipamentos certos.</p>
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
            <p class="font-medium text-gray-800 font-mono text-sm">📍 {{ coords }}</p>
          </div>
          <!-- Mini mapa de preview na revisão -->
          <div
            v-if="lat && lng"
            ref="previewMapContainer"
            class="w-full h-36 rounded-lg border border-gray-200 shadow-sm z-0"
          ></div>
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</span>
            <p class="font-medium text-gray-800">{{ problemCategories.find(c => c.id === selectedCategory)?.icon }} {{ problemCategories.find(c => c.id === selectedCategory)?.label }}</p>
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
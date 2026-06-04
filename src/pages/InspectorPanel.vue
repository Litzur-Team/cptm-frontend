<script setup>
import { ref, computed, inject, watch, nextTick, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const emit = defineEmits(['submit-report'])
const showToast = inject('showToast')

// ─── Listas Suspensas ────────────────────────────────────────────────────────
const listaSiglasGEA = ['GEA.DEAE', 'GEA.DEAO', 'GEA.DEAS']

const listaAreasGestoras = [
  '(DO.GOF.DOFS.0000) DEPTO. DE MANUT. DE SISTEMAS ELETR. E RESTAB. DE SERVICOS [ID.10-15-5-3-0000]',
  '(DO.GOT.DOTV.1000) DEPTO. DE OPERAÇÃO E TRANSPORTE DE VEÍCULOS [ID.10-15-5-4-1000]',
  '(DO.GOI.DOIC.0000) DEPTO. DE INFRAESTRUTURA CIVIL [ID.10-15-3-1-0000]',
  '(DO.GOC.DOCC.0000) DEPTO. DE CONTROLE DE CONTRATOS [ID.10-15-2-1-0000]',
]

const listaNaturezaPGA = ['Efluente', 'Emissões Atmosféricas']

const listaMunicipios = [
  'São Paulo', 'Guarulhos', 'Mogi das Cruzes', 'Santo André',
  'São Bernardo do Campo', 'São Caetano do Sul', 'Mauá', 'Ribeirão Pires',
  'Rio Grande da Serra', 'Franco da Rocha', 'Francisco Morato',
  'Campo Limpo Paulista', 'Várzea Paulista', 'Jundiaí',
  'Poá', 'Suzano', 'Ferraz de Vasconcelos', 'Itaquaquecetuba', 'Arujá',
]

const listaLinhasCPTM = [
  'Linha 07 - Rubi', 'Linha 08 - Diamante', 'Linha 09 - Esmeralda',
  'Linha 10 - Turquesa', 'Linha 11 - Coral', 'Linha 12 - Safira', 'Linha 13 - Jade',
]

const listaEstacoesCPTM = [
  'Estação Luz', 'Estação Brás', 'Estação Tatuapé', 'Estação Osasco',
  'Estação Palmeiras-Barra Funda', 'Estação Pinheiros', 'Estação Santo André',
  'Estação São Caetano do Sul', 'Estação Mauá', 'Estação Ribeirão Pires',
  'Estação Jardim Helena - Vila Mara', 'Estação Ferraz de Vasconcelos',
  'Estação Antônio Gianetti Neto', 'Estação Poá', 'Estação Suzano',
]

const listaViasCPTM = [
  'Via 01', 'Via 02', 'Via 03E - Trecho 1', 'Via 03E - Trecho 2',
  'Via 04', 'Via 05', 'Via 06',
]

const listaTrechosSentidos = [
  'Estação Brás - Estação Tatuapé',
  'Estação Luz - Estação Brás',
  'Estação Osasco - Estação Palmeiras-Barra Funda',
  'Estação Antônio Gianetti Neto - Estação Ferraz de Vasconcelos',
  'Estação Suzano - Estação Poá',
]

const listaTiposAtividadeListada = [
  'Construção Civil', 'Manutenção Industrial', 'Operação Ferroviária', 'Outro(a)(s)',
]

const listaTiposDRA = [
  'Licença de Operação', 'Licença de Instalação',
  'Autorização Ambiental', 'Dispensa de Licença', 'Outro(a)(s)',
]

const listaTiposAtividadeCPTM = [
  'Empreendimento/Obra', 'Operação/Manutenção', 'Serviço Contratado',
]

const listaLocaisAtividade = [
  'Estação', 'Pátio', 'Via Permanente', 'Edificação Administrativa', 'Túnel',
]

const listaOrigemEfluente = ['Doméstico', 'Industrial', 'Pluvial', 'Misto']

const listaFonteGeradora = [
  'Banheiro químico', 'ETE', 'Caixa separadora de água e óleo',
  'Vala/canaleta de drenagem', 'Outro',
]

const listaDestinacoesEfluente = [
  'Interligação em rede coletora', 'Destinação em ETE', 'Reúso', 'Outro',
]

const listaTiposVeiculo = [
  'Caminhão', 'Caminhão-tanque', 'Veículo leve', 'Não se aplica',
]

// ─── Step 1: Premissas Institucionais / Cabeçalho ────────────────────────────
const nomePJContratada = ref('')
const nrContratoContratada = ref('')
const localEscopoContratual = ref('')
const representantePF = ref('')
const siglaGEA = ref('')
const nomeAreaGestoraCPTM = ref('')
const idAreaGestoraCPTM = computed(() => {
  const match = nomeAreaGestoraCPTM.value.match(/\[([^\]]+)\]/)
  return match ? match[1] : ''
})
const siglaAreaGestoraCPTM = computed(() => {
  const match = nomeAreaGestoraCPTM.value.match(/\(([^)]+)\)/)
  return match ? match[1] : ''
})
const nomePJSupervisora = ref('')

// ─── Step 2: Identificação do Cadastrador e Responsável Técnico ──────────────
const autorPFCadastramento = ref('')
const responsavelTecnico = ref('')
const registroProfissional = ref('')
const documentoRT = ref('')

// ─── Step 3: Identificação do Formulário ────────────────────────────────────
const naturezaPGA = ref('')
const tipoFormulario = computed(() => 'Formulário de Cadastramento - FDC (FDC-EEA.EF)')
const dataEmissaoFormulario = ref('')
const numeroFormulario = ref('')
const autorPFFormulario = ref('')
const nomeArquivoFDC = computed(() => {
  if (!numeroFormulario.value) return ''
  const num = String(numeroFormulario.value).padStart(6, '0')
  const year = dataEmissaoFormulario.value ? dataEmissaoFormulario.value.split('-')[0] : new Date().getFullYear()
  return `FdcEeaEfA${year}CptmN${num}`
})
const codigoArquivoFDC = computed(() => {
  if (!numeroFormulario.value) return ''
  const num = String(numeroFormulario.value).padStart(6, '0')
  const year = dataEmissaoFormulario.value ? dataEmissaoFormulario.value.split('-')[0] : new Date().getFullYear()
  return `FDC-EEA.EF-A.${year}-CPTM-N.${num}`
})

// ─── Step 4: Data e Hora do Cadastro ────────────────────────────────────────
const dataCadastramento = ref('')
const horaCadastramento = ref('')

// ─── Step 5: Identificação do E.M. ──────────────────────────────────────────
const nrElementoMonitoramento = ref('')
const nmElementoMonitoramento = ref('')
const chavePrimariaMA = computed(() => {
  if (!nrElementoMonitoramento.value) return ''
  const num = String(nrElementoMonitoramento.value).padStart(6, '0')
  const year = dataCadastramento.value ? dataCadastramento.value.split('-')[0] : new Date().getFullYear()
  return `EEA.EF-A.${year}-CPTM-N.${num}`
})

// ─── Step 6: Localização do E.M. ────────────────────────────────────────────
const municipio = ref('')
const linhaCPTM = ref('')
const estacaoCPTM = ref('')
const viaCPTM = ref('')
const trechoSentido = ref('')
const kmPoste = ref('')
const lat = ref(null)
const lng = ref(null)
const coords = ref(null)
const isLoadingLocation = ref(false)

const mapContainer = ref(null)
let map = null
let marker = null

// ─── Step 7: Caracterização do E.M. ─────────────────────────────────────────
// 7.1 Regulamentação Ambiental
const tipoAtividadeListada = ref('')
const tipoAtividadeNaoListada = ref('')
const tipoDRAListado = ref('')
const tipoDRANaoListado = ref('')
const codDRA = ref('')
const dataValidadeDRA = ref('')

// 7.2 Detalhamento
const tipoAtividadeCPTM = ref('')
const nomeLocalAtividade = ref('')
const nomeLocalComplemento = ref('')
const origemEfluente = ref('')
const fonteGeradora = ref('')
const quantidadeLitros = ref('')
const tipoDestinacao = ref('')
const tipoVeiculo = ref('')
const placaVeiculo = ref('')
const codGuiaRemessa = ref('')
const distanciaVia = ref('')
const observacoesCadastramento = ref('')

// 7.3 Registro Fotográfico
const fotos = ref([null, null, null, null])

// ─── Navegação ───────────────────────────────────────────────────────────────
const currentStep = ref(1)
const totalSteps = 7

const stepTitles = [
  'Premissas Institucionais',
  'Cadastrador e Resp. Técnico',
  'Identificação do Formulário',
  'Data e Hora do Cadastro',
  'Identificação do E.M.',
  'Localização do E.M.',
  'Caracterização do E.M.',
]

const progressPercentage = computed(() => ((currentStep.value - 1) / (totalSteps - 1)) * 100)

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!nomePJContratada.value || !localEscopoContratual.value || !siglaGEA.value) {
      showToast('Preencha os campos obrigatórios: Contratada, Local do Escopo e Sigla GEA.', 'warning')
      return
    }
  }
  if (currentStep.value === 2) {
    if (!autorPFCadastramento.value || !responsavelTecnico.value) {
      showToast('Informe o Autor e o Responsável Técnico pelo cadastramento.', 'warning')
      return
    }
  }
  if (currentStep.value === 3) {
    if (!naturezaPGA.value || !dataEmissaoFormulario.value || !numeroFormulario.value) {
      showToast('Preencha a Natureza, Data de Emissão e Número do Formulário.', 'warning')
      return
    }
  }
  if (currentStep.value === 4) {
    if (!dataCadastramento.value || !horaCadastramento.value) {
      showToast('Informe a data e hora do cadastramento.', 'warning')
      return
    }
  }
  if (currentStep.value === 5) {
    if (!nrElementoMonitoramento.value || !nmElementoMonitoramento.value) {
      showToast('Preencha o número e o nome do Elemento de Monitoramento.', 'warning')
      return
    }
  }
  if (currentStep.value === 6) {
    if (!municipio.value || !coords.value) {
      showToast('Selecione o município e capture a localização GPS.', 'warning')
      return
    }
  }
  if (currentStep.value < totalSteps) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// ─── GPS e Mapa ──────────────────────────────────────────────────────────────
const updateCoords = (latitude, longitude) => {
  lat.value = latitude
  lng.value = longitude
  coords.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}

const initMap = (latitude, longitude) => {
  if (map) {
    map.setView([latitude, longitude], 16)
    if (marker) {
      marker.setLatLng([latitude, longitude])
    } else {
      marker = L.marker([latitude, longitude], { draggable: true }).addTo(map)
      marker.on('dragend', () => { const p = marker.getLatLng(); updateCoords(p.lat, p.lng) })
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
    marker.on('dragend', () => { const p = marker.getLatLng(); updateCoords(p.lat, p.lng) })
    map.on('click', (e) => { marker.setLatLng([e.latlng.lat, e.latlng.lng]); updateCoords(e.latlng.lat, e.latlng.lng) })
    setTimeout(() => map.invalidateSize(), 100)
  })
}

const destroyMap = () => {
  if (map) { map.remove(); map = null; marker = null }
}

const getLocation = () => {
  isLoadingLocation.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateCoords(pos.coords.latitude, pos.coords.longitude)
        isLoadingLocation.value = false
        showToast('Localização capturada com sucesso!', 'success')
        nextTick(() => initMap(pos.coords.latitude, pos.coords.longitude))
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

watch(currentStep, (newStep, oldStep) => {
  if (newStep === 6 && coords.value && lat.value && lng.value) {
    nextTick(() => initMap(lat.value, lng.value))
  }
  if (oldStep === 6 && newStep !== 6) {
    destroyMap()
  }
})

onUnmounted(() => destroyMap())

// ─── Fotos ───────────────────────────────────────────────────────────────────
const handleFotoUpload = (index, event) => {
  const file = event.target.files[0]
  if (file) {
    const updated = [...fotos.value]
    updated[index] = file
    fotos.value = updated
  }
}

const removeFoto = (index) => {
  const updated = [...fotos.value]
  updated[index] = null
  fotos.value = updated
}

// ─── Submit ──────────────────────────────────────────────────────────────────
const submit = () => {
  if (!tipoAtividadeCPTM.value || !origemEfluente.value) {
    showToast('Preencha os campos obrigatórios da Caracterização.', 'error')
    return
  }

  emit('submit-report', {
    nomePJContratada: nomePJContratada.value,
    nrContratoContratada: nrContratoContratada.value,
    localEscopoContratual: localEscopoContratual.value,
    representantePF: representantePF.value,
    siglaGEA: siglaGEA.value,
    nomeAreaGestoraCPTM: nomeAreaGestoraCPTM.value,
    idAreaGestoraCPTM: idAreaGestoraCPTM.value,
    siglaAreaGestoraCPTM: siglaAreaGestoraCPTM.value,
    nomePJSupervisora: nomePJSupervisora.value,
    autorPFCadastramento: autorPFCadastramento.value,
    responsavelTecnico: responsavelTecnico.value,
    registroProfissional: registroProfissional.value,
    documentoRT: documentoRT.value,
    naturezaPGA: naturezaPGA.value,
    tipoFormulario: tipoFormulario.value,
    dataEmissaoFormulario: dataEmissaoFormulario.value,
    numeroFormulario: numeroFormulario.value,
    autorPFFormulario: autorPFFormulario.value,
    nomeArquivoFDC: nomeArquivoFDC.value,
    codigoArquivoFDC: codigoArquivoFDC.value,
    dataCadastramento: dataCadastramento.value,
    horaCadastramento: horaCadastramento.value,
    chavePrimariaMA: chavePrimariaMA.value,
    nrElementoMonitoramento: nrElementoMonitoramento.value,
    nmElementoMonitoramento: nmElementoMonitoramento.value,
    municipio: municipio.value,
    linhaCPTM: linhaCPTM.value,
    estacaoCPTM: estacaoCPTM.value,
    viaCPTM: viaCPTM.value,
    trechoSentido: trechoSentido.value,
    kmPoste: kmPoste.value,
    lat: lat.value,
    lng: lng.value,
    tipoAtividadeListada: tipoAtividadeListada.value,
    tipoAtividadeNaoListada: tipoAtividadeNaoListada.value,
    tipoDRAListado: tipoDRAListado.value,
    tipoDRANaoListado: tipoDRANaoListado.value,
    codDRA: codDRA.value,
    dataValidadeDRA: dataValidadeDRA.value,
    tipoAtividadeCPTM: tipoAtividadeCPTM.value,
    nomeLocalAtividade: nomeLocalAtividade.value,
    nomeLocalComplemento: nomeLocalComplemento.value,
    origemEfluente: origemEfluente.value,
    fonteGeradora: fonteGeradora.value,
    quantidadeLitros: quantidadeLitros.value,
    tipoDestinacao: tipoDestinacao.value,
    tipoVeiculo: tipoVeiculo.value,
    placaVeiculo: placaVeiculo.value,
    codGuiaRemessa: codGuiaRemessa.value,
    distanciaVia: distanciaVia.value,
    observacoesCadastramento: observacoesCadastramento.value,
    fotos: fotos.value.filter(Boolean),
    status: 'Pendente',
  })

  // Reset
  nomePJContratada.value = ''
  nrContratoContratada.value = ''
  localEscopoContratual.value = ''
  representantePF.value = ''
  siglaGEA.value = ''
  nomeAreaGestoraCPTM.value = ''
  nomePJSupervisora.value = ''
  autorPFCadastramento.value = ''
  responsavelTecnico.value = ''
  registroProfissional.value = ''
  documentoRT.value = ''
  naturezaPGA.value = ''
  dataEmissaoFormulario.value = ''
  numeroFormulario.value = ''
  autorPFFormulario.value = ''
  dataCadastramento.value = ''
  horaCadastramento.value = ''
  nrElementoMonitoramento.value = ''
  nmElementoMonitoramento.value = ''
  municipio.value = ''
  linhaCPTM.value = ''
  estacaoCPTM.value = ''
  viaCPTM.value = ''
  trechoSentido.value = ''
  kmPoste.value = ''
  lat.value = null
  lng.value = null
  coords.value = null
  tipoAtividadeListada.value = ''
  tipoAtividadeNaoListada.value = ''
  tipoDRAListado.value = ''
  tipoDRANaoListado.value = ''
  codDRA.value = ''
  dataValidadeDRA.value = ''
  tipoAtividadeCPTM.value = ''
  nomeLocalAtividade.value = ''
  nomeLocalComplemento.value = ''
  origemEfluente.value = ''
  fonteGeradora.value = ''
  quantidadeLitros.value = ''
  tipoDestinacao.value = ''
  tipoVeiculo.value = ''
  placaVeiculo.value = ''
  codGuiaRemessa.value = ''
  distanciaVia.value = ''
  observacoesCadastramento.value = ''
  fotos.value = [null, null, null, null]
  currentStep.value = 1
  destroyMap()
}
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h2 class="text-xl font-bold mb-1 text-gray-800">FDC - Efluentes e Emissões Atmosféricas</h2>
    <p class="text-xs text-gray-400 mb-4">Formulário de Cadastramento/Caracterização - EEA.EF</p>

    <!-- Barra de Progresso -->
    <div class="mb-5">
      <div class="flex justify-between text-xs font-medium text-gray-500 mb-1">
        <span class="font-semibold text-gray-700">{{ currentStep }}. {{ stepTitles[currentStep - 1] }}</span>
        <span>{{ currentStep }} / {{ totalSteps }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-red-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-4">

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 1 — Premissas Institucionais / Cabeçalho
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 1" class="space-y-4">
        <p class="text-sm text-gray-500">Dados institucionais e contratuais relativos ao escopo ambiental.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome (PJ) da Contratada <span class="text-red-500">*</span>
          </label>
          <input v-model="nomePJContratada" type="text"
            placeholder='Ex: Empresa Contratada Ltda. - ECL'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Informe nome e sigla separados por " - ". Sigla: até 10 caracteres maiúsculos, sem espaços.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nº do Contrato (da Contratada)
          </label>
          <input v-model="nrContratoContratada" type="text"
            placeholder='Ex: AR01234-56'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Até 12 caracteres, sem espaços.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Local do Escopo Contratual (Pseudônimo) <span class="text-red-500">*</span>
          </label>
          <input v-model="localEscopoContratual" type="text"
            placeholder='Ex: Pátio Capuava'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome genérico para o local do escopo contratual ou área/trecho da CPTM.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Representante (PF) da Contratada e/ou Área Gestora CPTM
          </label>
          <input v-model="representantePF" type="text"
            placeholder='Ex: Pessoa 1 / Pessoa 2'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome do interlocutor para assuntos de meio ambiente. Máx. 89 caracteres.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Sigla da Área de Meio Ambiente <span class="text-red-500">*</span>
          </label>
          <select v-model="siglaGEA"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a sigla...</option>
            <option v-for="item in listaSiglasGEA" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome da Área Gestora CPTM
          </label>
          <select v-model="nomeAreaGestoraCPTM"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a área gestora...</option>
            <option v-for="item in listaAreasGestoras" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div v-if="nomeAreaGestoraCPTM" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Identificador da Área Gestora CPTM
            </label>
            <input :value="idAreaGestoraCPTM" type="text" readonly
              class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
            <p class="text-xs text-gray-400 mt-1">Campo automático</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Sigla da Área Gestora CPTM
            </label>
            <input :value="siglaAreaGestoraCPTM" type="text" readonly
              class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
            <p class="text-xs text-gray-400 mt-1">Campo automático</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome (PJ) da Supervisora Ambiental
          </label>
          <input v-model="nomePJSupervisora" type="text"
            placeholder='Ex: Empresa de Supervisão Ambiental Ltda. - ESA'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome e sigla da supervisora ambiental. Máx. 89 caracteres.</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 2 — Identificação do Cadastrador e Responsável Técnico
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 2" class="space-y-4">
        <p class="text-sm text-gray-500">Dados sobre quem realiza e assina tecnicamente o cadastramento.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Autor(a) (PF) do Cadastramento <span class="text-red-500">*</span>
          </label>
          <input v-model="autorPFCadastramento" type="text"
            placeholder='Ex: João Silva'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome completo da pessoa que realizou o cadastramento.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Responsável Técnico - RT pelo Cadastramento <span class="text-red-500">*</span>
          </label>
          <input v-model="responsavelTecnico" type="text"
            placeholder='Ex: Maria Souza'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome completo do(a) responsável técnico(a) pelo cadastramento.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Registro Profissional (do RT)
          </label>
          <input v-model="registroProfissional" type="text"
            placeholder='Ex: CREA - 123456'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Registro profissional do(a) responsável técnico(a).</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Documento de Responsabilidade Técnica (do RT)
          </label>
          <input v-model="documentoRT" type="text"
            placeholder='Ex: ART nº 123456'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Ex: Anotação de Responsabilidade Técnica - ART.</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 3 — Identificação do Formulário
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 3" class="space-y-4">
        <p class="text-sm text-gray-500">Dados de identificação e numeração do formulário FDC.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Natureza (do PGA) <span class="text-red-500">*</span>
          </label>
          <select v-model="naturezaPGA"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a natureza...</option>
            <option v-for="item in listaNaturezaPGA" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Tipo de Formulário
          </label>
          <input :value="tipoFormulario" type="text" readonly
            class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
          <p class="text-xs text-gray-400 mt-1">Campo automático</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Data de Emissão do Formulário <span class="text-red-500">*</span>
            </label>
            <input v-model="dataEmissaoFormulario" type="date"
              class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Número do Formulário <span class="text-red-500">*</span>
            </label>
            <input v-model="numeroFormulario" type="number" min="1" max="999999"
              placeholder='Ex: 1'
              class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
            <p class="text-xs text-gray-400 mt-1">Sequencial de 1 a 999.999.</p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Autor(a) (PF) do Formulário
          </label>
          <input v-model="autorPFFormulario" type="text"
            placeholder='Ex: João Antônio'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
        </div>

        <div v-if="nomeArquivoFDC" class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Nome do Arquivo FDC
            </label>
            <input :value="nomeArquivoFDC" type="text" readonly
              class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
            <p class="text-xs text-gray-400 mt-1">Campo automático</p>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Código do Arquivo FDC
            </label>
            <input :value="codigoArquivoFDC" type="text" readonly
              class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
            <p class="text-xs text-gray-400 mt-1">Campo automático</p>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 4 — Data e Hora do Cadastro do E.M.
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 4" class="space-y-4">
        <p class="text-sm text-gray-500">Registro temporal do momento em que o cadastramento foi realizado.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Data do Cadastramento <span class="text-red-500">*</span>
          </label>
          <input v-model="dataCadastramento" type="date"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Padrão: dd/mm/aaaa</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Hora do Cadastramento <span class="text-red-500">*</span>
          </label>
          <input v-model="horaCadastramento" type="time"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Padrão: hh:mm</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 5 — Identificação do Elemento de Monitoramento
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 5" class="space-y-4">
        <p class="text-sm text-gray-500">Identifique o Elemento de Monitoramento (E.M.) a ser cadastrado.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Chave Primária - Meio Ambiente
          </label>
          <input :value="chavePrimariaMA || '(Gerada após preencher número e data)'" type="text" readonly
            class="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
          <p class="text-xs text-gray-400 mt-1">Campo automático</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Elemento de Monitoramento — Número <span class="text-red-500">*</span>
          </label>
          <input v-model="nrElementoMonitoramento" type="number" min="1" max="999999"
            placeholder='Ex: 1'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Sequencial de 1 a 999.999. Exibido como N.000001.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Elemento de Monitoramento — Nome <span class="text-red-500">*</span>
          </label>
          <input v-model="nmElementoMonitoramento" type="text"
            placeholder='Ex: Plataforma 1, Caçamba A, Banheiro Químico B'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Nome genérico (pseudônimo) para o elemento monitorado.</p>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 6 — Localização do E.M.
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 6" class="space-y-4">
        <p class="text-sm text-gray-500">Informe a localização geográfica do Elemento de Monitoramento.</p>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome de Município <span class="text-red-500">*</span>
          </label>
          <select v-model="municipio"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione o município...</option>
            <option v-for="item in listaMunicipios" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome da Linha CPTM
          </label>
          <select v-model="linhaCPTM"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a linha...</option>
            <option v-for="item in listaLinhasCPTM" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Nome da Estação CPTM
          </label>
          <select v-model="estacaoCPTM"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a estação...</option>
            <option v-for="item in listaEstacoesCPTM" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Número da Via da Linha CPTM
          </label>
          <select v-model="viaCPTM"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione a via...</option>
            <option v-for="item in listaViasCPTM" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Trecho e Sentido da Linha CPTM
          </label>
          <select v-model="trechoSentido"
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
            <option value="">Selecione o trecho/sentido...</option>
            <option v-for="item in listaTrechosSentidos" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Número do Quilômetro e Poste
          </label>
          <input v-model="kmPoste" type="text"
            placeholder='Ex: 51/02 ou 210/125'
            class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
          <p class="text-xs text-gray-400 mt-1">Padrão: "00/00" ou "000/000"</p>
        </div>

        <!-- GPS -->
        <div class="border-t border-gray-100 pt-4">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Coordenadas GPS (Datum: WGS84) <span class="text-red-500">*</span>
          </label>
          <button type="button" @click="getLocation"
            class="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
            :disabled="isLoadingLocation">
            <span v-if="isLoadingLocation" class="animate-spin">⏳</span>
            <span v-else>📍</span>
            {{ isLoadingLocation ? 'Obtendo localização...' : 'Capturar Minha Localização GPS' }}
          </button>

          <div ref="mapContainer" v-show="coords"
            class="w-full h-52 rounded-lg border border-gray-300 overflow-hidden shadow-inner z-0 mt-3"></div>
          <p v-if="coords" class="text-xs text-gray-400 text-center mt-1">Toque no mapa ou arraste o pin para ajustar</p>

          <div v-if="coords" class="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Latitude</label>
              <input :value="lat ? lat.toFixed(6) : ''" type="text" readonly
                class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-mono" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Longitude</label>
              <input :value="lng ? lng.toFixed(6) : ''" type="text" readonly
                class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-mono" />
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           STEP 7 — Caracterização do E.M.
      ═════════════════════════════════════════════════════════════════════ -->
      <div v-show="currentStep === 7" class="space-y-5">

        <!-- 7.1 Regulamentação Ambiental -->
        <div>
          <h4 class="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-100">
            7.1 — Regulamentação Ambiental
          </h4>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de Atividade (Listada)
              </label>
              <select v-model="tipoAtividadeListada"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="">Selecione...</option>
                <option v-for="item in listaTiposAtividadeListada" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <div v-if="tipoAtividadeListada === 'Outro(a)(s)'">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de Atividade (Não Listada)
              </label>
              <input v-model="tipoAtividadeNaoListada" type="text"
                placeholder='Ex: Transporte'
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de DRA (Listado)
              </label>
              <select v-model="tipoDRAListado"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="">Selecione...</option>
                <option v-for="item in listaTiposDRA" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <div v-if="tipoDRAListado === 'Outro(a)(s)'">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de DRA (Não Listado)
              </label>
              <input v-model="tipoDRANaoListado" type="text"
                placeholder='Ex: CADRI'
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Código Identificador do DRA
              </label>
              <input v-model="codDRA" type="text"
                placeholder='Ex: DRF nº 123.456'
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Data de Validade do DRA
              </label>
              <input v-model="dataValidadeDRA" type="date"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
            </div>
          </div>
        </div>

        <!-- 7.2 Detalhamento -->
        <div>
          <h4 class="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-100">
            7.2 — Detalhamento
          </h4>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de Atividade na CPTM <span class="text-red-500">*</span>
              </label>
              <select v-model="tipoAtividadeCPTM"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="">Selecione...</option>
                <option v-for="item in listaTiposAtividadeCPTM" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Nome Edificação/Local da CPTM
                </label>
                <select v-model="nomeLocalAtividade"
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="item in listaLocaisAtividade" :key="item" :value="item">{{ item }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Complemento
                </label>
                <input v-model="nomeLocalComplemento" type="text"
                  placeholder='Ex: Brás'
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Origem do Efluente <span class="text-red-500">*</span>
                </label>
                <select v-model="origemEfluente"
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="item in listaOrigemEfluente" :key="item" :value="item">{{ item }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Fonte Geradora do Efluente
                </label>
                <select v-model="fonteGeradora"
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="item in listaFonteGeradora" :key="item" :value="item">{{ item }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Quantidade (Litros)
              </label>
              <input v-model="quantidadeLitros" type="number" min="0" step="0.00000001"
                placeholder='Ex: 9,25'
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
              <p class="text-xs text-gray-400 mt-1">Número com até 8 casas decimais.</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Tipo de Destinação do Efluente
              </label>
              <select v-model="tipoDestinacao"
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                <option value="">Selecione...</option>
                <option v-for="item in listaDestinacoesEfluente" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Tipo de Veículo
                </label>
                <select v-model="tipoVeiculo"
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white">
                  <option value="">Selecione...</option>
                  <option v-for="item in listaTiposVeiculo" :key="item" :value="item">{{ item }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Identificador/Placa do Veículo
                </label>
                <input v-model="placaVeiculo" type="text"
                  placeholder='Ex: WAD1A05'
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Cód. Identificador da Guia de Remessa
                </label>
                <input v-model="codGuiaRemessa" type="text"
                  placeholder='Ex: ID nº 10.456'
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Distância da Via CPTM (m)
                </label>
                <input v-model="distanciaVia" type="number" min="0" step="0.01"
                  placeholder='Ex: 7,58'
                  class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Observações Gerais: Cadastramento
              </label>
              <textarea v-model="observacoesCadastramento" rows="3"
                placeholder='Observações relevantes relativas ao cadastramento/caracterização...'
                class="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
                maxlength="255"></textarea>
              <p class="text-xs text-gray-400 mt-1">Máx. 255 caracteres.</p>
            </div>
          </div>
        </div>

        <!-- 7.3 Registro Fotográfico -->
        <div>
          <h4 class="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-100">
            7.3 — Registro Fotográfico
          </h4>
          <p class="text-xs text-gray-500 mb-3">Até 4 fotografias no formato paisagem/horizontal (proporção 4x3).</p>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="(foto, index) in fotos" :key="index"
              class="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              :class="foto ? 'border-green-400 bg-green-50' : 'hover:bg-gray-50'">
              <input
                type="file"
                accept="image/*"
                @change="handleFotoUpload(index, $event)"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :title="`Fotografia ${index + 1}`"
              />
              <div class="p-4 text-center">
                <template v-if="foto">
                  <div class="text-2xl mb-1">🖼️</div>
                  <p class="text-xs text-green-700 font-medium truncate px-1">{{ foto.name }}</p>
                  <button type="button" @click.stop="removeFoto(index)"
                    class="mt-2 text-xs text-red-500 hover:text-red-700 font-semibold z-10 relative">
                    Remover
                  </button>
                </template>
                <template v-else>
                  <div class="text-2xl mb-1">📷</div>
                  <p class="text-xs text-gray-500 font-medium">Foto {{ index + 1 }}</p>
                  <p class="text-xs text-gray-400 mt-1">Toque para adicionar</p>
                </template>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ══════════════════════════════════════════════════════════════════
           Botões de Navegação
      ═════════════════════════════════════════════════════════════════════ -->
      <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
        <button v-if="currentStep > 1" type="button" @click="prevStep"
          class="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-95 transition-all duration-150 font-medium text-sm">
          ← Voltar
        </button>
        <div v-else></div>

        <button v-if="currentStep < totalSteps" type="button" @click="nextStep"
          class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-150 font-medium text-sm shadow-sm">
          Próxima Seção →
        </button>

        <button v-if="currentStep === totalSteps" type="submit"
          class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 font-bold text-sm shadow-md">
          ✓ Confirmar e Enviar
        </button>
      </div>

    </form>
  </div>
</template>
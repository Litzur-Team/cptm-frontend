<script setup>
import { ref, inject } from 'vue'

const showToast = inject('showToast')

const currentPage = ref('main') // 'main' | 'personal-info' | 'account-options'

// Dados do perfil (mock)
const profile = ref({
  name: 'Thiago Silva',
  email: 'thiago.silva@cptm.sp.gov.br',
  phone: '(11) 98765-4321',
  cpf: '***.***.***-00',
  role: 'Inspetor',
  department: 'Manutenção - Linha 8 Diamante',
  employeeId: '987654',
  admissionDate: '15/03/2023',
})

// Dados editáveis
const editName = ref(profile.value.name)
const editEmail = ref(profile.value.email)
const editPhone = ref(profile.value.phone)
const isEditingPersonal = ref(false)

// Opções de conta
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const goTo = (page) => {
  currentPage.value = page
}

const goBack = () => {
  currentPage.value = 'main'
  isEditingPersonal.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const toggleEdit = () => {
  if (isEditingPersonal.value) {
    // Salvar
    profile.value.name = editName.value
    profile.value.email = editEmail.value
    profile.value.phone = editPhone.value
    showToast('Informações atualizadas com sucesso!', 'success')
  } else {
    editName.value = profile.value.name
    editEmail.value = profile.value.email
    editPhone.value = profile.value.phone
  }
  isEditingPersonal.value = !isEditingPersonal.value
}

const changePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    showToast('Preencha todos os campos de senha.', 'warning')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    showToast('As senhas não coincidem.', 'error')
    return
  }
  if (newPassword.value.length < 4) {
    showToast('A nova senha deve ter pelo menos 4 caracteres.', 'warning')
    return
  }
  showToast('Senha alterada com sucesso!', 'success')
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <div class="space-y-5">

    <!-- ==================== TELA PRINCIPAL DO PERFIL ==================== -->
    <template v-if="currentPage === 'main'">
      
      <!-- Card do perfil -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-linear-to-r from-red-600 to-red-700 h-24 relative">
          <div class="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div class="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-2xl font-extrabold text-red-600 bg-linear-to-br from-red-50 to-red-100">
              {{ getInitials(profile.name) }}
            </div>
          </div>
        </div>
        <div class="pt-12 pb-5 px-5 text-center">
          <h2 class="text-xl font-extrabold text-gray-800">{{ profile.name }}</h2>
          <p class="text-sm text-gray-500 mt-0.5">{{ profile.role }} • ID {{ profile.employeeId }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ profile.department }}</p>
        </div>
      </div>

      <!-- Info rápida -->
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <span class="text-2xl">📧</span>
          <p class="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">E-mail</p>
          <p class="text-[11px] text-gray-700 mt-0.5 truncate">{{ profile.email }}</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <span class="text-2xl">📱</span>
          <p class="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">Telefone</p>
          <p class="text-[11px] text-gray-700 mt-0.5">{{ profile.phone }}</p>
        </div>
      </div>

      <!-- Menu de opções -->
      <div class="space-y-2">
        <button 
          @click="goTo('personal-info')"
          class="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all duration-150"
        >
          <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-gray-800 text-sm">Informações Pessoais</p>
            <p class="text-xs text-gray-400">Nome, e-mail, telefone, dados funcionais</p>
          </div>
          <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <button 
          @click="goTo('account-options')"
          class="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all duration-150"
        >
          <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div class="flex-1 text-left">
            <p class="font-bold text-gray-800 text-sm">Opções de Conta</p>
            <p class="text-xs text-gray-400">Alterar senha e segurança</p>
          </div>
          <svg class="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

    </template>

    <!-- ==================== INFORMAÇÕES PESSOAIS ==================== -->
    <template v-if="currentPage === 'personal-info'">

      <!-- Header com voltar -->
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-90 transition-all">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 class="text-xl font-extrabold text-gray-800">Informações Pessoais</h2>
          <p class="text-xs text-gray-400">Visualize e edite seus dados</p>
        </div>
      </div>

      <!-- Avatar -->
      <div class="flex justify-center">
        <div class="w-20 h-20 rounded-full bg-linear-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
          {{ getInitials(profile.name) }}
        </div>
      </div>

      <!-- Dados editáveis -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div class="p-4">
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome Completo</label>
          <input
            v-if="isEditingPersonal"
            v-model="editName"
            type="text"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
          <p v-else class="text-sm font-medium text-gray-800">{{ profile.name }}</p>
        </div>
        <div class="p-4">
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">E-mail</label>
          <input
            v-if="isEditingPersonal"
            v-model="editEmail"
            type="email"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
          <p v-else class="text-sm font-medium text-gray-800">{{ profile.email }}</p>
        </div>
        <div class="p-4">
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Telefone</label>
          <input
            v-if="isEditingPersonal"
            v-model="editPhone"
            type="tel"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
          <p v-else class="text-sm font-medium text-gray-800">{{ profile.phone }}</p>
        </div>
      </div>

      <!-- Botão Editar / Salvar -->
      <button
        @click="toggleEdit"
        :class="isEditingPersonal ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
        class="w-full text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2"
      >
        <svg v-if="!isEditingPersonal" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        {{ isEditingPersonal ? 'Salvar Alterações' : 'Editar Informações' }}
      </button>

      <!-- Dados funcionais (somente leitura) -->
      <div>
        <h3 class="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Dados Funcionais</h3>
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          <div class="p-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">CPF</span>
            <span class="text-sm font-medium text-gray-800">{{ profile.cpf }}</span>
          </div>
          <div class="p-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">Cargo</span>
            <span class="text-sm font-medium text-gray-800">{{ profile.role }}</span>
          </div>
          <div class="p-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">Departamento</span>
            <span class="text-sm font-medium text-gray-800 text-right max-w-[60%]">{{ profile.department }}</span>
          </div>
          <div class="p-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">Matrícula</span>
            <span class="text-sm font-medium text-gray-800">{{ profile.employeeId }}</span>
          </div>
          <div class="p-4 flex justify-between items-center">
            <span class="text-xs font-semibold text-gray-400 uppercase">Admissão</span>
            <span class="text-sm font-medium text-gray-800">{{ profile.admissionDate }}</span>
          </div>
        </div>
      </div>

    </template>

    <!-- ==================== OPÇÕES DE CONTA ==================== -->
    <template v-if="currentPage === 'account-options'">

      <!-- Header com voltar -->
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-90 transition-all">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h2 class="text-xl font-extrabold text-gray-800">Opções de Conta</h2>
          <p class="text-xs text-gray-400">Gerencie a segurança da sua conta</p>
        </div>
      </div>

      <!-- Alterar Senha -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-sm">Alterar Senha</h3>
            <p class="text-[11px] text-gray-400">Defina uma nova senha de acesso</p>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Senha Atual</label>
          <input
            v-model="currentPassword"
            type="password"
            placeholder="••••••••"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nova Senha</label>
          <input
            v-model="newPassword"
            type="password"
            placeholder="Mínimo 4 caracteres"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
        </div>
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirmar Nova Senha</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Repita a nova senha"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
          />
        </div>

        <button
          @click="changePassword"
          class="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-red-700 active:scale-[0.97] transition-all duration-150"
        >
          Alterar Senha
        </button>
      </div>

      <!-- Sessão ativa -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-sm">Segurança da Sessão</h3>
            <p class="text-[11px] text-gray-400">Informações sobre sua sessão atual</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-xs text-gray-500">Dispositivo</span>
            <span class="text-xs font-medium text-gray-700">Navegador Web</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-50">
            <span class="text-xs text-gray-500">Último acesso</span>
            <span class="text-xs font-medium text-gray-700">Agora</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-xs text-gray-500">Status</span>
            <span class="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              Ativa
            </span>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

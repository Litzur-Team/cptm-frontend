<script setup>
import { ref, inject } from "vue";

const emit = defineEmits(["back-to-login"]);
const showToast = inject("showToast");

const step = ref(1); // 1 = email, 2 = código, 3 = nova senha
const email = ref("");
const code = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

const sendCode = () => {
  if (!email.value.trim()) {
    showToast("Informe seu e-mail corporativo.", "warning");
    return;
  }
  isLoading.value = true;
  // Simula envio de código
  setTimeout(() => {
    isLoading.value = false;
    step.value = 2;
    showToast("Código de verificação enviado para seu e-mail.", "success");
  }, 1500);
};

const verifyCode = () => {
  if (!code.value.trim() || code.value.length < 4) {
    showToast("Informe o código de 6 dígitos.", "warning");
    return;
  }
  isLoading.value = true;
  // Simula verificação
  setTimeout(() => {
    isLoading.value = false;
    if (code.value === "123456") {
      step.value = 3;
      showToast("Código verificado com sucesso!", "success");
    } else {
      showToast("Código inválido. Tente novamente. (Dica: 123456)", "error");
    }
  }, 1000);
};

const resetPassword = () => {
  if (!newPassword.value || newPassword.value.length < 4) {
    showToast("A senha deve ter no mínimo 4 caracteres.", "warning");
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    showToast("As senhas não coincidem.", "error");
    return;
  }
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    showToast("Senha redefinida com sucesso! Faça login.", "success");
    emit("back-to-login");
  }, 1200);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh]">
    <div class="w-full bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg border-t-4 border-red-700">
      <div class="flex justify-center mb-4">
        <img
          src="/src/assets/cptm-logo.svg"
          alt="Logo CPTM"
          class="h-12 w-auto object-contain"
        />
      </div>

      <!-- Indicador de passos -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <div
          v-for="s in 3"
          :key="s"
          class="flex items-center"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            :class="s <= step ? 'bg-red-600 text-white scale-110' : 'bg-gray-200 text-gray-400'"
          >
            {{ s }}
          </div>
          <div
            v-if="s < 3"
            class="w-8 h-0.5 transition-colors duration-300"
            :class="s < step ? 'bg-red-600' : 'bg-gray-200'"
          ></div>
        </div>
      </div>

      <!-- Passo 1: Informar e-mail -->
      <Transition name="slide-fade" mode="out-in">
        <div v-if="step === 1" key="step1">
          <div class="text-center mb-5">
            <h2 class="text-xl font-bold text-gray-800">Recuperar Senha</h2>
            <p class="text-gray-500 text-sm mt-1">
              Informe seu e-mail corporativo para receber um código de verificação.
            </p>
          </div>

          <form @submit.prevent="sendCode" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="recover-email">
                E-mail
              </label>
              <input
                id="recover-email"
                v-model="email"
                type="email"
                placeholder="seu.nome@cptm.sp.gov.br"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150 disabled:opacity-60"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Enviando...
              </span>
              <span v-else>Enviar Código</span>
            </button>
          </form>
        </div>

        <!-- Passo 2: Verificar código -->
        <div v-else-if="step === 2" key="step2">
          <div class="text-center mb-5">
            <h2 class="text-xl font-bold text-gray-800">Verificar Código</h2>
            <p class="text-gray-500 text-sm mt-1">
              Digite o código de 6 dígitos enviado para <strong class="text-gray-700">{{ email }}</strong>
            </p>
          </div>

          <form @submit.prevent="verifyCode" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="verify-code">
                Código de Verificação
              </label>
              <input
                id="verify-code"
                v-model="code"
                type="text"
                maxlength="6"
                placeholder="000000"
                required
                class="w-full p-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] font-mono focus:ring-red-500 focus:border-red-500 transition outline-none"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150 disabled:opacity-60"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Verificando...
              </span>
              <span v-else>Verificar</span>
            </button>

            <button
              type="button"
              @click="sendCode"
              class="w-full text-sm text-red-600 font-medium hover:underline"
            >
              Reenviar código
            </button>
          </form>
        </div>

        <!-- Passo 3: Nova senha -->
        <div v-else-if="step === 3" key="step3">
          <div class="text-center mb-5">
            <h2 class="text-xl font-bold text-gray-800">Nova Senha</h2>
            <p class="text-gray-500 text-sm mt-1">
              Crie uma nova senha para sua conta.
            </p>
          </div>

          <form @submit.prevent="resetPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="new-pass">
                Nova Senha
              </label>
              <input
                id="new-pass"
                v-model="newPassword"
                type="password"
                placeholder="••••••"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="confirm-pass">
                Confirmar Senha
              </label>
              <input
                id="confirm-pass"
                v-model="confirmPassword"
                type="password"
                placeholder="••••••"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150 disabled:opacity-60"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Redefinindo...
              </span>
              <span v-else>Redefinir Senha</span>
            </button>
          </form>
        </div>
      </Transition>

      <!-- Voltar ao login -->
      <div class="mt-6 text-center">
        <button
          @click="emit('back-to-login')"
          class="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors duration-200"
        >
          ← Voltar ao Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { listUsuarios } from "../services/usuarios";

const emit = defineEmits(["login", "forgot-password"]);
const showToast = inject("showToast", () => {});

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  errorMessage.value = "";
  const e = email.value.trim().toLowerCase();
  if (!e || !password.value) {
    errorMessage.value = "Informe e-mail e senha.";
    return;
  }
  loading.value = true;
  try {
    const usuarios = await listUsuarios();
    const user = usuarios.find(u => (u.email || "").toLowerCase() === e);
    if (!user) {
      errorMessage.value = "Usuário não encontrado.";
      return;
    }
    if (user.status && user.status.toLowerCase() === "inativo") {
      errorMessage.value = "Usuário inativo. Contate o administrador.";
      return;
    }
    const role = user.nivelAcesso === 1 ? "admin" : "inspector";
    emit("login", { role, user });
  } catch (err) {
    errorMessage.value = "Falha ao conectar com o servidor.";
    showToast(err.message, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh]">
    <div
      class="w-full bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-lg border-t-4 border-red-700"
    >
      <div class="flex justify-center mb-4">
        <img
          src="/src/assets/cptm-logo.svg"
          alt="Logo CPTM"
          class="h-12 w-auto object-contain"
        />
      </div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Entrar</h2>
        <p class="text-gray-500 text-sm mt-1">
          Insira suas credenciais para entrar
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
            E-mail
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
            Senha
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
          />
        </div>

        <p
          v-if="errorMessage"
          class="text-red-600 text-sm text-center font-medium"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 mt-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-150 disabled:opacity-60"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <button
          type="button"
          @click="emit('forgot-password')"
          class="w-full text-sm text-gray-500 hover:text-red-600 font-medium mt-2 transition-colors duration-200"
        >
          Esqueci minha senha
        </button>
      </form>
    </div>
  </div>
</template>

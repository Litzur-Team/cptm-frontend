<script setup>
import { ref } from "vue";

const emit = defineEmits(["login"]);

const username = ref("");
const password = ref("");
const errorMessage = ref("");

const handleLogin = () => {
  errorMessage.value = ""; // Limpa erros anteriores

  const user = username.value.trim().toLowerCase();
  const pass = password.value;

  // Lógica fictícia de validação para o MVP
  if (user === "admin" && pass === "123") {
    emit("login", "admin");
  } else if (user === "inspetor" && pass === "123") {
    emit("login", "inspector");
  } else {
    errorMessage.value =
      "Usuário ou senha inválidos. (Dica: use admin/123 ou inspetor/123)";
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh]">
    <div
      class="w-full bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-700"
    >
      <div class="flex justify-center mb-4">
        <img
          src="/src/assets/cptm-logo.svg"
          alt="Logo CPTM"
          class="h-12 w-auto object-contain"
        />
      </div>
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Login</h2>
        <p class="text-gray-500 text-sm mt-1">
          Insira suas credenciais para entrar
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="username"
          >
            Usuário
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Ex: admin ou inspetor"
            required
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition outline-none"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 mb-1"
            for="password"
          >
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
          class="w-full py-3 px-4 mt-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

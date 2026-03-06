<script setup>
import { ref, inject } from "vue";

const showToast = inject("showToast");

const notifications = ref(true);
const darkMode = ref(false);
const geolocation = ref(true);

const toggleSetting = (name, value) => {
  showToast(
    `${name} ${value ? "ativado" : "desativado"}.`,
    value ? "success" : "info",
  );
};

const confirmDelete = () => {
  showToast("Funcionalidade indisponível no MVP.", "warning");
};
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md mt-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Ajustes</h2>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span class="font-medium">Notificações</span>
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="notifications"
          @change="toggleSetting('Notificações', notifications)"
        />
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span class="font-medium">Modo Escuro</span>
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="darkMode"
          @change="toggleSetting('Modo Escuro', darkMode)"
        />
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
        <span class="font-medium">Geolocalização Ativa</span>
        <input
          type="checkbox"
          class="toggle-checkbox"
          v-model="geolocation"
          @change="toggleSetting('Geolocalização', geolocation)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle-checkbox {
  appearance: none;
  width: 2.5rem;
  height: 1.25rem;
  background-color: #cbd5e1;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s;
}
.toggle-checkbox:checked {
  background-color: #b91c1c;
}
.toggle-checkbox::after {
  content: "";
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle-checkbox:checked::after {
  transform: translateX(1.25rem);
}
</style>

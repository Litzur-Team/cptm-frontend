<script setup>
import { ref, onMounted } from "vue";
import SplashScreen from "./components/SplashScreen.vue"; // Importe a Splash
import Login from "./components/Login.vue";
import InspectorPanel from "./components/InspectorPanel.vue";
import AdminPanel from "./components/AdminPanel.vue";

const showSplash = ref(true); // Estado da Splash
const currentView = ref("login");

// Lógica para esconder a Splash Screen após 3 segundos
onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;
  }, 3000);
});

// ... (Mantenha o restante das suas funções de inspectors e reports aqui)
const inspectors = ref([
  { id: 1, name: "Thiago Silva", user: "inspetor", pass: "123" },
  { id: 2, name: "Carlos Andrade", user: "carlos", pass: "123" },
]);

const reports = ref([
  {
    id: 1,
    inspector: "Thiago Silva",
    location: "Estação Osasco",
    coords: "-23.5275, -46.7753",
    issue: "Catraca inoperante",
    status: "Pendente",
    date: "03/03/2026",
  },
]);

const handleLogin = (role) => {
  currentView.value = role;
};
const handleLogout = () => {
  currentView.value = "login";
};
const addInspector = (ins) => {
  inspectors.value.push({ id: Date.now(), ...ins });
};
const updateInspector = (updatedIns) => {
  const index = inspectors.value.findIndex((i) => i.id === updatedIns.id);
  if (index !== -1) inspectors.value[index] = updatedIns;
};
const deleteInspector = (id) => {
  inspectors.value = inspectors.value.filter((i) => i.id !== id);
};
const addNewReport = (newReport) => {
  reports.value.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    ...newReport,
  });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-sans pb-10">
    <Transition name="fade">
      <SplashScreen v-if="showSplash" />
    </Transition>

    <div v-if="!showSplash">
      <header
        v-if="currentView !== 'login'"
        class="bg-red-700 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50"
      >
        <h1 class="text-xl font-bold tracking-wide">
          CPTM | {{ currentView === "admin" ? "Admin" : "Inspetor" }}
        </h1>
        <button
          @click="handleLogout"
          class="text-sm bg-red-800 px-3 py-1 rounded hover:bg-red-900 transition"
        >
          Sair
        </button>
      </header>

      <main class="w-full max-w-md mx-auto p-4 md:max-w-2xl">
        <Login v-if="currentView === 'login'" @login="handleLogin" />
        <InspectorPanel
          v-if="currentView === 'inspector'"
          @submit-report="addNewReport"
        />
        <AdminPanel
          v-if="currentView === 'admin'"
          :reports="reports"
          :inspectors="inspectors"
          @add-inspector="addInspector"
          @update-inspector="updateInspector"
          @delete-inspector="deleteInspector"
        />
      </main>
    </div>
  </div>
</template>

<style>
/* Animação de Fade Out para a Splash Screen */
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>

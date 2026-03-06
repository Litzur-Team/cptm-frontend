<script setup>
import { ref, onMounted, onUnmounted, provide } from "vue";
import SplashScreen from "./components/SplashScreen.vue";
import Login from "./components/Login.vue";
import InspectorPanel from "./components/InspectorPanel.vue";
import InspectorHome from "./components/InspectorHome.vue";
import AdminPanel from "./components/AdminPanel.vue";
import BottomNavigation from "./components/BottomNavigation.vue";
import Profile from "./components/Profile.vue";
import History from "./components/History.vue";
import Settings from "./components/Settings.vue";
import ToastNotification from "./components/ToastNotification.vue";
import ForgotPassword from "./components/ForgotPassword.vue";
import ReportDetail from "./components/ReportDetail.vue";
import InspectorDetail from "./components/InspectorDetail.vue";

const showSplash = ref(true);
const currentView = ref("login");
const currentTab = ref("home");
const detailView = ref(null); // 'report-detail' | 'inspector-detail' | null
const selectedReport = ref(null);
const selectedInspector = ref(null);

// Toast system global via provide/inject
const toast = ref({ visible: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { visible: true, message, type };
};
const closeToast = () => {
  toast.value.visible = false;
};
provide("showToast", showToast);

// Indicador de conexão com a internet
const isOnline = ref(navigator.onLine);
const handleOnline = () => {
  isOnline.value = true;
  showToast("Conexão restabelecida.", "success");
};
const handleOffline = () => {
  isOnline.value = false;
  showToast("Sem conexão com a internet.", "error");
};

onMounted(() => {
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  setTimeout(() => {
    showSplash.value = false;
  }, 3000);
});

onUnmounted(() => {
  window.removeEventListener("online", handleOnline);
  window.removeEventListener("offline", handleOffline);
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
  currentTab.value = "home";
  detailView.value = null;
  showToast(`Bem-vindo, ${role === "admin" ? "Administrador" : "Inspetor"}!`, "success");
};
const handleLogout = () => {
  currentView.value = "login";
  currentTab.value = "home";
  detailView.value = null;
  showToast("Sessão encerrada com sucesso.", "info");
};
const addInspector = (ins) => {
  inspectors.value.push({ id: Date.now(), ...ins });
  showToast("Inspetor cadastrado com sucesso!", "success");
};
const updateInspector = (updatedIns) => {
  const index = inspectors.value.findIndex((i) => i.id === updatedIns.id);
  if (index !== -1) inspectors.value[index] = updatedIns;
  showToast("Inspetor atualizado com sucesso!", "success");
};
const deleteInspector = (id) => {
  inspectors.value = inspectors.value.filter((i) => i.id !== id);
  showToast("Inspetor removido.", "warning");
};
const addNewReport = (newReport) => {
  reports.value.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    ...newReport,
  });
  showToast("Relatório enviado com sucesso!", "success");
};

// Navegação para telas de detalhe
const viewReport = (report) => {
  selectedReport.value = report;
  detailView.value = 'report-detail';
};
const viewInspector = (inspector) => {
  selectedInspector.value = inspector;
  detailView.value = 'inspector-detail';
};
const backFromDetail = () => {
  detailView.value = null;
  selectedReport.value = null;
  selectedInspector.value = null;
};
const updateReportStatus = (reportId, newStatus) => {
  const report = reports.value.find(r => r.id === reportId);
  if (report) {
    report.status = newStatus;
    selectedReport.value = { ...report };
    showToast(`Status alterado para "${newStatus}".`, "success");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 font-sans pb-10">
    <!-- Background para telas de login/recuperação -->
    <img
      v-if="currentView === 'login' || currentView === 'forgot-password'"
      src="/src/assets/bg-expresso-turistico.jpg"
      alt=""
      class="fixed inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
    />

    <!-- Toast Notification Global -->
    <ToastNotification
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="closeToast"
    />

    <Transition name="fade">
      <SplashScreen v-if="showSplash" />
    </Transition>

    <Transition name="slide-fade">
      <div v-if="!showSplash" key="app-content">
        <header
          v-if="currentView !== 'login' && currentView !== 'forgot-password'"
          class="bg-red-700 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50 transition-all duration-300"
        >
          <div class="flex items-center gap-3">
            <img src="/src/assets/cptm-logo.svg" alt="CPTM" class="h-6 w-auto brightness-0 invert" />
            <span class="text-sm font-semibold opacity-80">|</span>
            <span class="text-base font-bold tracking-wide">
              {{ currentView === "admin" ? "Admin" : "Inspetor" }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5" :title="isOnline ? 'Conectado' : 'Sem conexão'">
              <span class="relative flex h-2.5 w-2.5">
                <span
                  v-if="isOnline"
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-300"
                  :class="isOnline ? 'bg-green-400' : 'bg-red-300'"
                ></span>
              </span>
              <span class="text-[10px] font-medium opacity-80 hidden sm:inline">
                {{ isOnline ? 'Online' : 'Offline' }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="text-sm bg-red-800 px-3 py-1.5 rounded-lg hover:bg-red-900 active:scale-95 transition-all duration-150 flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sair
            </button>
          </div>
        </header>

        <main class="w-full max-w-md mx-auto p-4 md:max-w-2xl mb-20">
          <Transition name="slide-fade" mode="out-in">
            <Login v-if="currentView === 'login'" key="login" @login="handleLogin" @forgot-password="currentView = 'forgot-password'" />
            <ForgotPassword v-else-if="currentView === 'forgot-password'" key="forgot-password" @back-to-login="currentView = 'login'" />
          </Transition>
          
          <template v-if="currentView !== 'login' && currentView !== 'forgot-password'">
            <Transition name="slide-fade" mode="out-in">
              <!-- Telas de Detalhe -->
              <ReportDetail
                v-if="detailView === 'report-detail' && selectedReport"
                key="report-detail"
                :report="selectedReport"
                :userRole="currentView"
                @back="backFromDetail"
                @update-status="updateReportStatus"
              />
              <InspectorDetail
                v-else-if="detailView === 'inspector-detail' && selectedInspector"
                key="inspector-detail"
                :inspector="selectedInspector"
                :reports="reports"
                @back="backFromDetail"
                @edit="(ins) => { backFromDetail(); }"
                @delete="(id) => { deleteInspector(id); backFromDetail(); }"
              />

              <!-- Telas Normais -->
              <div v-else-if="currentTab === 'home'" key="home">
                <InspectorHome
                  v-if="currentView === 'inspector'"
                  :reports="reports"
                  @view-report="viewReport"
                  @go-new-report="currentTab = 'new-report'"
                />
                <AdminPanel
                  v-if="currentView === 'admin'"
                  :reports="reports"
                  :inspectors="inspectors"
                  @add-inspector="addInspector"
                  @update-inspector="updateInspector"
                  @delete-inspector="deleteInspector"
                  @view-report="viewReport"
                  @view-inspector="viewInspector"
                />
              </div>

              <InspectorPanel v-else-if="currentTab === 'new-report' && currentView === 'inspector'" key="new-report" @submit-report="(r) => { addNewReport(r); currentTab = 'home'; }" />
              <History v-else-if="currentTab === 'history' && currentView === 'inspector'" key="history" :reports="reports" @view-report="viewReport" />
              <Profile v-else-if="currentTab === 'profile'" key="profile" />
              <Settings v-else-if="currentTab === 'settings'" key="settings" />
            </Transition>

            <BottomNavigation 
              :currentTab="currentTab" 
              :userRole="currentView" 
              @change-tab="tab => { currentTab = tab; detailView = null; }" 
            />
          </template>
        </main>
      </div>
    </Transition>
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

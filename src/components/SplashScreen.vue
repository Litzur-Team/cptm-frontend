<script setup>
// Não precisa de lógica complexa, apenas o visual
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col items-center justify-center bg-red-700 z-100"
  >
    <div class="relative">
      <img
        src="/src/assets/cptm-logo.svg"
        alt="Logo CPTM"
        class="h-20 w-auto brightness-0 invert animate-pulse"
      />
    </div>

    <div class="mt-8 flex flex-col items-center">
      <div
        class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"
      ></div>
      <p class="text-white mt-4 font-bold tracking-widest text-sm uppercase">
        Carregando Sistema
      </p>
    </div>

    <div class="absolute bottom-10 text-white/60 text-xs font-medium">
      Governo do Estado de São Paulo
    </div>
  </div>
</template>

<style scoped>
/* Adicionando um leve efeito de pulso personalizado se quiser algo além do Tailwind */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>

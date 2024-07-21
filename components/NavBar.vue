<template>
  <nav
    class="h-[60px] bg-white dark:bg-dark flex items-center justify-between px-4 py-[10px]"
  >
    <img
      src="../assets/images/logo-dark.webp"
      v-if="isDark"
      class="w-[125px]"
    />
    <img src="../assets/images/logo-light.png" v-else class="w-[125px]" />
    <MoonSvg
      class="cursor-pointer"
      v-if="isDark"
      @click="toggleTheme"
    ></MoonSvg>
    <LightSvg class="cursor-pointer" v-else @click="toggleTheme"></LightSvg>
  </nav>
</template>

<script setup lang="ts">
const { theme, toggleTheme, isDark, isLight } = useTheme();
</script>

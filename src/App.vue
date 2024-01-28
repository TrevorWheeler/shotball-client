<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from '@/store';
import { onMounted } from 'vue';
const store = useStore();
onMounted(async () => {
  // let XWigetscript = document.createElement('script')
  // XWigetscript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
  // document.head.appendChild(XWigetscript)

  // loadScript('https://platform.twitter.com/widgets.js').then(() => {
  //   console.log("LOADED")
  // })
});


</script>

<template>
  <RouterView />
</template>

<style scoped></style>

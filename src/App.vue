<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from '@/store';
import { onMounted } from 'vue';
const store = useStore();
onMounted(async () => {

});


</script>

<template>
  <RouterView />
</template>

<style scoped></style>

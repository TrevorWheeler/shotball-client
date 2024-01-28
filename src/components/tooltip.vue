<template>
  <div ref="tooltipTarget">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const tooltipTarget = ref(null);

interface IProps {
  message: string;
}
const props = withDefaults(defineProps<IProps>(), {
  message: "",
});

onMounted(() => {
  if (tooltipTarget.value) {
    tippy(tooltipTarget.value, {
      content: props.message,
      // Add more Tippy.js configuration options here
    });
  }
});

// export { tooltipTarget };
</script>

<style></style>
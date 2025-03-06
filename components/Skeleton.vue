<template>
  <div :class="`skeleton ${animation}`" :style="style"></div>
</template>

<script setup>
import {computed} from "vue";

defineProps({
  animation: {
    type: String,
    default: "pulse",
  },
  style: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style>
.skeleton {
  background-color: #e0e0e0;
  border-radius: 5px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f7f7f7;
  }
  100% {
    background-color: #e0e0e0;
  }
}
</style>

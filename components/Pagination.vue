<template>
  <div class="flex items-center justify-center space-x-2">
    <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      <
    </button>
    <button
        v-for="page in pages"
        :key="page"
        @click="changePage(page)"
        :class="[
        'px-3 py-1 rounded',
        currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
      ]"
    >
      {{ page }}
    </button>
    <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      >
    </button>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {defineProps, defineEmits} from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['changePage']);

const pages = computed(() => {
  return Array.from({length: props.totalPages}, (_, i) => i + 1);
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('changePage', page);
  }
};
</script>

<template>
  <div class="flex items-center justify-center space-x-2">
    <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      <
    </button>
    <template v-for="(page, index) in pages" :key="index">
      <button
          v-if="page !== '...'"
          @click="changePage(page)"
          :class="[
          'px-3 py-1 rounded',
          currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
        ]"
      >
        {{ page }}
      </button>
      <span v-else class="px-3 py-1">
        ...
      </span>
    </template>
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
  if (props.totalPages <= 1) return [];
  const visiblePages = 5;
  const current = props.currentPage;
  const total = props.totalPages;

  let start = Math.max(1, current - Math.floor(visiblePages / 2));
  let end = start + visiblePages - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - visiblePages + 1);
  }

  const pagesSet = new Set();
  pagesSet.add(1);
  for (let i = start; i <= end; i++) pagesSet.add(i);
  pagesSet.add(total);

  const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);
  let processedPages = [];

  for (let i = 0; i < sortedPages.length; i++) {
    const currentPageNum = sortedPages[i];
    if (i === 0) {
      processedPages.push(currentPageNum);
    } else {
      const prevPageNum = sortedPages[i - 1];
      if (currentPageNum - prevPageNum > 1) {
        processedPages.push('...');
      }
      processedPages.push(currentPageNum);
    }
  }

  return processedPages;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('changePage', page);
  }
};
</script>
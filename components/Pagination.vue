<!--<template>-->
<!--  <div class="flex items-center justify-center space-x-2">-->
<!--    <button-->
<!--        :disabled="currentPage === 1"-->
<!--        @click="changePage(currentPage - 1)"-->
<!--        class="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 dark:text-white dark:hover:bg-gray-700"-->
<!--    >-->
<!--      <-->
<!--    </button>-->
<!--    <template v-for="(page, index) in pages" :key="index">-->
<!--      <button-->
<!--          v-if="page !== '...'"-->
<!--          @click="changePage(page)"-->
<!--          :class="[-->
<!--          'px-3 py-1 rounded',-->
<!--          currentPage === page ? 'bg-blue-500 text-white dark:bg-blue-700 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-white',-->
<!--          'dark:hover:bg-gray-700'-->
<!--        ]"-->
<!--      >-->
<!--        {{ page }}-->
<!--      </button>-->
<!--      <span v-else class="px-3 py-1 dark:text-white">-->
<!--        ...-->
<!--      </span>-->
<!--    </template>-->
<!--    <button-->
<!--        :disabled="currentPage === totalPages"-->
<!--        @click="changePage(currentPage + 1)"-->
<!--        class="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded disabled:opacity-50 dark:text-white dark:hover:bg-gray-700"-->
<!--    >-->
<!--      >-->
<!--    </button>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { computed } from 'vue';-->

<!--const props = defineProps({-->
<!--  currentPage: {-->
<!--    type: Number,-->
<!--    required: true,-->
<!--  },-->
<!--  totalPages: {-->
<!--    type: Number,-->
<!--    required: true,-->
<!--  },-->
<!--});-->

<!--const emit = defineEmits(['changePage']);-->

<!--const pages = computed(() => {-->
<!--  if (props.totalPages <= 1) return [];-->
<!--  const visiblePages = 5;-->
<!--  const current = props.currentPage;-->
<!--  const total = props.totalPages;-->

<!--  let start = Math.max(1, current - Math.floor(visiblePages / 2));-->
<!--  let end = start + visiblePages - 1;-->

<!--  if (end > total) {-->
<!--    end = total;-->
<!--    start = Math.max(1, end - visiblePages + 1);-->
<!--  }-->

<!--  const pagesSet = new Set();-->
<!--  pagesSet.add(1);-->
<!--  for (let i = start; i <= end; i++) pagesSet.add(i);-->
<!--  pagesSet.add(total);-->

<!--  const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);-->
<!--  let processedPages = [];-->

<!--  for (let i = 0; i < sortedPages.length; i++) {-->
<!--    const currentPageNum = sortedPages[i];-->
<!--    if (i === 0) {-->
<!--      processedPages.push(currentPageNum);-->
<!--    } else {-->
<!--      const prevPageNum = sortedPages[i - 1];-->
<!--      if (currentPageNum - prevPageNum > 1) {-->
<!--        processedPages.push('...');-->
<!--      }-->
<!--      processedPages.push(currentPageNum);-->
<!--    }-->
<!--  }-->
<!--  return processedPages;-->
<!--});-->

<!--const changePage = (page) => {-->
<!--  if (page >= 1 && page <= props.totalPages) {-->
<!--    emit('changePage', page);-->
<!--  }-->
<!--};-->
<!--</script>-->
<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.username }}</li>
    </ul>
    <UPagination
        v-model:page="internalPage"
        :page-count="pageCount"
        :total="total"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useFetch } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  usersPerPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const internalPage = ref(props.modelValue);

const users = ref([]);
const total = ref(0);
const pageCount = ref(1);

const fetchUsers = async () => {
  try {
    const { data } = await useFetch('/api/users', {
      params: {
        page: internalPage.value,
        limit: props.usersPerPage,
      },
    }).json();

    if (data.value) {
      users.value = data.value.users;
      total.value = data.value.total;
      pageCount.value = Math.ceil(total.value / props.usersPerPage);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
    total.value = 0;
    pageCount.value = 1;
  }
};

watch(
    () => props.modelValue,
    (newValue) => {
      internalPage.value = newValue;
    }
);

watch(
    internalPage,
    async (newValue) => {
      if (newValue > 0 && newValue <= pageCount.value) {
        emit('update:modelValue', newValue);
        await fetchUsers();
      }
    },
    { immediate: true }
);
</script>
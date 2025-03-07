<template>
  <div class="flex flex-col items-center mb-[20px]">
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-gray-200 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300 dark:bg-[#0e1926] dark:border-gray-700">
      <div v-for="column in columns" :key="column.key" class="text-gray-700 font-semibold text-center dark:text-white">
        {{ column.label }}
      </div>
      <div v-for="row in rows" :key="row.id" class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] py-2 px-4 border-b border-gray-300 dark:border-gray-700">
        <div v-for="column in columns" :key="column.key" class="text-gray-700 text-center dark:text-white">
          {{ row[column.key] }}
        </div>
        <div class="flex gap-4 justify-center">
          <NuxtLink :to="`/${modelName}/${row.id}/edit`">
            <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 dark:invert"/>
          </NuxtLink>
          <img
              src="/images/delete.svg"
              alt="Delete"
              class="cursor-pointer w-7 h-7 dark:invert"
              @click="handleDelete(row)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Используем prop для динамической передачи данных и моделей
defineProps({
  rows: {
    type: Array,
    required: true,
    default: () => [],
  },
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelName: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['delete']);

// Функция для обработки удаления
const handleDelete = (row) => {
  emit('delete', row);
};
</script>

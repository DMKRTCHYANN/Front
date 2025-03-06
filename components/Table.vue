<script setup>
import {defineProps} from "vue";

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
});
</script>

<template>
  <div class="flex flex-col items-center mb-[20px]">
    <div
        class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] bg-gray-200 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300 dark:bg-[#0e1926] dark:border-gray-700">
      <div v-for="column in columns" :key="column.key" class="text-gray-700 font-semibold text-center dark:text-white">
        {{ column.label }}
      </div>
      <div class="text-gray-700 font-semibold text-center dark:text-white">Actions</div>
    </div>
    <div
        v-for="row in rows"
        :key="row.id"
        class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center bg-white w-full max-w-[1500px] py-2 px-4 border-b border-gray-200 dark:bg-[#1c2a36] dark:border-gray-600"
    >
      <div v-for="column in columns" :key="column.key" class="text-center dark:text-gray-300">
        <template v-if="column.key === 'image'">
          <img
              v-if="row.image"
              :src="`http://localhost:8000/storage/${row.image}`"
              alt="User Image"
              class="w-10 h-10 rounded-full object-cover"
          />
        </template>
        <template v-else>
          {{ column.key.includes('.') ? column.key.split('.').reduce((o, i) => o?.[i], row) : row[column.key] }}
        </template>
      </div>
      <div class="flex justify-center gap-4">
        <NuxtLink :to="`/users/${row.id}/edit`">
          <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 dark:invert"/>
        </NuxtLink>
        <img
            src="/images/delete.svg"
            alt="Delete"
            class="cursor-pointer w-7 h-7 dark:invert"
            @click="$emit('delete', row)"
        />
      </div>
    </div>
  </div>
</template>

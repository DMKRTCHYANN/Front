<template>
  <div class="flex flex-col items-center mb-[20px]">
    <div class="grid grid-cols-6 bg-gray-100 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300">
      <h1 class="text-gray-700 font-semibold text-center"></h1>
      <h1 class="text-gray-700 font-semibold text-center">ID</h1>
      <h1 class="text-gray-700 font-semibold text-center">Username</h1>
      <h1 class="text-gray-700 font-semibold text-center">Country</h1>
      <h1 class="text-gray-700 font-semibold text-center">Created At</h1>
    </div>
    <div
        v-for="user in users"
        :key="user.id"
        class="grid grid-cols-6 items-center bg-white w-full max-w-[1500px] py-2 px-4 border-b border-gray-200"
    >
      <div class="flex justify-center">
        <img
            v-if="user.image"
            :src="`http://localhost:8000/storage/${user.image}`"
            alt="User Image"
            class="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <p class="text-center">{{ user.id }}</p>
      <p class="text-center">{{ user.username }}</p>
      <p class="text-center">{{ user.country ? user.country.name : user.countryName }}</p>
      <p class="text-center">{{ user.created_at }}</p>
      <div class="flex justify-center gap-[10px]">
        <NuxtLink :to="`/users/${user.id}/edit`">
          <img
              class="cursor-pointer w-7 h-7"
              @click="editUser(user)"
              src="/images/edit.svg"
              alt="Edit"
          >
        </NuxtLink>
        <img
            @click="deleteUser(user)"
            class="cursor-pointer w-7 h-7"
            src="/images/delete.svg"
            alt="Delete"
        >
      </div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['edit', 'delete']);

defineProps({
  users: {
    type: Object,
    required: true,
    default: () => ({data: [], total: 0}),
  },
  total: Number,
  currentPage: Number,
  limit: Number,
});

const editUser = (user) => {
  emit('edit', user);
};

const deleteUser = (user) => {
  emit('delete', user);
};
</script>

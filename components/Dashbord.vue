<template>
  <div class="flex flex-col items-center mb-[20px]">
    <div class="flex justify-around bg-gray-100 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300">
      <h1 class="text-gray-700 font-semibold w-1/4 text-center">ID</h1>
      <h1 class="text-gray-700 font-semibold w-1/4 text-center">Username</h1>
      <h1 class="text-gray-700 font-semibold w-1/4 text-center">Password</h1>
      <h1 class="text-gray-700 font-semibold w-1/4 text-center">Country</h1>
      <h1 class="text-gray-700 font-semibold w-1/4 text-center">Created At</h1>
      <h1 class="text-gray-700 font-semibold w-1/4 text-center"></h1>
    </div>
    <div v-for="user in users" :key="user.id" class="bg-white flex flex-col max-w-[1500px] w-full shadow-md">
      <div v-if="user && user.id" class="flex justify-around items-center py-2 px-4 border-b border-gray-200">
        <p class="w-1/4 text-center">{{ user.id }}</p>
        <p class="w-1/4 text-center">{{ user.username }}</p>
        <p class="w-1/4 text-center">{{ user.password }}</p>
        <p class="w-1/4 text-center">{{ user.country ? user.country.name : '' }}</p>
        <p class="w-1/4 text-center">{{ user.createdAt }}</p>
        <div class="w-1/4 flex justify-center gap-2">
          <NuxtLink :to="`/users/${user.id}/edit`">
            <button
                class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-all duration-300"
                @click="editUser(user)">
              Update
            </button>
          </NuxtLink>
          <button
              @click="deleteUser(user)"
              class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-all duration-300">
            Delete
          </button>
        </div>
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
    default: () => ({ data: [], total: 0 })
  },
  total: Number,
  currentPage: Number,
  limit: Number
});

const editUser = (user) => {
  emit('edit', user);
};

const deleteUser = (user) => {
  emit('delete', user);
};
</script>

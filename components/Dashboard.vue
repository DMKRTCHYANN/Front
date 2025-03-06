<template>
  <div class="flex flex-col items-center mb-[20px] dark:bg-[#1c2a36]">
    <div class="grid grid-cols-6 bg-gray-200 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300 dark:bg-[#0e1926] dark:border-gray-700">
      <h1 class="text-gray-700 font-semibold text-center"></h1>
      <h1 class="text-gray-700 font-semibold text-center dark:text-white">ID</h1>
      <h1 class="text-gray-700 font-semibold text-center dark:text-white">Username</h1>
      <h1 class="text-gray-700 font-semibold text-center dark:text-white">Country</h1>
      <h1 class="text-gray-700 font-semibold text-center dark:text-white">Created At</h1>
    </div>
    <div
        v-for="user in users"
        :key="user.id"
        class="grid grid-cols-6 items-center bg-white w-full max-w-[1500px] py-2 px-4 border-b border-gray-200 dark:bg-[#1c2a36] dark:border-gray-600"
    >
      <div class="flex justify-center">
        <img
            v-if="user.image"
            :src="`http://localhost:8000/storage/${user.image}`"
            alt="User Image"
            class="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <p class="text-center dark:text-gray-300">{{ user.id }}</p>
      <p class="text-center dark:text-gray-300">{{ user.username }}</p>
      <p class="text-center dark:text-gray-300">{{ user.country ? user.country.name : user.countryName }}</p>
      <p class="text-center dark:text-gray-300">{{ user.created_at }}</p>
      <div class="flex justify-center gap-[10px]">
        <NuxtLink :to="`/users/${user.id}/edit`">
          <img
              class="cursor-pointer w-7 h-7 dark:invert"
              @click="editUser(user)"
              src="/images/edit.svg"
              alt="Edit"
          >
        </NuxtLink>
        <img
            src="/images/delete.svg"
            alt="Delete"
            class="w-7 h-7 cursor-pointer dark:invert"
            @click="openDeleteModal(user)"
        />
      </div>
    </div>
    <UModal v-model="isOpen">
      <div class="p-4 text-center">
        <p>Are you sure you want to delete {{ userToDelete?.username }}?</p>
        <div class="flex justify-center gap-4 mt-4">
          <button class="bg-gray-500 px-4 py-2 text-white rounded" @click="cancelDelete">Cancel</button>
          <button class="bg-red-500 px-4 py-2 text-white rounded" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
const emit = defineEmits(['edit', 'delete']);

defineProps({
  users: {
    type: Object,
    required: true,
    default: () => ({ data: [], total: 0 }),
  },
  total: Number,
  currentPage: Number,
  limit: Number,
});

const editUser = (user) => {
  emit('edit', user);
};

const isOpen = ref(false);
const userToDelete = ref(null);

const openDeleteModal = (user) => {
  userToDelete.value = user;
  isOpen.value = true;
};

const cancelDelete = () => {
  isOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = () => {
  emit('delete', userToDelete.value);
  isOpen.value = false;
  userToDelete.value = null;
};
</script>

<template>
  <div class="dark:bg-gray-900 min-h-screen">
    <div class="flex w-full h-screen">
      <div class="flex-grow  p-[30px] dark:bg-gray-900">
        <div class="flex justify-end mb-[20px] z-0">
          <nuxt-link :to="`countries/countriesCreate`">
            <button
                class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-all duration-300">
              Create new Country
            </button>
          </nuxt-link>
        </div>
        <div class="flex flex-col items-center mb-[20px]">
          <div
              class="flex justify-around bg-gray-100 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300 dark:bg-[#1c2a36] dark:border-gray-700">
            <h1 class="text-gray-700 font-semibold w-1/4 text-center dark:text-white">ID</h1>
            <h1 class="text-gray-700 font-semibold w-1/4 text-center dark:text-white">Name</h1>
            <h1 class="text-gray-700 font-semibold w-1/4 text-center dark:text-white"></h1>
            <h1 class="text-gray-700 font-semibold w-1/4 text-center dark:text-white"></h1>
          </div>
          <div v-for="country in countries" :key="country.id"
               class="bg-white flex flex-col max-w-[1500px] w-full shadow-md dark:bg-gray-800">
            <div v-if="country && country.id"
                 class="flex justify-around items-center py-2 px-4 border-b border-gray-200 dark:border-gray-700">
              <p class="w-1/4 text-center dark:text-gray-300">{{ country.id }}</p>
              <p class="w-1/4 text-center dark:text-gray-300">{{ country.name }}</p>
              <p class="w-1/4 text-center"></p>
              <div class="w-1/4 flex justify-center gap-2">
                <NuxtLink :to="`/countries/${country.id}/edit`">
                  <img
                      class="cursor-pointer w-7 h-7 dark:invert"
                      src="/images/edit.svg"
                      alt="Edit"
                  >
                </NuxtLink>
                <img
                    @click="openDeleteModal(country)"
                    class="cursor-pointer w-7 h-7 dark:invert"
                    src="/images/delete.svg"
                    alt="Delete"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UModal v-model="isOpen">
    <div class="p-4 text-center">
      <p>Are you sure you want to delete {{ userToDelete?.name }}?</p>
      <div class="flex justify-center gap-4 mt-4">
        <button
            class="bg-gray-500 px-4 py-2 text-white rounded"
            @click="cancelDelete"
        >
          Cancel
        </button>
        <button
            class="bg-red-500 px-4 py-2 text-white rounded"
            @click="confirmDelete"
        >
          Delete
        </button>
      </div>
    </div>
  </UModal>
</template>
<script setup>
definePageMeta({
  layout: 'navbar'
})

const countries = ref([]);
const isOpen = ref(false);
const userToDelete = ref(null);

const openDeleteModal = (country) => {
  userToDelete.value = country;
  isOpen.value = true;
};

const getCountries = async () => {
  const {data, error} = await useFetch(`/api/countries`);
  if (data.value) countries.value = data.value;
};

const cancelDelete = () => {
  isOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  if (userToDelete.value) {
    await deleteCountryApi(userToDelete.value);
    await getCountries();
  }
  isOpen.value = false;
  userToDelete.value = null;
};

const deleteCountryApi = async (country) => {
  await useFetch(`/api/countries/${country.id}`, {
    method: 'DELETE',
    headers: {Accept: "application/json"},
  });
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

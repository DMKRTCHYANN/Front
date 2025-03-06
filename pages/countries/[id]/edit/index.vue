<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8 dark:text-white">
        Edit Country
      </h1>
      <div v-if="loading" class="text-center text-gray-500 dark:text-white">Loading...</div>
      <div v-else>
        <div class="mb-6">
          <label for="country-name" class="block text-sm font-medium text-gray-700 mb-2">
            <span class="dark:text-white"> Country Name </span> <span class="text-red-500">*</span>
          </label>
          <input
              id="country-name"
              type="text"
              v-model="country.name"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>
        <div class="flex justify-center">
          <button
              @click="updateCountry"
              class="bg-gray-200 p-3 flex justify-center w-full max-w-[250px] text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm  dark:bg-gray-800 dark:text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const country = ref({ name: '' });
const loading = ref(true);

const getCountryById = async () => {
  try {
    const { data, error } = await useFetch(`/api/countries/${route.params.id}`, {
      headers: { Accept: 'application/json' },
    });

    if (data.value) {
      country.value = {
        name: data.value.country.name || '',
      };
    } else if (error.value) {
      console.error('Error fetching country:', error.value);
    }
  } catch (err) {
    console.error('Error fetching country:', err);
  }
};

const updateCountry = async () => {
  try {
    const { data, error } = await useFetch(`/api/countries/${route.params.id}`, {
      method: 'PUT',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: country.value.name,
      }),
    });
    toast.add({
      title: 'Country updated!',
      description: 'Country has been successfully updated',
      color: 'green',
      timeout: 3000,
    });
    if (data.value) {
      await router.push('/countries');
    } else if (error.value) {
      console.error('Error updating country:', error.value);
    }
  } catch (err) {
    toast.add({
      title: 'Error!',
      description: 'Failed to update country',
      color: 'red',
      timeout: 3000,
    });
    console.error('Error updating country:', err);
  }
};

onMounted(async () => {
  await nextTick();
  await getCountryById();
  loading.value = false;
});
</script>

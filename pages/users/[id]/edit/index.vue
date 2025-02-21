<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        Edit User
      </h1>
      <div v-if="loading" class="text-center text-gray-500">
        Loading...
      </div>
      <div v-else>
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username <span class="text-red-500">*</span>
          </label>
          <input
              id="username"
              type="text"
              v-model="user.username"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>
        <div class="mb-8">
          <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
            Country <span class="text-red-500">*</span>
          </label>
          <select
              id="countries"
              v-model="user.country_id"
              name="country"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-center">
          <button
              @click="updateUser"
              class="bg-gray-800 p-3 w-full max-w-[250px] text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 transition-all duration-300 shadow-md"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const countries = ref([]);
const user = ref({
  username: '',
  country_id: ''
});
const loading = ref(true);

const getUserById = async () => {
  try {
    const data = await $fetch(`/api/users/${route.params.id}`);
    user.value = {
      username: data.user.username || '',
      country_id: data.user?.country_id
    };
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const getCountries = async () => {
  try {
    countries.value = await $fetch('/api/countries');
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

const updateUser = async () => {
  try {
    const payload = {
      username: user.value.username,
      country_id: user.value.country_id
    };
    await $fetch(`/api/users/${route.params.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    await router.push('/');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

onMounted(async () => {
  try {
    await getCountries();
    await getUserById();
  } finally {
    loading.value = false;
  }
});
</script>

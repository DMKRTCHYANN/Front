<template>
  <div class="flex w-full h-screen">
    <div class="w-[15%] bg-[#FFFFFF] p-[30px]">
      <button @click="loadUsers" class="mb-[40px] flex justify-center max-w-[200px] w-full border border-black">
        User
      </button>
      <div>
        <nuxt-link to="/countries">
          <button class="flex justify-center max-w-[200px] w-full border border-black">
            Country
          </button>
        </nuxt-link>
      </div>
    </div>
    <div class="w-[85%] bg-[#f8f8f8] h-full p-[30px]">
      <div class="flex justify-between mb-[20px] z-0">
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">
            Country <span class="text-red-500">*</span>
          </label>
          <select
              id="country"
              name="country"
              v-model="selectedCountryId"
              @change="fetchUsersByCountry"
              class="mt-1 block mb-[40px] h-[50px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option disabled value="">Select a country</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </div>
        <nuxt-link :to="`/create`">
          <button
              class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300">
            Create new User
          </button>
        </nuxt-link>
      </div>
      <Dashbord
          @delete="deleteUser"
          :users="users.data"
          :total="users.total"
          :currentPage="page"
          :limit="limit"
          @page-change="changePage"
      />
      <div class="flex justify-center gap-4 mt-4">
        <Pagination
            :currentPage="page"
            :totalPages="Math.ceil(users.total / limit)"
            @changePage="changePage"
        />
      </div>
    </div>
  </div>
  <div v-if="deleteConfirmVisible" class="fixed inset-0 flex justify-center items-center bg-black/10"
       @click="closeModal">
    <div class="bg-[#212121] w-[500px] p-4 rounded-lg shadow-lg flex flex-col" @click.stop>
      <h1 class="text-lg text-white text-center w-full mb-4">
        Are you sure you want to delete {{ checkedUser.username }}?
      </h1>
      <div class="flex justify-between">
        <button @click="closeModal"
                class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300">
          Cancel
        </button>
        <button @click="deleteUserApi(checkedUser)"
                class="bg-red-500 text-white w-[200px] py-1 px-3 rounded-lg hover:bg-red-600 transition-all duration-300">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, nextTick} from 'vue';
import Pagination from '@/components/Pagination.vue';

const users = ref({data: [], total: 0});
const page = ref(1);
const limit = ref(5);
const countries = ref([]);
const selectedCountryId = ref('');
const checkedUser = ref({});
const deleteConfirmVisible = ref(false);

const closeModal = () => {
  deleteConfirmVisible.value = false;
};

const getCountries = async () => {
  try {
    const data = await $fetch('/api/api/countries/');
    if (Array.isArray(data)) {
      countries.value = data;
    } else {
      console.error('Unexpected API response:', data);
      countries.value = [];
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
    countries.value = [];
  }
};

const getUsers = async () => {
  try {
    const response = await $fetch('/api/api/users/', {
      params: {page: page.value, limit: limit.value},
    });
    users.value = response || {data: [], total: 0};
  } catch (error) {
    console.error('Fetch Error:', error);
    users.value = {data: [], total: 0};
  }
};

const getCountryName = (id) => {
  const country = countries.value.find((c) => c.id === id);
  return country ? country.name : 'Unknown';
};

const fetchUsersByCountry = async () => {
  try {
    console.log('Selected Country ID:', selectedCountryId.value); // Debug log
    const response = await $fetch('/api/api/users/', {
      params: {
        country: selectedCountryId.value,
        page: page.value,
        limit: limit.value,
      },
    });
    console.log('Response for selected country:', response);
    users.value = response || { data: [], total: 0 };

    users.value.data = users.value.data.map((user) => ({
      ...user,
      countryName: getCountryName(selectedCountryId.value),
    }));
  } catch (error) {
    console.error('Error fetching users by country:', error);
    users.value = { data: [], total: 0 };
  }
};


const deleteUser = (user) => {
  checkedUser.value = {...user};
  deleteConfirmVisible.value = true;
};

const deleteUserApi = async (user) => {
  try {
    await $fetch(`/api/api/users/${user.id}`, {
      method: 'DELETE',
    });
    deleteConfirmVisible.value = false;
    await getUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= Math.ceil(users.value.total / limit.value)) {
    page.value = newPage;
    fetchUsersByCountry();
  }
};

const loadUsers = async () => {
  await getUsers();
};

onMounted(async () => {
  await nextTick();
  await getUsers();
  await getCountries();
});
</script>

<template>
  <div class="flex w-full h-screen">
    <div class="flex-grow bg-[#f8f8f8] ">
      <div class="flex justify-between mb-[20px] z-0">
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">
            Country <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-[20px]">
            <select
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
            <img
                v-if="selectedCountryId"
                src="/images/close.png"
                alt="Close icon"
                class="cursor-pointer w-6 h-6 mt-[15px] transition-all duration-300 hover:opacity-80"
                @click="loadUsers"
            />
          </div>
        </div>
      </div>
      <Dashboard
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
definePageMeta({
  layout: 'navbar'
})



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
    const data = await $fetch('/api/countries');
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
    const response = await $fetch('/api/users', {
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
    console.log('Selected Country ID:', selectedCountryId.value);
    const response = await $fetch('/api/users', {
      params: {
        country_id: selectedCountryId.value,
        page: page.value,
        limit: limit.value,
      },
    });
    console.log('Response for selected country:', response);
    users.value = response || {data: [], total: 0};

    users.value.data = users.value.data.map((user) => ({
      ...user,
      countryName: getCountryName(selectedCountryId.value),
    }));
  } catch (error) {
    console.error('Error fetching users by country:', error);
    users.value = {data: [], total: 0};
  }
};

const deleteUser = (user) => {
  checkedUser.value = {...user};
  deleteConfirmVisible.value = true;
};

const deleteUserApi = async (user) => {
  try {
    await $fetch(`/api/users/${user.id}`, {
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
  selectedCountryId.value = ''
  await getUsers();
};

onMounted(async () => {
    await nextTick();
    await getUsers();
    await getCountries();
});
</script>

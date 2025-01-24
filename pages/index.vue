<template>
  <div class="flex w-full h-screen">
    <div class="w-[15%] bg-[#FFFFFF] p-[30px]">
      <button
          @click="loadUsers"
          class="mb-[40px] flex justify-center max-w-[200px] w-full border border-black">
        User
      </button>
      <div>
        <nuxt-link to="/countries">
          <button
              class="flex justify-center max-w-[200px] w-full border border-black">
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
          <button class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300">
            Create new User
          </button>
        </nuxt-link>
      </div>
      <Dashbord
          @delete1="deleteUser"
          :users="users"
      />
    </div>
  </div>
  <div v-if="deleteConfirmVisible"
       class="fixed inset-0 flex justify-center items-center bg-black/10"
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
import { ref, onMounted, nextTick } from 'vue';

const users = ref([]);
const menuVisible = ref(false);
const updateVisible = ref(false);
const deleteConfirmVisible = ref(false);
const countries = ref([]);
const selectedCountryId = ref(""); // Хранит ID выбранной страны
const checkedUser = ref({});

const closeModal = () => {
  menuVisible.value = false;
  updateVisible.value = false;
  deleteConfirmVisible.value = false;
};

const getCountries = async () => {
  const { data, error } = await useFetch(`/api/countries/`);
  if (error) {
    console.error('Fetch Error:', error);
  }
  if (data) {
    countries.value = data.value;
  }
};

const getUsers = async () => {
  const { data, error } = await useFetch(`/api/users/`);
  if (error) {
    console.error('Fetch Error:', error);
  }
  if (data) {
    users.value = data.value;
  }
};

const fetchUsersByCountry = async () => {
  if (!selectedCountryId.value) return;
  const { data, error } = await useFetch(`/api/users?countryId=${selectedCountryId.value}`);
  if (error) {
    console.error('Fetch Error:', error);
  }
  if (data) {
    users.value = data.value;
  }
};

const deleteUser = (user) => {
  checkedUser.value = { ...user };
  deleteConfirmVisible.value = true;
};

const deleteUserApi = async (user) => {
  const { error } = await useFetch(`/api/users/${user.id}`, {
    method: 'DELETE',
  });

  if (error) {
    console.error('Fetch Error:', error);
  }

  deleteConfirmVisible.value = false;
  await getUsers();
};

onMounted(async () => {
  await nextTick();
  await getUsers();
  await getCountries();
});
</script>

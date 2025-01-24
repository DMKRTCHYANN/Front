<template>
  <div class="flex w-full h-full">
    <div class="w-[15%] bg-[#FFFFFF] p-[30px]">
      <nuxt-link to="/">
        <button
            class="mb-[40px] flex justify-center max-w-[200px] w-full border border-black">
          User
        </button>
      </nuxt-link>
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
      <div class="flex justify-end mb-[20px] z-0">
        <nuxt-link :to="`countries/countriesCreate`">
          <button
              class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300">
            Create new Country
          </button>
        </nuxt-link>
      </div>
      <div class="flex flex-col items-center mb-[20px]">
        <div class="flex justify-around bg-gray-100 w-full max-w-[1500px] py-2 px-4 border-b border-gray-300">
          <h1 class="text-gray-700 font-semibold w-1/4 text-center">ID</h1>
          <h1 class="text-gray-700 font-semibold w-1/4 text-center">Name</h1>
          <h1 class="text-gray-700 font-semibold w-1/4 text-center"></h1>
          <h1 class="text-gray-700 font-semibold w-1/4 text-center"></h1>
        </div>
        <div v-for="country in countries" :key="country.id"
             class="bg-white flex flex-col max-w-[1500px] w-full shadow-md">
          <div v-if="country && country.id" class="flex justify-around items-center py-2 px-4 border-b border-gray-200">
            <p class="w-1/4 text-center">{{ country.id }}</p>
            <p class="w-1/4 text-center">{{ country.name }}</p>
            <p class="w-1/4 text-center"></p>
            <div class="w-1/4 flex justify-center gap-2">
              <NuxtLink :to="`/countries/${country.id}/edit`">
                <button
                    class="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition-all duration-300">
                  Update
                </button>
              </NuxtLink>
              <button @click="deleteCountry(country)"
                      class="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-all duration-300">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="deleteConfirmVisible"
       class="fixed inset-0 flex justify-center items-center bg-black/10"
       @click="closeModal">
    <div class="bg-[#212121] w-[500px] p-4 rounded-lg shadow-lg flex flex-col"
         @click.stop>
      <h1 class="text-lg text-white text-center w-full mb-4">
        Are you sure you want to delete {{ checkedCountry.name }}?
      </h1>
      <div class="flex justify-between">
        <button @click="closeModal"
                class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300">
          Cancel
        </button>
        <button @click="deleteCountryApi(checkedCountry)"
                class="bg-red-500 text-white w-[200px] py-1 px-3 rounded-lg hover:bg-red-600 transition-all duration-300">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, nextTick} from 'vue';

const countries = ref([]);
const checkedCountry = ref({});
const deleteConfirmVisible = ref(false);

const closeModal = () => {
  deleteConfirmVisible.value = false;
};

const getCountries = async () => {
  const {data, error} = await useFetch(`/api/countries`);
  if (error) {
    console.error(error);
  }
  if (data) {
    countries.value = data.value;
  }
};

const deleteCountry = (country) => {
  checkedCountry.value = {...country};
  deleteConfirmVisible.value = true;
};

const deleteCountryApi = async (country) => {
  const {data, error} = await useFetch(`/api/countries/${country.id}`, {
    method: 'DELETE',
    headers: {Accept: "application/json"},
  });
  if (error) {
    console.error(error);
  }
  deleteConfirmVisible.value = false;
  await getCountries();
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

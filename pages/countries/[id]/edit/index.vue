<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <div class="max-w-[900px] w-full bg-gray-200 p-[10px] rounded-[30px]">
      <h1 class="text-xl text-center p-[30px]">
        Edit Country
      </h1>
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else>

        <input
            type="text"
            v-model="country.name"
            class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
        />
        <div class="flex justify-center items-center">
          <button
              @click="updateCountry"
              class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300"
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
    if (data.value) {
      await router.push('/countries');
    } else if (error.value) {
      console.error('Error updating country:', error.value);
    }
  } catch (err) {
    console.error('Error updating country:', err);
  }
};

onMounted(async () => {
  await nextTick();
  await getCountryById();
  loading.value = false;
});
</script>

<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <div class="max-w-[900px] w-full bg-gray-200 p-[10px] rounded-[30px]">
      <h1 class=" text-xl text-center p-[30px]">
        Edit Country
      </h1>
      <input
          type="text"
          v-model="country.name"
          class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <div class="flex justify-center items-center">
        <input
            type="submit"
            @click="updateCountry"
            class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const route = useRoute();
const router = useRouter();
const countries = ref([]);
const country = ref({name: ''});

const updateCountry = async () => {
  const {data, error} = await useFetch(`/api/api/countries/${route.params.id}`, {
    method: 'PUT',
    headers: {Accept: 'application/json'},
    body: JSON.stringify({
      name: country.value.name,
    })
  });
  if (data) {
    await router.push('/countries');
  }
};

const getCountryById = async () => {
  const {data, error} = await useFetch(`/api/api/countries/${route.params.id}`, {
    headers: {Accept: 'application/json'},
  });
  if (data.value) {
    country.value = data.value;
  }
}

onMounted(async () => {
  await nextTick();
  await getCountryById();
});
</script>

<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <div class="max-w-[900px] w-full bg-gray-200 p-[10px] rounded-[30px]">
      <h1 class=" text-xl text-center p-[30px]">
        Edit User
      </h1>
      <input
          type="text"
          v-model="user.username"
          class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <input
          type="text"
          v-model="user.password"
          class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <div class="mb-4">
        <label
            for="country" class="block text-sm font-medium text-gray-700">
          Country <span class="text-red-500">*</span>
        </label>
        <select
            id="countries"
            v-model="user.country"
            name="country"
            class="mt-1 block mb-[40px] h-[50px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option v-for="country in countries" :key="country.id" :value="country.name">
            {{ country.name }}
          </option>
        </select>
      </div>
      <div class="flex justify-center items-center">
        <input
            type="submit"
            @click="updateUser"
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
const user = ref({username: '', password: '', country: ''});

const getUserById = async () => {
  const {data, error} = await useFetch(`/api/users/${route.params.id}`, {
    headers: {Accept: 'application/json'},
  });
  if (data.value) {
    const fetchedUser = data.value;
    user.value = {
      ...fetchedUser,
      country: fetchedUser.country?.name || '',
    };
  }
};

const updateUser = async () => {
  const selectedCountry = countries.value.find(
      (country) => country.name === user.value.country
  );
  const {data, error} = await useFetch(`/api/users/${route.params.id}`, {
    method: 'PUT',
    headers: {Accept: 'application/json'},
    body: JSON.stringify({
      username: user.value.username,
      password: user.value.password,
      country: selectedCountry ? selectedCountry.id : null,
    }),
  });
  if (data) {
    await router.push('/');
  }
};

const getCountries = async () => {
  const {data, error} = await useFetch(`/api/countries/`, {
    headers: {Accept: "application/json"},
  });
  if (data) {
    countries.value = data.value;
  }
};

onMounted(async () => {
  await nextTick();
  await getUserById();
  await getCountries();
});
</script>

<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <div class="max-w-[900px] w-full bg-gray-800 p-[10px] rounded-[30px]">
      <h1 class="text-xl text-center p-[30px]">Create User</h1>
      <input
          v-model="user.username"
          type="text"
          placeholder="Enter username"
          class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <p v-if="errors" class="text-red-900">{{ errors[0] }}</p>
      <input
          v-model="user.password"
          type="password"
          placeholder="Enter password"
          class="text-black mb-[40px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <p v-if="errors" class="text-red-900">{{ errors[1] }}</p>
      <div class="mb-4">
        <label for="country" class="block text-sm font-medium text-gray-700">
          Country <span class="text-red-500">*</span>
        </label>
        <select
            v-model="user.country"
            name="country"
            class="mt-1 block mb-[40px] h-[50px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option v-for="country in countries" :key="country" :value="country.name">
            {{ country.name }}
          </option>
        </select>
      </div>
      <p v-if="errors" class="text-red-900">{{ errors[2] }}</p>
      <div class="flex justify-center items-center">
        <button
            @click="createUser"
            class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
const router = useRouter();
const route = useRoute();
const errors = ref([])
const countries = ref([]);
const user = ref({
  username: '',
  password: '',
  country: '',
});

const getCountries = async () => {
  const {data, error} = await useFetch(`/api/countries/`, {
    headers: {Accept: "application/json"},
  });
  if (data) {
    countries.value = data.value;
  }
};

const createUser = async () => {
  try {
    const {data, error} = await useFetch(`/api/users/`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        username: user.value.username,
        password: user.value.password,
        country: user.value.country,
      },
    });
    if (error && error.value) {
      if (error.value.data) {
        errors.value = error.value.data.message;
      } else {
        errors.value = 'Unknown error';
      }
      return;
    }
    if (data) {
      await router.push('/');
    } else {
      errors.value = 'Failed to create user, server response is empty';
    }
  } catch (err) {
    console.error("An error occurred:", err);
    errors.value = 'There was an error sending your request';
  }
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

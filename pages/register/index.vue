<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6">Get Started Now</h1>
      <div class="space-y-4">
        <div>
          <p>Username</p>
          <input
              v-model="user.username"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              placeholder="Enter your Username"
          />
        </div>
        <div class="mb-8">
          <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
            Country <span class="text-red-500">*</span>
          </label>
          <select
              v-model="user.country"
              name="country"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </div>
        <div>
          <p>Password</p>
          <input
              v-model="user.password"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Enter your password"
          />
        </div>
        <div>
          <p>Password</p>
          <input
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              placeholder="Confirm password"
          />
        </div>
        <div>
          <div class="flex justify-center">
            <button
                @click="createUser"
                class="bg-gray-800 p-3 flex justify-center w-full max-w-[250px] text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 transition-all duration-300 shadow-md"
            >
              Update
            </button>
          </div>
        </div>
        <div class="text-center">
          <p>
            Have an account?
            <nuxt-link to="/login" class="text-blue-500 hover:underline">
              Sign in
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {onMounted} from "vue";

const router = useRouter();
const errors = ref([])
const countries = ref('')
const user = ref({
  username: '',
  password: '',
  country: '',
});

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
      await router.push('/login');
    } else {
      errors.value = 'Failed to create user, server response is empty';
    }
  } catch (err) {
    console.error("An error occurred:", err);
    errors.value = 'There was an error sending your request';
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
  await getCountries();
});
</script>
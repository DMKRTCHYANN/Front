<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200  dark:bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
      <h1 class="text-3xl font-extrabold text-center mb-6 dark:text-white">Get Started Now</h1>
      <div class="space-y-4">
        <div class="flex items-center justify-center">
          <label for="file" class="relative cursor-pointer">
            <div v-if="!imagePreview && !user.image"
                 class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span class="text-white text-2xl ">+</span>
            </div>
            <div v-else
                 class="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                  :src="imagePreview || `http://localhost:8000${user.image}`"
                  alt="User preview"
                  class="w-full h-full object-cover"
              />
            </div>
            <input
                type="file"
                id="file"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="handleFileChange"
            />
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Username</label>
          <input
              v-model="user.username"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              placeholder="Enter your Username"
          />
          <span v-if="errors.username" class="text-red-500 text-sm">{{ errors?.username[0] }}</span>
        </div>
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
            <span class="dark:text-white">Country</span>  <span class="text-red-500">*</span>
          </label>
          <select
              v-model="user.country_id"
              name="country"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option  class="dark:text-black">Select a country</option>
            <option v-for="country in countries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
          <span v-if="errors.country_id" class="text-red-500 text-sm">{{ errors?.country_id[0] }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
          <PasswordInput v-model="user.password" placeholder="Enter password" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Confirm Password</label>
          <PasswordInput v-model="user.confirm_password" placeholder="Confirm password" />
        </div>
        <span v-if="errors.password" class="text-red-500 text-sm">{{ errors?.password[0] }}</span>
        <div class="flex justify-center">
          <button
              @click="createUser"
              :disabled="isSubmitting"
              class="bg-gray-200 p-3 flex justify-center w-full max-w-[250px] text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm  dark:bg-gray-800 dark:text-white"
          >
            {{ isSubmitting ? 'Loading...' : 'Register' }}
          </button>
        </div>
        <div class="text-center">
          <p class="dark:text-white">
            Have an account?
            <nuxt-link to="/login" class="text-blue-500 hover:underline ">
              Sign in
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import PasswordInput from '~/components/PasswordInput.vue';

const router = useRouter();
const errors = ref({});
const imagePreview = ref(null);
const countries = ref([]);
const isSubmitting = ref(false);
const user = ref({
  username: '',
  password: '',
  confirm_password: '',
  country_id: '',
  image: '',
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    user.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const getCountries = async () => {
  const { data, error } = await useFetch(`/api/countries/`, {
    headers: { Accept: 'application/json' },
  });
  if (data) {
    countries.value = data.value;
  } else if (error) {
    console.error('Error fetching countries:', error.value);
  }
};

const createUser = async () => {
  isSubmitting.value = true;
  errors.value = {};

  if (user.value.password !== user.value.confirm_password) {
    errors.value.password = ['Passwords do not match.'];
    isSubmitting.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append('username', user.value.username);
    formData.append('password', user.value.password);
    formData.append('confirm_password', user.value.confirm_password);
    formData.append('country_id', user.value.country_id);
    if (user.value.image) {
      formData.append('image', user.value.image);
    }

    const { data, error } = await useFetch(`/api/users/`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (error && error.value) {
      if (error.value.data?.errors) {
        errors.value = error.value.data.errors;
      } else {
        errors.value = {general: 'Unknown error occurred.'};
      }
      return;
    }
    if (data) {
      await router.push('/login');
    } else {
      errors.value.general = 'Server returned an empty response.';
    }
  } catch (err) {
    console.error('Error during registration:', err);
    errors.value.general = 'Unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-2 dark:text-white">Edit User</h1>
      <div v-if="loading" class="text-center text-gray-500 dark:text-white">Loading...</div>
      <div v-else>
        <div class="mb-6">
          <div class="flex items-center justify-center">
            <label for="file" class="relative cursor-pointer">
              <div v-if="!imagePreview && !user.image"
                   class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span class="text-white text-2xl">+</span>
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
        </div>
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
           <span class="dark:text-white">Username </span>  <span class="text-red-500">*</span>
          </label>
          <input
              type="text"
              v-model="user.username"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>
        <div class="mb-8">
          <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
            <span class="dark:text-white">Country</span> <span class="text-red-500">*</span>
          </label>
          <select
              v-model="user.country_id"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option v-for="country in countries.data" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-center">
          <button
              @click="updateUser"
              class="bg-gray-200 p-3 flex justify-center w-full max-w-[250px] text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm  dark:bg-gray-800 dark:text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const loading = ref(true);
const selectedFiles = ref(null);
const imagePreview = ref(null);
const route = useRoute();
const router = useRouter();
const countries = ref([]);
const user = ref({
  username: '',
  country_id: '',
  image: ''
});

const handleFileChange = (event) => {
  selectedFiles.value = event.target.files;
  if (selectedFiles.value && selectedFiles.value[0]) {
    imagePreview.value = URL.createObjectURL(selectedFiles.value[0]);
  }
};

const getUserById = async () => {
  try {
    const data = await $fetch(`/api/users/${route.params.id}`);
    user.value = data.data[0];
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const getCountries = async () => {
  try {
    countries.value = await $fetch('/api/countries');
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

const updateUser = async () => {
  try {
    const formData = new FormData();
    formData.append("username", user.value.username);
    formData.append("country_id", user.value.country_id);
    if (selectedFiles.value?.[0]) {
      formData.append("image", selectedFiles.value[0]);
    }
    await $fetch(`/api/users/${route.params.id}`, {
      method: "POST",
      body: formData,
    });
    toast.add({
      title: 'User updated!',
      description: 'User has been successfully updated',
      color: 'green',
      timeout: 3000,
    });
    await router.push("/");
  } catch (error) {
    toast.add({
      title: 'Error!',
      description: 'Failed to update user',
      color: 'red',
      timeout: 3000,
    });
    console.error("Error updating user:", error);
  } finally {
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
  }
};


onMounted(async () => {
  await getCountries();
  await getUserById();
  loading.value = false;
});
</script>
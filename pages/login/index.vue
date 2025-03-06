<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
      <h1 class="text-3xl font-extrabold text-center mb-6 dark:text-white">Welcome back!</h1>
      <div class="space-y-4">
        <div>
          <p class="dark:text-white">Username</p>
          <input
              v-model="username"
              class="w-full p-2 border border-gray-300 rounded-lg"
              type="text"
              placeholder="Enter username"
          />
        </div>
        <div>
          <p class="dark:text-white">Password</p>
          <div>
            <label class="block text-sm font-medium"></label>
            <PasswordInput v-model="password"/>
          </div>
        </div>
        <div class="flex justify-center">
          <button
              @click="login"
              class="bg-gray-200 p-3 flex justify-center w-full max-w-[250px] text-gray-800 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm  dark:bg-gray-800 dark:text-white"
              type="button"
          >
            Login
          </button>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
      <div class="text-center mt-[10px]">
        <p class="dark:text-white">
          Don't have an account?
          <nuxt-link to="/register" class="text-blue-500 hover:underline">
            Register
          </nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import { useCookie } from '#app';
import PasswordInput from "~/components/PasswordInput.vue";

const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const router = useRouter();

const login = async () => {
  errorMessage.value = null;
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: username.value, password: password.value}),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }
    const data = await response.json();
    console.log('Login successful, redirecting...');
    const tokenCookie = useCookie('auth_token');
    tokenCookie.value = data.access_token;
    await router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Invalid username or password';
    console.error('Login failed:', err.message);
  }
};
</script>

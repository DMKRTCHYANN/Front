<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6">Welcome back!</h1>
      <div class="space-y-4">
        <div>
          <p>Username</p>
          <input
              v-model="username"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="text"
              placeholder="Enter username"
          />
        </div>
        <div>
          <p>Password</p>
          <div>
            <label class="block text-sm font-medium text-gray-700"></label>
            <PasswordInput v-model="password"/>
          </div>
        </div>
        <div class="flex justify-center">
          <button
              @click="login"
              class="bg-gray-800 p-3 flex justify-center w-full max-w-[250px] text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 transition-all duration-300 shadow-md"
              type="button"
          >
            Login
          </button>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
      <div class="text-center mt-[10px]">
        <p>
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

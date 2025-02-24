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
          <input
              v-model="password"
              class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Enter password"
          />
        </div>
        <button
            @click="login"
            class="w-full rounded-[10px] bg-black font-bold text-white px-4 py-2 cursor-pointer"
            type="button"
        >
          Login
        </button>
        <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';

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
      body: JSON.stringify({ username: username.value, password: password.value }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
    }

    const data = await response.json();
    console.log('Login successful, redirecting...');
    await router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Invalid username or password';
    console.error('Login failed:', err.message);
  }
};
</script>

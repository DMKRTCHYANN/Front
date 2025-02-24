<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-extrabold text-center mb-6">Create Country</h1>
      <input
          v-model="country.name"
          type="text"
          placeholder="Enter country name"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <div class="flex justify-center items-center">
        <button
            @click="createCountry"
            class="bg-gray-800 p-3 m-[20px] flex justify-center w-full max-w-[250px] text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-600 transition-all duration-300 shadow-md"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const country = ref({name: ""});

const createCountry = async () => {
  if (!country.value.name.trim()) {
    alert("Country name cannot be empty!");
    return;
  }
  try {
    const response = await $fetch(`/api/countries/`, {
      method: "POST",
      headers: {Accept: "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({name: country.value.name}),
    });
    console.log("The country has been successfully created", response);
    await router.push("/countries");
  } catch (error) {
    console.error("Error creating country:", error);
    if (error.response && error.response.status === 409) {
      alert("A country with this name already exists. Try another name.");
    } else {
      alert("An error occurred. Please try again later.");
    }
  }
};
</script>

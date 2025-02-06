<template>
  <div class="bg-white flex justify-center items-center h-screen">
    <div class="max-w-[900px] w-full bg-gray-200 p-[20px] rounded-[30px]">
      <h1 class="text-2xl text-center p-[30px]">Create Country</h1>
      <input
          v-model="country.name"
          type="text"
          placeholder="Enter country name"
          class="text-black mb-[20px] max-w-[900px] w-full h-[40px] p-[10px] border-2 border-white rounded-[5px] focus:outline-none focus:text-black focus:ring-2 focus:ring-black focus:shadow-[3px_3px_15px_rgba(0,255,255,1)] transition-all duration-100"
      />
      <div class="flex justify-center items-center">
        <button
            @click="createCountry"
            class="bg-green-500 p-[10px] w-[200px] text-white rounded-lg hover:bg-green-600 transition-all duration-300"
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
    const response = await $fetch(`/api/api/countries/`, {
      method: "POST",
      headers: {Accept: "application/json", "Content-Type": "application/json"},
      body: {name: country.value.name},
    });
    console.log("The country has been successfully created", response);
    await router.push("/countries");
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert("A country with this name already exists. Try another name.");
    } else {
      console.error("Error creating country:", error);
    }
  }
};
</script>

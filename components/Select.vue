<script setup>
import { nextTick, onMounted, ref } from "vue";

const countries = ref([]);
const country = ref();

const getCountries = async () => {
  try {
    const data = await $fetch('/api/countries');
    if (Array.isArray(data)) {
      countries.value = data.map((country) => ({
        label: country.name,
        value: country.id,
      }));
    } else {
      console.error("Unexpected API response:", data);
      countries.value = [];
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
    countries.value = [];
  }
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

<template>
  <USelect
      v-model="country"
      :options="countries"
      placeholder="Select a country"
  />
</template>

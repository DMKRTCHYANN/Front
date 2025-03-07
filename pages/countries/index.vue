<template>
  <div class="dark:bg-gray-900 min-h-screen">
    <div class="flex w-full h-screen">
      <div class="flex-grow p-[30px] dark:bg-gray-900">
        <div class="flex justify-end mb-[20px] z-0">
          <nuxt-link :to="`countries/countriesCreate`">
            <button
                class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition-all duration-300">
              Create new Country
            </button>
          </nuxt-link>
        </div>
        <div>
          <div v-if="isLoading" id="loading-overlay" class="space-y-4">
            <USkeleton class="h-[56px] w-full" />
            <Skeleton
                v-for="i in 5"
                :key="i"
                class="h-[56px] w-full rounded-lg"
                animation="wave"
            />
          </div>
          <div v-else>
            <UTable :rows="countries.data" :columns="columns">
              <template #actions-data="{ row }">
                <div class="flex gap-4">
                  <NuxtLink :to="`/countries/${row.id}/edit`">
                    <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 dark:invert" />
                  </NuxtLink>
                  <img
                      src="/images/delete.svg"
                      alt="Delete"
                      class="cursor-pointer w-7 h-7 dark:invert"
                      @click="handleDelete(row)"
                  />
                </div>
              </template>
            </UTable>
          </div>
        </div>
      </div>
    </div>
    <CountriesModal
        v-model="isModalOpen"
        :country="selectedCountry"
        @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import CountriesModal from '~/components/CountriesModal.vue';

definePageMeta({
  layout: "navbar",
});

const countries = ref({ data: [] });
const isLoading = ref(false);
const isModalOpen = ref(false);
const selectedCountry = ref(null);

const columns = ref([
  { key: "id", label: "ID", skeleton: "h-4 w-8" },
  { key: "name", label: "Name", skeleton: "h-4 w-8" },
  { key: "actions", label: "Actions", skeleton: "h-4 w-8" },
]);

const getCountries = async () => {
  isLoading.value = true;
  try {
    const { data } = await useFetch(`/api/countries`);
    if (data.value) {
      countries.value = data.value;
    }
  } catch (error) {
    console.error("Ошибка при загрузке стран:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = (country) => {
  selectedCountry.value = country;
  isModalOpen.value = true;
};

const confirmDelete = async () => {
  if (selectedCountry.value) {
    try {
      await $fetch(`/api/countries/${selectedCountry.value.id}`, {
        method: "DELETE",
      });
      countries.value.data = countries.value.data.filter(
          (country) => country.id !== selectedCountry.value.id
      );
    } catch (error) {
      console.error("Ошибка при удалении страны:", error);
    } finally {
      isModalOpen.value = false;
      selectedCountry.value = null;
    }
  }
};

onMounted(async () => {
  await nextTick();
  await getCountries();
});
</script>

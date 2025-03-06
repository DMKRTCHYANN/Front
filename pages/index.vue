<template>
  <div class="dark:bg-gray-900 min-h-screen">
    <div class="flex w-full h-screen">
      <div class="flex-grow">
        <div class="flex justify-between mb-[20px] z-0">
          <div class="flex-1">
            <label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>Country</span> <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-[20px]">
              <Select
                  v-model="selectedCountryId"
                  @change="fetchUsersByCountry"
              ></Select>
              <img
                  v-if="selectedCountryId"
                  src="/images/close.png"
                  alt="Close"
                  class="cursor-pointer w-4 h-4 mt-[12px] transition-all duration-300 hover:opacity-80 dark:invert"
                  @click="loadUsers"
              />
            </div>
          </div>
          <div class="flex p-[20px] gap-[20px]">
            <div>
              <img
                  @click="logout"
                  src="/images/logout.svg"
                  alt="Logout"
                  class="cursor-pointer w-10 h-10 dark:invert"
              />
            </div>
            <div class="flex justify-center items-center mb-[28px]">
              <label class="switch">
                <input
                    type="checkbox"
                    v-model="isChecked"
                    @change="toggleTheme"
                    class="opacity-0 w-0 h-0 peer"
                />
                <span class="slider"></span>
              </label>
              <!--              <UButton-->
              <!--                  :icon="colorMode.value === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"-->
              <!--                  color="gray"-->
              <!--                  variant="ghost"-->
              <!--                  aria-label="Theme"-->
              <!--                  @click="colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'"-->
              <!--              />-->
            </div>
          </div>
        </div>
        <div>
          <div>
            <div v-if="isLoading" id="loading-overlay" class="space-y-4">
              <USkeleton class="h-[56px] w-full"/>
              <Skeleton
                  v-for="i in 5"
                  :key="i"
                  class="h-[56px] w-full rounded-lg"
                  animation="wave"
              />
            </div>
            <div v-else>
              <UTable :rows="users.data" :columns="columns" @delete="handleDelete">
                <template #image-data="{ row }">
                  <img
                      :src="row.image === null ? 'http://localhost:8000/storage/images/V6Cj9SwjEqg5h7kJG6fCkO0kKaWOy1U5WtFjfthx.png' : `http://localhost:8000/storage/${row.image}`"
                      alt="User Image" class="w-12 h-12 rounded-full object-cover"/>
                </template>
                <template #actions-data="{ row }">
                  <div class="flex gap-4">
                    <NuxtLink :to="`/users/${row.id}/edit`">
                      <img src="/images/edit.svg" alt="Edit" class="cursor-pointer w-7 h-7 dark:invert"/>
                    </NuxtLink>
                    <img
                        src="/images/delete.svg"
                        alt="Delete"
                        class="cursor-pointer w-7 h-7 dark:invert"
                        @click="handleDelete(row)"
                    />
                    <Modal
                        v-model:is-open="isModalOpen"
                        :user="selectedUser"
                        @confirm="deleteUserHandler"
                    />
                  </div>
                </template>
              </UTable>
            </div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <UPagination
              v-model="page"
              :page-count="totalPages"
              :total="users.total"
              @update:model-value="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick, watch} from "vue";
import {useRouter} from "vue-router";

definePageMeta({
  middleware: ['auth'],
  layout: 'navbar',
});

const users = ref({data: [], total: 0});
const page = ref(1);
const router = useRouter();
const limit = ref(10);
const countries = ref([]);
const selectedCountryId = ref("");
const isChecked = ref(false);
const isLoading = ref(false);
const isModalOpen = ref(false);
const selectedUser = ref(null);
const columns = ref([
  {key: 'id', label: 'ID', skeleton: 'h-4 w-8'},
  {key: 'username', label: 'Username', skeleton: 'h-4 w-32'},
  {key: 'image', label: 'Img', skeleton: 'rounded-full h-12 w-12'},
  {key: 'country.name', label: 'Country', skeleton: 'h-4 w-24'},
  {key: 'created_at', label: 'Created At', skeleton: 'h-4 w-48'},
  {key: 'actions', label: 'Actions', skeleton: 'h-4 w-24'},
]);

const logout = () => {
  const authToken = useCookie("auth_token");
  authToken.value = null;
  router.push("/login");
};

const simulateLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

const handleDelete = (user) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const deleteUserHandler = async () => {
  if (selectedUser.value) {
    try {
      await $fetch(`/api/users/${selectedUser.value.id}`, {
        method: 'DELETE',
      });
      if (selectedCountryId.value) {
        await fetchUsersByCountry();
      } else {
        await getUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      isModalOpen.value = false;
      selectedUser.value = null;
    }
  }
};

const totalPages = computed(() => {
  return users.value.total ? Math.ceil(users.value.total / limit.value) : 1;
});

const getCountries = async () => {
  try {
    const data = await $fetch("/api/countries");
    countries.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching countries:", err);
    countries.value = [];
  }
};

const getCountryName = (id) => {
  const country = countries.value.find((c) => c.id === id);
  return country ? country.name : "Unknown";
};

const getUsers = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch("/api/users", {
      params: {page: page.value, limit: limit.value},
    });
    if (response) {
      users.value.data = response.data || [];
      users.value.total = response.totalPages || 0;
      limit.value = response.per_page || 10;
      totalPages.value = response.totalPages || Math.ceil(users.value.total / limit.value);
    } else {
      users.value = {data: [], total: 0};
      totalPages.value = 1;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    users.value = {data: [], total: 0};
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
};

const fetchUsersByCountry = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch("/api/users", {
      params: {
        country_id: selectedCountryId.value,
        page: page.value,
        limit: limit.value,
      },
    });
    users.value = response || {data: [], total: 0};
    users.value.data = users.value.data.map((user) => ({
      ...user,
      countryName: getCountryName(selectedCountryId.value),
    }));
  } catch (error) {
    console.error("Error fetching users by country:", error);
    users.value = {data: [], total: 0};
  } finally {
    isLoading.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    page.value = newPage;
    selectedCountryId.value ? fetchUsersByCountry() : getUsers();
  }
};

const loadUsers = async () => {
  selectedCountryId.value = "";
  await getUsers();
};

watch(page, () => {
  if (selectedCountryId.value) {
    fetchUsersByCountry();
  } else {
    getUsers();
  }
});

onMounted(async () => {
  await nextTick();
  await simulateLoading();
  await getUsers();
  await getCountries();
  if (localStorage.getItem("theme") === "dark") {
    isChecked.value = true;
    document.documentElement.classList.add("dark");
  }
});

const toggleTheme = () => {
  if (isChecked.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<style>
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #2196f3;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.4em;
  width: 1.4em;
  border-radius: 20px;
  left: 0.3em;
  bottom: 0.3em;
  background-color: yellow;
  transition: 0.4s;
}

.switch input:checked + .slider:before {
  background-color: black;
  border-radius: 50px;
  box-shadow: inset 9px 0 1px 0 white;
}

.switch input:checked + .slider {
  background-color: black;
}

.switch input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

.switch input:checked + .slider:before {
  transform: translateX(1.5em);
}

.skeleton {
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.dark .skeleton {
  background-color: #374151;
}

/* Pulse Animation */
.pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Wave Animation */
.wave::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
  );
  animation: wave 1.5s linear infinite;
}

.dark .wave::after {
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
  );
}

@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
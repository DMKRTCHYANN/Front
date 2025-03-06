<!-- layouts/navbar.vue -->
<template>
  <div class="flex">
    <UNotifications />
    <div class="w-[15%] bg-grey-300 p-[30px] dark:bg-gray-800">
      <nuxt-link to="/">
        <button class="mb-[40px] flex justify-center max-w-[200px] w-full border border-black dark:bg-gray-700 dark:text-white">
          User
        </button>
      </nuxt-link>
      <div>
        <nuxt-link to="/countries">
          <button class="flex justify-center max-w-[200px] w-full border border-black dark:bg-gray-700 dark:text-white">
            Country
          </button>
        </nuxt-link>
      </div>
    </div>
    <div class="w-[85%] bg-[#FFFFFF] p-[30px] dark:bg-gray-900">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>

</script>

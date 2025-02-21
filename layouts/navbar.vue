<template>
  <div class="flex">
    <div class="w-[15%] bg-[#FFFFFF] p-[30px]">
      <nuxt-link to="/">
        <button
            class="mb-[40px] flex justify-center max-w-[200px] w-full border border-black">
          User
        </button>
      </nuxt-link>
      <div>
        <nuxt-link to="/countries">
          <button
              class="flex justify-center max-w-[200px] w-full border border-black">
            Country
          </button>
        </nuxt-link>
      </div>
    </div>
    <div class="w-[85%] bg-[#f8f8f8] h-full p-[20px]">
      <NuxtPage />
    </div>
  </div>
</template>

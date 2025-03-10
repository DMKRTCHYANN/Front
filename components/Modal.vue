<template>
  <div>
    <UModal v-model="localIsOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Are you sure you want to delete {{ user?.username }}?
            </h3>
            <UButton
                color="gray"
                class="-my-1"
                @click="closeModal"
            >
              ✖
            </UButton>
          </div>
        </template>
        <div class="flex justify-end gap-3 mt-4">
          <UButton label="Cancel" color="gray" @click="closeModal" />
          <UButton label="Delete" color="red" @click="confirmDelete" />
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:isOpen', 'confirm']);
const localIsOpen = ref(false);
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
});

watch(
    () => props.isOpen,
    (newValue) => {
      localIsOpen.value = newValue;
    },
    {immediate: true}
);

watch(localIsOpen, (newValue) => {
  emit('update:isOpen', newValue);
});

function closeModal() {
  emit('update:isOpen', false);
  localIsOpen.value = false;
}

function confirmDelete() {
  emit('confirm');
  closeModal();
}
</script>
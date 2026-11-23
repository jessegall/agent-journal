<script setup lang="ts">
import Input from '@/components/kit/Input.vue';
import { router } from "@inertiajs/vue3";
import { ref } from "vue";
import Button from "@kit/Button";
import { createGroup } from "@generated/routes/chat";

/**
 * Opens a new group chat with a title; its members are added from its roster once it exists.
 */
const title = ref("");

function create(): void {
  if (title.value.trim() === "") {
    return;
  }

  router.post(
    createGroup().url,
    { title: title.value, userIds: [] },
    {
      preserveScroll: true,
      onSuccess: () => (title.value = ""),
    },
  );
}
</script>

<template>
  <form class="flex items-center gap-2" @submit.prevent="create">
    <Input
      v-model="title"
      name="title"
      aria-label="New chat title"
      placeholder="New chat title"
      class="flex-1 rounded-control border border-border-2 bg-transparent px-2 py-1 text-body"
    />
    <Button type="submit" size="small" variant="bordered">New chat</Button>
  </form>
</template>

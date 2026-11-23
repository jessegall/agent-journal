<script setup lang="ts">
import Icon from "@kit/Icon";
import type { IconName } from "@kit/Icon";

/**
 * One of a message's hover controls, such as React or Reply: an icon and a word with no border and no fill, as the
 * design draws them on the message's name line.
 */
defineProps<{ icon?: IconName; label?: string }>();
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex h-5 items-center gap-1 rounded-control px-1 text-badge text-text-3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
  >
    <template v-if="icon !== undefined">
      <Icon :name="icon" :size="14" />
    </template>
    <slot />
  </button>
</template>
